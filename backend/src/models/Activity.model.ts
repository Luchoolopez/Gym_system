import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ActivityAttributes {
    id: number;
    name: string;
    description?: string;
    is_active?: boolean;
    created_at?: Date;
}

interface ActivityCreationAttributes extends Optional<ActivityAttributes, "id" | "description" | "is_active" | "created_at"> {}

export class Activity extends Model<ActivityAttributes, ActivityCreationAttributes> implements ActivityAttributes {
    public declare id!: number;
    public declare name!: string;
    public declare description?: string;
    public declare is_active!: boolean;
    public declare readonly created_at!: Date;
}

Activity.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    sequelize,
    tableName: "activities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
});
