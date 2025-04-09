// models/Etiqueta.js
import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Etiqueta = sequelize.define("Etiqueta", {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [2, 30] }
    },
    descripcion: {
        type: DataTypes.STRING(250),
        allowNull: true
    }
}, {
    timestamps: true
});

export default Etiqueta;
