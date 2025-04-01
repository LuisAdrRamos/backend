import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Favorito = sequelize.define("Favorito", {}, { timestamps: false });

export default Favorito;
