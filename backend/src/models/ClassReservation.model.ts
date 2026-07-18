import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { Schedule } from "./Schedule.model";
import { User } from "./User.model";

export type ReservationStatus = 'RESERVED' | 'CANCELLED' | 'ATTENDED' | 'NO_SHOW';

interface ClassReservationAttributes {
    id: number;
    user_id: number;
    schedule_id: number;
    reservation_date: string;
    status?: ReservationStatus;
    created_at?: Date;
    updated_at?: Date;
}

interface ClassReservationCreationAttributes extends Optional<ClassReservationAttributes, "id" | "status" | "created_at" | "updated_at"> {}

export class ClassReservation extends Model<ClassReservationAttributes, ClassReservationCreationAttributes> implements ClassReservationAttributes {
    public declare id!: number;
    public declare user_id!: number;
    public declare schedule_id!: number;
    public declare reservation_date!: string;
    public declare status!: ReservationStatus;
    public declare readonly created_at!: Date;
    public declare readonly updated_at!: Date;

    // Disponibles cuando se incluyen las asociaciones
    public declare readonly horario?: Schedule;
    public declare readonly usuario?: User;
}

ClassReservation.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    schedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reservation_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('RESERVED', 'CANCELLED', 'ATTENDED', 'NO_SHOW'),
        defaultValue: 'RESERVED',
    }
}, {
    sequelize,
    tableName: "class_reservations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
        {
            unique: true,
            name: "unique_user_reservation",
            fields: ["user_id", "schedule_id", "reservation_date"],
        }
    ]
});
