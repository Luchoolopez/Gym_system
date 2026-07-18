import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { Activity } from "./Activity.model";
import { User } from "./User.model";

export type DayOfWeek = 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo';

interface ScheduleAttributes {
    id: number;
    activity_id: number;
    day_of_week: DayOfWeek;
    start_time: string;
    end_time: string;
    professor_id?: number | null;
    room?: string;
    capacity?: number | null;
    is_active?: boolean;
}

interface ScheduleCreationAttributes extends Optional<ScheduleAttributes, "id" | "professor_id" | "room" | "capacity" | "is_active"> {}

export class Schedule extends Model<ScheduleAttributes, ScheduleCreationAttributes> implements ScheduleAttributes {
    public declare id: number;
    public declare activity_id: number;
    public declare day_of_week: DayOfWeek;
    public declare start_time: string;
    public declare end_time: string;
    public declare professor_id?: number | null;
    public declare room?: string;
    public declare capacity?: number | null;
    public declare is_active: boolean;

    // Disponibles cuando se incluyen las asociaciones
    public declare readonly actividad?: Activity;
    public declare readonly profesor?: User;
}

Schedule.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    activity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    day_of_week: {
        type: DataTypes.ENUM('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'),
        allowNull: false,
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    professor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    room: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: true, // NULL = sin límite de cupo
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    sequelize,
    tableName: "schedules",
    timestamps: false,
});
