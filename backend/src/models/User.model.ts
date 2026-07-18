import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { Role } from "./Role.model";

interface UserAttributes {
    id: number;
    role_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    dni?: string;
    phone?: string;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "dni" | "phone" | "is_active" | "created_at" | "updated_at"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public declare id: number;
    public declare role_id: number;
    public declare first_name: string;
    public declare last_name: string;
    public declare email: string;
    public declare password_hash: string;
    public declare dni?: string;
    public declare phone?: string;
    public declare is_active: boolean;
    public declare readonly created_at: Date;
    public declare readonly updated_at: Date;

    // Disponible cuando se incluye la asociación 'role'
    public declare readonly role?: Role;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    dni: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    sequelize,
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
