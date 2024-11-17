import { z } from 'zod';

const authorSchema = z.object({
    description: z.string({
        invalid_type_error: "La descripcion debe ser una cadena de caracteres",
        message: 'La descripcion debe ser una cadena de caracteres',
        required_error: "La descripcion es obligatorio"
    }),
    bio: z.string({
        invalid_type_error: "La descripcion debe ser una cadena de caracteres",
        message: 'La descripcion debe ser una cadena de caracteres'
    }).default('')
})

export function validatAuthors(object) {
    return authorSchema.safeParse(object)
}

export function validatParcialAuthors(object) {
    return authorSchema.partial().safeParse(object)
}
