// associations.js
import Usuario from "./Usuario.js";      // ✅ sin "models/"
import Disfraz from "./Disfraces.js";      // ✅
import Festividad from "./festividad.js";
import Favorito from "./favoritos.js";

// Relación 1:N
Disfraz.belongsTo(Festividad, {
    foreignKey: 'FestividadId',
    as: 'festividad',
    onDelete: 'SET NULL'
});

Festividad.hasMany(Disfraz, {
    foreignKey: 'FestividadId',
    as: 'disfraces'
});

// Relación muchos-a-muchos
Usuario.belongsToMany(Disfraz, { through: Favorito, as: "favoritos" });
Disfraz.belongsToMany(Usuario, { through: Favorito, as: "usuariosFavoritos" });

export { Usuario, Disfraz, Festividad };
