import { z } from 'zod';

const contactSchema = z.object({
    type: z.string({
        invalid_type_error: "El tipo del contacto debe ser una cadena de caracteres",
        message: 'El tipo del contacto debe ser una cadena de caracteres',
        required_error: "El tipo del contacto es obligatorio"
    }),
    name: z.string({
        invalid_type_error: "El nombre del contacto debe ser una cadena de caracteres",
        message: 'El nombre del contacto debe ser una cadena de caracteres',
        required_error: "El nombre de la red social es obligatorio"
    }),
    description: z.string({
        invalid_type_error: "La descripcion debe ser una cadena de caracteres",
        message: 'La descripcion debe ser una cadena de caracteres'
    }),
    id_author: z.number({
        invalid_type_error: "El id del autor debe ser una numero",
        message: 'El id del autor  debe ser una cadena de numero',
        required_error: "El id del autor  es obligatorio"
    })
})

export function validatContact(object) {
    return contactSchema.safeParse(object)
}

export function validatParcialContact(object) {
    return contactSchema.partial().safeParse(object)
}
