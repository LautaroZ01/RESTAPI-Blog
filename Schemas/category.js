import { z } from 'zod';

const categorySchema = z.object({
    name: z.string({
        invalid_type_error: "El nombre de la categoria debe ser una cadena de caracteres",
        message: 'El nombre de la categoria debe ser una cadena de caracteres',
        required_error: "El nombre de la categoria es obligatorio"
    }),
    description: z.string({
        invalid_type_error: "La descripcion debe ser una cadena de caracteres",
        message: 'La descripcion debe ser una cadena de caracteres'
    }).max(355, { message: 'La descripcion es demasiado larga' }).default('')
})

export function validatCategories(object) {
    return categorySchema.safeParse(object)
}

export function validatParcialCategories(object) {
    return categorySchema.partial().safeParse(object)
}
