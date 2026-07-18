import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./User.model";

interface CheckInAttributes {
    id: number;
    user_id: number;
    check_in_time?: Date;
    registered_by?: number | null;
    notes?: string;
}

interface CheckInCreationAttributes extends Optional<CheckInAttributes, "id" | "check_in_time" | "registered_by" | "notes"> {}

export class CheckIn extends Model<CheckInAttributes, CheckInCreationAttributes> implements CheckInAttributes {
    public declare id: number;
    public declare user_id: number;
    public declare readonly check_in_time: Date;
    public declare registered_by?: number | null;
    public declare notes?: string;

    // Disponibles cuando se incluyen las asociaciones
    public declare readonly usuario?: User;
    public declare readonly registradoPor?: User;
}

CheckIn.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    check_in_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    registered_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    notes: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
}, {
    sequelize,
    tableName: "check_ins",
    timestamps: false,
});
