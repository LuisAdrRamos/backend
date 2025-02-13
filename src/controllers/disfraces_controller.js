import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Disfraz from "../models/Disfraces.js";
import fs from "fs"; // Para eliminar archivos temporales

// Método para listar todos los periféricos
const listarDisfraces = async (req, res) => {
    try {
        const disfraces = await Disfraz.find({}).select("-createdAt -updatedAt -__v");
        res.status(200).json(disfraces);
    } catch (error) {
        console.log("❌ Error al listar los disfraces:", error);
        res.status(500).json({ msg: "❌ Error al listar los disfraces", error });
    }
};

// Método para obtener el detalle de un periférico
const detalleDisfraces = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ msg: `❌ Lo sentimos, no existe ese disfraz` });

    const disfraces = await Disfraz.findById(id);
    if (!disfraces) 
        return res.status(404).json({ msg: "❌ disfraz no encontrado" });

    res.status(200).json(disfraces);
};


// Método para registrar un disfraz
const registrarDisfraz = async (req, res) => {
    try {
        const { nombre, categoria, precio, calidad, descripcion, talla } = req.body;

        if (!nombre || !categoria || !precio || !calidad || !descripcion || !talla) {
            return res.status(400).json({ msg: "❌ Todos los campos son necesarios" });
        }

        let imagenUrl = req.file ? req.file.path : null;

        const disfraz = new Disfraz({
            nombre,
            categoria,
            precio,
            calidad,
            descripcion,
            talla,
            imagen: imagenUrl,
        });

        await disfraz.save();
        res.status(201).json({ msg: `✅ Registro exitoso del disfraz ${disfraz._id}`, disfraz });
    } catch (error) {
        console.error("❌ Error al registrar el disfraz:", error);
        res.status(500).json({ msg: "❌ Error al registrar el disfraz", error });
    }
};


// Método para actualizar un disfraz
const actualizarDisfraz = async (req, res) => {
    const { id } = req.params;
    const { nombre, categoria, precio, calidad, descripcion, talla } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `❌ Lo sentimos, no existe el disfraz ${id}` });
    }

    try {
        // Buscar el disfraz antes de actualizar
        const disfraz = await Disfraz.findById(id);
        if (!disfraz) {
            return res.status(404).json({ msg: "❌ Disfraz no encontrado" });
        }

        // Actualizar solo los campos enviados en la solicitud
        disfraz.nombre = nombre || disfraz.nombre;
        disfraz.categoria = categoria || disfraz.categoria;
        disfraz.precio = precio || disfraz.precio;
        disfraz.calidad = calidad || disfraz.calidad;
        disfraz.descripcion = descripcion || disfraz.descripcion;
        disfraz.talla = talla || disfraz.talla;

        // Manejo de la imagen (si se sube una nueva)
        if (req.file) { 
            disfraz.imagen = req.file.path;
        }

        // Guardar cambios en la base de datos
        await disfraz.save();

        res.status(200).json({ msg: "✅ Disfraz actualizado con éxito", disfraz });
    } catch (error) {
        console.error("❌ Error al actualizar el disfraz:", error);
        res.status(500).json({ msg: "❌ Error al actualizar el disfraz", error });
    }
};


// Método para eliminar un periférico
const eliminarDisfraces = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ msg: `❌ Lo sentimos, no existe el difraz ${id}` });

    const disfrazEliminado  = await Disfraz.findByIdAndDelete(id);
    if (!disfrazEliminado )
        return res.status(404).json({ msg: "❌ Disfraz no encontrado" });

    res.status(200).json({ msg: "✅ Disfraz eliminado exitosamente" });
};

// Exportar los controladores
export {
    detalleDisfraces,
    registrarDisfraz,
    actualizarDisfraz,
    eliminarDisfraces,
    listarDisfraces
};