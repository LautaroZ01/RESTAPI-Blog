import { z } from 'zod';

const likeSchema = z.object({
    id_post: z.number({
        invalid_type_error: "El post debe ser un numero",
        message: 'El post debe ser un numero',
        required_error: "El post es obligatorio"
    })
})

export function validatLikes(object) {
    return likeSchema.safeParse(object)
}

export function validatParcialLikes(object) {
    return likeSchema.partial().safeParse(object)
}

