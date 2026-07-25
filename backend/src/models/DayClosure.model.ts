import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./User.model";

interface DayClosureAttributes {
    id: number;
    closure_date: string;
    closed_by?: number | null;
    total_checkins: number;
    total_income: number;
    notes?: string;
    created_at?: Date;
}

interface DayClosureCreationAttributes extends Optional<DayClosureAttributes, "id" | "closed_by" | "total_checkins" | "total_income" | "notes" | "created_at"> {}

export class DayClosure extends Model<DayClosureAttributes, DayClosureCreationAttributes> implements DayClosureAttributes {
    public declare id: number;
    public declare closure_date: string;
    public declare closed_by?: number | null;
    public declare total_checkins: number;
    public declare total_income: number;
    public declare notes?: string;
    public declare readonly created_at: Date;

    // Disponible cuando se incluye la asociación 'cerradoPor'
    public declare readonly cerradoPor?: User;
}

DayClosure.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    closure_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true, // un solo cierre por día
    },
    closed_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    total_checkins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    total_income: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    notes: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
}, {
    sequelize,
    tableName: "day_closures",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
});
