import Disfraz from "../models/Disfraces.js";
import Festividad from "../models/festividad.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// 🔹 Listar todos los disfraces
const listarDisfraces = async (req, res) => {
    try {
        const disfraces = await Disfraz.findAll({
            include: {
                model: Festividad,
                as: "festividad", // 👈 alias obligatorio
                attributes: ["id", "nombre", "mes", "dia"]
            },
            order: [["createdAt", "DESC"]]
        });
        res.status(200).json(disfraces);
    } catch (error) {
        console.error("❌ Error al listar disfraces:", error);
        res.status(500).json({ msg: "❌ Error al listar los disfraces", error });
    }
};

// 🔹 Detalle de un disfraz
const detalleDisfraces = async (req, res) => {
    const { id } = req.params;
    try {
        const disfraz = await Disfraz.findByPk(id, {
            include: {
                model: Festividad,
                as: "festividad",
                attributes: ["id", "nombre", "mes", "dia"]
            }
        });

        if (!disfraz) return res.status(404).json({ msg: "❌ Disfraz no encontrado" });
        res.status(200).json(disfraz);
    } catch (error) {
        console.error("❌ Error al buscar el disfraz:", error);
        res.status(500).json({ msg: "❌ Error al buscar el disfraz", error });
    }
};

// 🔹 Registrar nuevo disfraz
const registrarDisfraz = async (req, res) => {
    try {
        const { nombre, categoria, precio, calidad, descripcion, talla, festividadId } = req.body;

        if (!nombre || !categoria || !precio || !calidad || !descripcion || !talla || !festividadId) {
            return res.status(400).json({ msg: "❌ Todos los campos son necesarios" });
        }

        const imagenUrl = req.file ? req.file.path : null;

        const disfraz = await Disfraz.create({
            nombre, categoria, precio, calidad, descripcion, talla,
            imagen: imagenUrl,
            FestividadId: festividadId
        });

        res.status(201).json({ msg: "✅ Disfraz registrado exitosamente", disfraz });
    } catch (error) {
        console.error("❌ Error al registrar el disfraz:", error);
        res.status(500).json({ msg: "❌ Error al registrar el disfraz", error });
    }
};

// 🔹 Actualizar disfraz
const actualizarDisfraz = async (req, res) => {
    const { id } = req.params;
    const { nombre, categoria, precio, calidad, descripcion, talla, festividadId } = req.body;

    try {
        const disfraz = await Disfraz.findByPk(id);
        if (!disfraz) return res.status(404).json({ msg: "❌ Disfraz no encontrado" });

        disfraz.nombre = nombre || disfraz.nombre;
        disfraz.categoria = categoria || disfraz.categoria;
        disfraz.precio = precio || disfraz.precio;
        disfraz.calidad = calidad || disfraz.calidad;
        disfraz.descripcion = descripcion || disfraz.descripcion;
        disfraz.talla = talla || disfraz.talla;
        disfraz.FestividadId = festividadId || disfraz.FestividadId;

        if (req.file) {
            disfraz.imagen = req.file.path;
        }

        await disfraz.save();
        res.status(200).json({ msg: "✅ Disfraz actualizado", disfraz });

    } catch (error) {
        console.error("❌ Error al actualizar disfraz:", error);
        res.status(500).json({ msg: "❌ Error al actualizar disfraz", error });
    }
};

// 🔹 Eliminar disfraz
const eliminarDisfraces = async (req, res) => {
    const { id } = req.params;
    try {
        const disfraz = await Disfraz.findByPk(id);
        if (!disfraz) return res.status(404).json({ msg: "❌ Disfraz no encontrado" });

        await disfraz.destroy();
        res.status(200).json({ msg: "✅ Disfraz eliminado exitosamente" });
    } catch (error) {
        console.error("❌ Error al eliminar disfraz:", error);
        res.status(500).json({ msg: "❌ Error al eliminar disfraz", error });
    }
};

export {
    listarDisfraces,
    detalleDisfraces,
    registrarDisfraz,
    actualizarDisfraz,
    eliminarDisfraces
};
