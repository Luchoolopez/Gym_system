import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface RoleAttributes {
    id: number;
    name: string;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, "id"> {}

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    public declare id!: number;
    public declare name!: string;
}

Role.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    }
}, {
    sequelize,
    tableName: "roles",
    timestamps: false,
});
