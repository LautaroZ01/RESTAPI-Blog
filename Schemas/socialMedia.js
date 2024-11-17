import { z } from 'zod';

const socialSchema = z.object({
    type: z.string({
        invalid_type_error: "El tipo de la red social debe ser una cadena de caracteres",
        message: 'El tipo de la red social debe ser una cadena de caracteres',
        required_error: "El tipo de la red social es obligatorio"
    }),
    name: z.string({
        invalid_type_error: "El nombre de la red social debe ser una cadena de caracteres",
        message: 'El nombre de la red social debe ser una cadena de caracteres',
        required_error: "El nombre de la red social es obligatorio"
    }),
    link: z.string({
        invalid_type_error: "El link debe ser una cadena de caracteres",
        message: 'El link debe ser una cadena de caracteres'
    }),
    id_author: z.number({
        invalid_type_error: "El id del autor debe ser una numero",
        message: 'El id del autor  debe ser una cadena de numero',
        required_error: "El id del autor  es obligatorio"
    })
})

export function validatSocial(object) {
    return socialSchema.safeParse(object)
}

export function validatParcialSocial(object) {
    return socialSchema.partial().safeParse(object)
}
