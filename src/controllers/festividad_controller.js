import festividad from "../models/festividad";

// Crear una festividad
const crearFestividad = async (req, res) => {
    try {
        const festividades = new festividad(req.body)
        await festividades.save()
        res.status(201).json({ msg: "Festividad creada exitosamente", festividades })

    } catch (error) {
        res.status(500).json({ msg: "Error al crear festividad", error })
    }
}


// Obtener todas las festividades por mes
const obtenerFestividades = async (req, res) => {
    try {
        const festividades = await festividad.find();
        res.status(200).json(festividades);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener festividades", error });
    }
}


// Obtener todas las festividades agrupadas por mes
const listarFestividadesPorMes = async (req, res) => {
    try {
        const festividades = await festividad.aggregate([
            { $group: { _id: "$mes", festividades: { $push: "$$ROOT" } } },
            { $sort: { "_id": 1 } }
        ]);
        res.status(200).json(festividades);
    } catch (error) {
        res.status(500).json({ msg: "Error al listar festividades por mes", error });
    }
};


// Actualizar festividad
const actualizarFestividad = async (req, res) => {
    const {id} = req.params
    try {
        const festividades = await festividad.findByIdAndUpdate(id, req.body, {new: true})
        res.status(200).json({ msg: "Festividad actualizada exitosamente", festividades})

    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar festividad", error })
    }
}


// Eliminar festividad
const eliminarFestividad = async (req, res) => {
    const {id} = req.params
    try {
        await festividad.findByIdAndDelete(id)
        res.status(200).json({ msg: "Festividad eliminada exitosamente" })

    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar festividad", error })
    }
}

export {
    crearFestividad,
    obtenerFestividades,
    listarFestividadesPorMes,
    actualizarFestividad,
    eliminarFestividad
}