import { z } from 'zod';

const userSchema = z.object({
    username: z.string({
        invalid_type_error: "El nombre de usuario debe ser una cadena de caracteres",
        message: 'El nombre de usuario debe ser una cadena de caracteres',
        required_error: "El nombre de usuario es obligatorio"
    }),
    surname: z.string({
        invalid_type_error: "El apellido debe ser una cadena de caracteres",
        message:"El apellido debe ser una cadena de caracteres",
        required_error: "El apellido es obligatorio"
    }),
    email: z.string().email({
        message: 'Direccion de correo electronico invalido',
        invalid_type_error: 'El correo debe ser una cadena de caracteres',
        required_error: 'El correo es obligatorio'
    }),
    password: z.string({
        invalid_type_error: 'La contraseña no es una cadena de caracteres',
        message: 'La contraseña no es una cadena de caracteres',
        required_error: 'La contraseña es obligatoria'
    }),
    address: z.string({
        message: 'La direccion es requerida'
    }),
    birthdate: z.string({
        message: 'La fecha es requerida'
    }).date(),
    photo: z.string().url({
        message: 'La foto debe ser una URL válida'
    }).refine((url) => {
        return ['.jpg', '.png', '.svg'].some(ext => url.endsWith(ext));
    }, {
        message: 'La foto debe tener una extensión válida (.jpg, .png, .svg)',
    }).default('https://user.svg'),
    created_at: z.date().default(new Date()),
    id_rol: z.number().default(2)
})

export function validatUsers(object) {
    return userSchema.safeParse(object)
}

export function validatParcialUser(object) {
    return userSchema.partial().safeParse(object)
}

