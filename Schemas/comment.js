import { z } from 'zod';

const commentSchema = z.object({
    id_post: z.number({
        invalid_type_error: "El post debe ser un numero",
        message: 'El post debe ser un numero',
        required_error: "El post es obligatorio"
    }),
    id_comment: z.number({
        invalid_type_error: "El comentario debe ser un numero",
        message: 'El comentario debe ser un numero',
        required_error: "El comentario es obligatorio"
    }).default(0),
    content: z.string({
        invalid_type_error: "El comentario debe ser un string",
        message: 'El comentario debe ser un string',
        required_error: "El contenido del comentario es obligatorio"
    }).max(355, { message: 'El comentario es demasiado largo' })
})

export function validatComments(object) {
    return commentSchema.safeParse(object)
}

export function validatParcialComments(object) {
    return commentSchema.partial().safeParse(object)
}
