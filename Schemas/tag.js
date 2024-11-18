import { z } from 'zod';

const tagSchema = z.object({
    name: z.string({
        invalid_type_error: "El nombre debe ser una cadena de caracteres",
        message: 'El nombre debe ser una cadena de caracteres',
        required_error: "El nombre es obligatorio"
    })
})

export function validatTags(object) {
    return tagSchema.safeParse(object)
}

export function validatParcialTags(object) {
    return tagSchema.partial().safeParse(object)
}
