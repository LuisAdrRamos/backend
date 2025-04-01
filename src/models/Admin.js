import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import bcrypt from "bcryptjs";

const Admin = sequelize.define("Admin", {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    direccion: DataTypes.STRING,
    telefono: DataTypes.STRING,
    email: { 
        type: DataTypes.STRING, unique: true, allowNull: false 
    },
    password: { 
        type: DataTypes.STRING, allowNull: false 
    },
    rol: {
        type: DataTypes.ENUM("admin", "moderador"),
        defaultValue: "moderador"
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
    token: DataTypes.STRING
}, {
    timestamps: true,
    hooks: {
        beforeCreate: async (admin) => {
            if (admin.password) {
                const salt = await bcrypt.genSalt(10);
                admin.password = await bcrypt.hash(admin.password, salt);
            }
        },
        beforeUpdate: async (admin) => {
            if (admin.changed("password")) {
                const salt = await bcrypt.genSalt(10);
                admin.password = await bcrypt.hash(admin.password, salt);
            }
        }
    }
});

// Método para verificar password
Admin.prototype.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default Admin;
