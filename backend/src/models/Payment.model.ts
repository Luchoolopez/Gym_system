import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { UserSubscription } from "./UserSubscription.model";

interface PaymentAttributes {
    id: number;
    subscription_id: number;
    amount: number;
    payment_method: 'CASH' | 'TRANSFER' | 'CARD' | 'MERCADOPAGO';
    payment_date: string;
    registered_by?: number | null;
    notes?: string;
    created_at?: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, "id" | "registered_by" | "notes" | "created_at"> {}

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
    public declare id!: number;
    public declare subscription_id!: number;
    public declare amount!: number;
    public declare payment_method!: 'CASH' | 'TRANSFER' | 'CARD' | 'MERCADOPAGO';
    public declare payment_date!: string;
    public declare registered_by?: number | null;
    public declare notes?: string;
    public declare readonly created_at!: Date;

    // Disponible cuando se incluye la asociación 'suscripcion'
    public declare readonly suscripcion?: UserSubscription;
}

Payment.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    subscription_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.ENUM('CASH', 'TRANSFER', 'CARD', 'MERCADOPAGO'),
        allowNull: false,
    },
    payment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
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
    tableName: "payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
});
