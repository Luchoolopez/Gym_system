import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface MembershipPlanAttributes {
    id: number;
    name: string;
    description?: string;
    price: number;
    duration_days: number;
    class_limit?: number | null;
    featured?: boolean;
    is_active?: boolean;
    created_at?: Date;
}

interface MembershipPlanCreationAttributes extends Optional<MembershipPlanAttributes, "id" | "description" | "class_limit" | "featured" | "is_active" | "created_at"> {}

export class MembershipPlan extends Model<MembershipPlanAttributes, MembershipPlanCreationAttributes> implements MembershipPlanAttributes {
    public declare id: number;
    public declare name: string;
    public declare description?: string;
    public declare price: number;
    public declare duration_days: number;
    public declare class_limit?: number | null;
    public declare featured: boolean;
    public declare is_active: boolean;
    public declare readonly created_at: Date;
}

MembershipPlan.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    duration_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    class_limit: {
        type: DataTypes.INTEGER,
        allowNull: true, // NULL = pase libre
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // El plan "destacado" en la landing (uno solo a la vez)
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    sequelize,
    tableName: "membership_plans",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
});
