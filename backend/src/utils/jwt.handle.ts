import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno");
}

export const generateToken = (id: number, role: string) => {
    return jwt.sign({ id, role }, JWT_SECRET, {
        expiresIn: "8h",
    });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};
