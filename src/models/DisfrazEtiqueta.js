import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const DisfrazEtiqueta = sequelize.define("DisfrazEtiqueta", {
    DisfrazId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    EtiquetaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false
});

export default DisfrazEtiqueta;
