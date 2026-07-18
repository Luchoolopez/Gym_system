import { Op } from "sequelize";
import { User, Role } from "../models/index";
import { CreateUserType, UpdateUserType, UpdateProfileType } from "../validations/user.validation";
import { encrypt } from "../utils/password.handle";

export class UserService {

    async getUsuarios(page: number = 1, limit: number = 20, rol?: string, busqueda?: string) {
        const offset = (page - 1) * limit;

        const where: any = {};
        if (busqueda) {
            where[Op.or] = [
                { first_name: { [Op.like]: `%${busqueda}%` } },
                { last_name: { [Op.like]: `%${busqueda}%` } },
                { email: { [Op.like]: `%${busqueda}%` } },
                { dni: { [Op.like]: `%${busqueda}%` } }
            ];
        }

        const include: any = [{ model: Role, as: 'role', ...(rol ? { where: { name: rol } } : {}) }];

        const { count: totalItems, rows: usuarios } = await User.findAndCountAll({
            where,
            include,
            offset,
            limit,
            order: [['created_at', 'DESC']]
        });

        return {
            items: usuarios.map(u => this.mapToDto(u)),
            totalItems,
            page,
            limit
        };
    }

    async getUsuarioById(userId: number) {
        const user = await User.findByPk(userId, {
            include: [{ model: Role, as: 'role' }]
        });
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return this.mapToDto(user);
    }

    async createUsuario(createData: CreateUserType) {
        const existingUser = await User.findOne({ where: { email: createData.email } });
        if (existingUser) {
            throw new Error("El email ya esta registrado");
        }

        if (createData.dni) {
            const existingDni = await User.findOne({ where: { dni: createData.dni } });
            if (existingDni) {
                throw new Error("El DNI ya esta registrado");
            }
        }

        const role = await Role.findOne({ where: { name: createData.rol || 'User' } });
        if (!role) {
            throw new Error("Rol no encontrado");
        }

        const newUser = await User.create({
            role_id: role.id,
            first_name: createData.nombre,
            last_name: createData.apellido,
            email: createData.email,
            password_hash: await encrypt(createData.password),
            dni: createData.dni,
            phone: createData.telefono,
            is_active: createData.activo ?? true
        });

        return this.getUsuarioById(newUser.id);
    }

    async updateUsuario(userId: number, updateData: UpdateUserType) {
        const userToUpdate = await User.findByPk(userId);
        if (!userToUpdate) {
            throw new Error("Usuario no encontrado");
        }

        if (updateData.email !== undefined && updateData.email !== userToUpdate.email) {
            const existingUser = await User.findOne({ where: { email: updateData.email } });
            if (existingUser) {
                throw new Error("El email ya esta registrado");
            }
            userToUpdate.email = updateData.email;
        }

        if (updateData.dni !== undefined && updateData.dni !== userToUpdate.dni) {
            const existingDni = await User.findOne({ where: { dni: updateData.dni } });
            if (existingDni) {
                throw new Error("El DNI ya esta registrado");
            }
            userToUpdate.dni = updateData.dni;
        }

        if (updateData.rol !== undefined) {
            const role = await Role.findOne({ where: { name: updateData.rol } });
            if (!role) {
                throw new Error("Rol no encontrado");
            }
            userToUpdate.role_id = role.id;
        }

        if (updateData.nombre !== undefined) {
            userToUpdate.first_name = updateData.nombre;
        }
        if (updateData.apellido !== undefined) {
            userToUpdate.last_name = updateData.apellido;
        }
        if (updateData.password !== undefined) {
            userToUpdate.password_hash = await encrypt(updateData.password);
        }
        if (updateData.telefono !== undefined) {
            userToUpdate.phone = updateData.telefono;
        }
        if (updateData.activo !== undefined) {
            userToUpdate.is_active = updateData.activo;
        }

        await userToUpdate.save();

        return this.getUsuarioById(userToUpdate.id);
    }

    async updatePerfil(userId: number, updateData: UpdateProfileType) {
        return this.updateUsuario(userId, updateData);
    }

    async deleteUsuario(userId: number) {
        const userToDelete = await User.findByPk(userId);
        if (!userToDelete) {
            throw new Error("Usuario no encontrado");
        }

        userToDelete.is_active = false;
        await userToDelete.save();

        return true;
    }

    private mapToDto(u: User) {
        return {
            id: u.id,
            nombre: u.first_name,
            apellido: u.last_name,
            email: u.email,
            dni: u.dni,
            telefono: u.phone,
            rol: u.role?.name,
            activo: u.is_active,
            fechaCreacion: u.created_at
        };
    }
}
