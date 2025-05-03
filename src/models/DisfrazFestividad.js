import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const DisfrazFestividad = sequelize.define("DisfrazFestividad", {
    DisfrazId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    FestividadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false
});

export default DisfrazFestividad;