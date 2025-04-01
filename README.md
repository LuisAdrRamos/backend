
# 🎭 Megadistraz API

La **API de Megadistraz** proporciona un backend completo para gestionar usuarios, administradores, festividades y disfraces, con autenticación, subida de imágenes y manejo personalizado de favoritos. Esta API fue diseñada para servir a una plataforma web de catálogo de disfraces, donde los usuarios pueden explorar, filtrar, marcar como favoritos y actualizar su información, mientras que los administradores gestionan el contenido y los usuarios.

## Endpoints disponibles

- `/api/admin` – Administración de login, perfil y gestión de moderadores  
- `/api/usuario` – Registro, login, perfil, recuperación de contraseña y favoritos  
- `/api/festividad` – CRUD completo de festividades  
- `/api/disfraz` – CRUD de disfraces con subida de imágenes a Cloudinary  

---

## 🚀 Guía de inicio

Para comenzar a usar la **API de Megadistraz**, necesitas:

- Tener una cuenta registrada como administrador o usuario (registro/login mediante los endpoints públicos)
- Obtener un token JWT al iniciar sesión
- Incluir el token en el encabezado de todas las rutas protegidas con el siguiente formato:

```
Authorization: Bearer <tu_token>
```

- Utilizar Postman o cualquier cliente HTTP que soporte JWT + multipart/form-data para realizar pruebas
- En producción, asegurarte de contar con una conexión HTTPS

🔐 La autenticación es obligatoria para la mayoría de operaciones relacionadas a perfiles, disfraces, festividades y favoritos.

---

## 🔐 Autenticación

La **API de Megadistraz** utiliza **JWT (JSON Web Tokens)** para la autenticación de usuarios y administradores.

### Pasos

1. El usuario o administrador inicia sesión usando `/api/usuario/login` o `/api/admin/login`  
2. El backend responde con un token JWT  
3. Ese token debe ser enviado en todas las peticiones protegidas en el header:

```
Authorization: Bearer <tu_token_jwt>
```

### Respuesta en caso de error de autenticación

```json
{
  "msg": "❌ Usuario no autenticado"
}
```

Código HTTP: `401 Unauthorized`

---

## 📊 Límites de uso

Actualmente, esta API **no aplica límites de uso** durante su fase de desarrollo local.

Sin embargo, se recomienda establecer límites cuando se despliegue en producción.

### Posibles cabeceras futuras

| Cabecera                | Descripción                                                     |
|-------------------------|-----------------------------------------------------------------|
| `X-RateLimit-Limit`     | Número máximo de solicitudes permitidas por minuto             |
| `X-RateLimit-Remaining` | Solicitudes restantes en la ventana de tiempo actual           |
| `X-RateLimit-Reset`     | Tiempo en el que se reinicia el contador, en formato epoch UTC |

---

## 🧪 Pruebas con Postman

Podés estructurar tu colección de pruebas en Postman con los siguientes grupos:

- 🟢 **Autenticación Pública** (registro/login de usuario y administrador)  
- 🔐 **Perfil y Cuenta** (ver perfil, actualizar datos y contraseña)  
- 🎭 **Disfraces** (crear, listar, detalle, actualizar, eliminar)  
- 📅 **Festividades** (crear, listar, filtrar por mes, actualizar, eliminar)  
- ⭐ **Favoritos** (agregar, eliminar y ver lista de favoritos del usuario)

> La subida de imágenes de disfraces utiliza `multipart/form-data` y se almacena en Cloudinary.

---

## 🆘 ¿Necesitás ayuda?

En caso de dudas o problemas:

- Revisá nuestros tutoriales en video ((link al tutorial))  
- Consultá el repositorio del backend ((link a GitHub, si aplica))  
- Visitá nuestro foro/comunidad de desarrollo ((link al foro si aplica))  

También podés solicitar ejemplos de integración desde frontend (React, Vue, etc.) en la sección de recursos para desarrolladores ((link si aplica)).
