import { z } from 'zod';

const postSchema = z.object({
    title: z.string({
        invalid_type_error: "El titulo debe ser una cadena de caracteres",
        message: 'El titulo debe ser un string',
        required_error: 'El titulo es obligatorio'
    }),
    content: z.string({
        invalid_type_error: "El contenido debe ser una cadena de caracteres",
        message: 'El contenido debe ser un string',
        required_error: 'El contenido es obligatorio'
    }),
    created_at: z.date().default(new Date()),
    id_category: z.number({
        invalid_type_error: "La categoria debe ser un entero",
        message: 'La categoria debe ser un numero entero',
        required_error: 'La categoria es obligatorio'
    }),
    id_state: z.number({
        invalid_type_error: "El estado debe ser un entero",
        message: 'El estado debe ser un numero entero'
    }).default(2)
})

export function validatPosts(object) {
    return postSchema.safeParse(object)
}

export function validatParcialPost(object){
    return postSchema.partial().safeParse(object)
}