import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface PasswordResetTokenAttributes {
    id: number;
    user_id: number;
    token_hash: string;
    expires_at: Date;
    used?: boolean;
    created_at?: Date;
}

interface PasswordResetTokenCreationAttributes extends Optional<PasswordResetTokenAttributes, "id" | "used" | "created_at"> {}

export class PasswordResetToken extends Model<PasswordResetTokenAttributes, PasswordResetTokenCreationAttributes> implements PasswordResetTokenAttributes {
    public declare id!: number;
    public declare user_id!: number;
    public declare token_hash!: string;
    public declare expires_at!: Date;
    public declare used!: boolean;
    public declare readonly created_at!: Date;
}

PasswordResetToken.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    token_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize,
    tableName: "password_reset_tokens",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
});
