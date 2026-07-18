import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { MembershipPlan } from "./MembershipPlan.model";
import { User } from "./User.model";

interface UserSubscriptionAttributes {
    id: number;
    user_id: number;
    plan_id: number;
    start_date: string;
    end_date: string;
    classes_used?: number;
    payment_status?: 'PENDING' | 'PAID' | 'CANCELLED';
    created_at?: Date;
}

interface UserSubscriptionCreationAttributes extends Optional<UserSubscriptionAttributes, "id" | "classes_used" | "payment_status" | "created_at"> {}

export class UserSubscription extends Model<UserSubscriptionAttributes, UserSubscriptionCreationAttributes> implements UserSubscriptionAttributes {
    public declare id: number;
    public declare user_id: number;
    public declare plan_id: number;
    public declare start_date: string;
    public declare end_date: string;
    public declare classes_used: number;
    public declare payment_status: 'PENDING' | 'PAID' | 'CANCELLED';
    public declare readonly created_at: Date;

    // Disponibles cuando se incluyen las asociaciones
    public declare readonly plan?: MembershipPlan;
    public declare readonly usuario?: User;
}

UserSubscription.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    classes_used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    payment_status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'CANCELLED'),
        defaultValue: 'PENDING',
    }
}, {
    sequelize,
    tableName: "user_subscriptions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
});
