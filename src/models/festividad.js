import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Festividad = sequelize.define("Festividad", {
    nombre: { 
        type: DataTypes.STRING, allowNull: false 
    },
    descripcion: { 
        type: DataTypes.STRING 
    },
    mes: { 
        type: DataTypes.STRING, allowNull: false 
    },
    dia: { 
        type: DataTypes.INTEGER, allowNull: false 
    },
}, {
    timestamps: true
});

export default Festividad;
