import { AppError } from "../utils/app.error";
import crypto from "crypto";
import { Op } from "sequelize";
import { User, Role, PasswordResetToken } from "../models/index";
import { RegisterUserType, LoginUserType, ResetPasswordType } from "../validations/user.validation";
import { encrypt, verified } from "../utils/password.handle";
import { generateToken } from "../utils/jwt.handle";

export class AuthService {

    async register(registerData: RegisterUserType) {
        const existingUser = await User.findOne({ where: { email: registerData.email } });
        if (existingUser) {
            throw new AppError("El email ya esta registrado", 409);
        }

        if (registerData.dni) {
            const existingDni = await User.findOne({ where: { dni: registerData.dni } });
            if (existingDni) {
                throw new AppError("El DNI ya esta registrado", 409);
            }
        }

        const userRole = await Role.findOne({ where: { name: 'User' } });
        if (!userRole) {
            throw new AppError("Rol base no encontrado", 500);
        }

        const hashedPassword = await encrypt(registerData.password);

        const newUser = await User.create({
            role_id: userRole.id,
            first_name: registerData.nombre,
            last_name: registerData.apellido,
            email: registerData.email,
            password_hash: hashedPassword,
            dni: registerData.dni,
            phone: registerData.telefono
        });

        const accessToken = generateToken(newUser.id, userRole.name);

        return {
            usuario: this.mapToDto(newUser, userRole.name),
            accessToken
        };
    }

    async login(loginData: LoginUserType) {
        const user = await User.findOne({
            where: { email: loginData.email },
            include: [{ model: Role, as: 'role' }]
        });
        if (!user || !user.role) {
            throw new AppError("Credenciales invalidas", 401);
        }

        if (!user.is_active) {
            throw new AppError("Cuenta inactiva", 401);
        }

        const isValidPassword = await verified(loginData.password, user.password_hash);
        if (!isValidPassword) {
            throw new AppError("Credenciales invalidas", 401);
        }

        const accessToken = generateToken(user.id, user.role.name);

        return {
            usuario: this.mapToDto(user, user.role.name),
            accessToken
        };
    }

    async getProfile(userId: number) {
        const user = await User.findByPk(userId, {
            include: [{ model: Role, as: 'role' }]
        });
        if (!user || !user.role) {
            throw new AppError("Usuario no encontrado", 404);
        }

        return this.mapToDto(user, user.role.name);
    }

    async forgotPassword(email: string) {
        const user = await User.findOne({ where: { email } });
        // No revelamos si el email existe o no
        if (!user) {
            return { message: "Si el email existe, se generó un token de recuperación" };
        }

        // Limpieza oportunista: se borran los tokens ya usados o vencidos del usuario
        await PasswordResetToken.destroy({
            where: {
                user_id: user.id,
                [Op.or]: [
                    { used: true },
                    { expires_at: { [Op.lt]: new Date() } }
                ]
            }
        });

        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Expira en 1 hora

        await PasswordResetToken.create({
            user_id: user.id,
            token_hash: tokenHash,
            expires_at: expiresAt
        });

        // TODO: enviar el token por email. Por ahora se devuelve en la respuesta (solo desarrollo).
        return {
            message: "Si el email existe, se generó un token de recuperación",
            token
        };
    }

    async resetPassword(resetData: ResetPasswordType) {
        const tokenHash = crypto.createHash("sha256").update(resetData.token).digest("hex");

        const resetToken = await PasswordResetToken.findOne({
            where: {
                token_hash: tokenHash,
                used: false,
                expires_at: { [Op.gt]: new Date() }
            }
        });
        if (!resetToken) {
            throw new AppError("Token invalido o expirado", 400);
        }

        const user = await User.findByPk(resetToken.user_id);
        if (!user) {
            throw new AppError("Usuario no encontrado", 404);
        }

        user.password_hash = await encrypt(resetData.password);
        await user.save();

        resetToken.used = true;
        await resetToken.save();

        return { message: "Contraseña actualizada exitosamente" };
    }

    private mapToDto(user: User, roleName: string) {
        return {
            id: user.id,
            nombre: user.first_name,
            apellido: user.last_name,
            email: user.email,
            dni: user.dni,
            telefono: user.phone,
            rol: roleName,
            activo: user.is_active
        };
    }
}
