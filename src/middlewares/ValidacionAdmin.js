import { check, validationResult } from 'express-validator';

export const validacionAdmin = [
    check("nombre")
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3, max: 12 }).withMessage('El nombre debe tener entre 3 y 12 caracteres')
        .isAlpha('es-ES', { ignore: 'áéíóúÁÉÍÓÚñÑ' }).withMessage('El nombre debe contener solo letras')
        .trim(),

    check("apellido")
        .notEmpty().withMessage('El apellido es obligatorio')
        .isLength({ min: 3, max: 12 }).withMessage('El apellido debe tener entre 3 y 12 caracteres')
        .isAlpha('es-ES', { ignore: 'áéíóúÁÉÍÓÚñÑ' }).withMessage('El apellido debe contener solo letras')
        .trim(),

    check("direccion")
        .notEmpty().withMessage('La dirección es obligatoria')
        .isLength({ min: 3, max: 20 }).withMessage('La dirección debe tener entre 3 y 20 caracteres')
        .trim(),

    check("telefono")
        .notEmpty().withMessage('El teléfono es obligatorio')
        .isLength({ min: 10 }).withMessage('El teléfono debe tener al menos 10 dígitos')
        .isNumeric().withMessage('El teléfono debe contener solo números')
        .trim(),

    check("email")
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('El correo no tiene formato válido')
        .trim(),

    check("password")
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 5 }).withMessage('La contraseña debe tener al menos 5 caracteres')
        .trim(),
    check("tipo")
    .optional() // Permite que no se envíe (para usar default: "moderador"), pero si viene, debe ser válido
    .isIn(['general', 'moderador']).withMessage('El tipo debe ser "general" o "moderador"')
    .trim(),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() });
        }
        next();
    }
];
