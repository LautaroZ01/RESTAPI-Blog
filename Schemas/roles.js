import { z } from 'zod';

const rolesSchema = z.object({
    name: z.string({
        invalid_type_error: "El nombre del rol debe ser una cadena de caracteres",
        message: 'El nombre del rol debe ser una cadena de caracteres',
        required_error: "El nombre del rol es obligatorio"
    }),
    description: z.string({
        invalid_type_error: "La descripcion debe ser una cadena de caracteres",
        message: 'La descripcion debe ser una cadena de caracteres'
    }).max(355, { message: 'La descripcion es demasiado larga' }).default('')
})

export function validatRoles(object) {
    return rolesSchema.safeParse(object)
}

export function validatParcialRoles(object) {
    return rolesSchema.partial().safeParse(object)
}
