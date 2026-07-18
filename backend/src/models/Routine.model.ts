import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./User.model";

interface RoutineAttributes {
    id: number;
    professor_id: number;
    user_id: number;
    title: string;
    content: string;
    created_at?: Date;
    updated_at?: Date;
}

interface RoutineCreationAttributes extends Optional<RoutineAttributes, "id" | "created_at" | "updated_at"> {}

export class Routine extends Model<RoutineAttributes, RoutineCreationAttributes> implements RoutineAttributes {
    public declare id: number;
    public declare professor_id: number;
    public declare user_id: number;
    public declare title: string;
    public declare content: string;
    public declare readonly created_at: Date;
    public declare readonly updated_at: Date;

    // Disponibles cuando se incluyen las asociaciones
    public declare readonly profesor?: User;
    public declare readonly usuario?: User;
}

Routine.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    professor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false, // Texto plano o JSON estructurado (ejercicios, series, reps)
    }
}, {
    sequelize,
    tableName: "routines",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
