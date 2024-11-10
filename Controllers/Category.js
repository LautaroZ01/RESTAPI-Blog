import { CategoryModule } from "../Models/Postgres/category.js"
import { validatCategories, validatParcialCategories } from "../Schemas/category.js";

export class CategoryController {
    static async getAll(req, res) {
        try {
            const categories = await CategoryModule.getAll();

            if (!categories) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo obtener las categorias'
                })
            }

            return res.json({
                status: 'success',
                categories,
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async getById(req, res) {
        const { id } = req.params

        try {
            const category = await CategoryModule.getById({ id });

            if (!category) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Esa categoria no existe'
                })
            }

            return res.json({
                status: 'success',
                category
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async create(req, res) {
        const newCategory = validatCategories(req.body)

        if (newCategory.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(newCategory.error.message)
            })
        }

        try {
            const category = await CategoryModule.create({ input: newCategory.data })

            if (!category) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo crear la categoria'
                })
            }

            return res.json({
                status: 'success',
                category
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async edit(req, res) {
        const result = validatParcialCategories(req.body)
        const { id } = req.params

        if (result.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(result.error.message)
            })
        }

        try {

            const category = await CategoryModule.edit({ id, input: result.data });

            if (!category) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo actualizar la categoria'
                })
            }

            return res.json({
                status: 'success',
                category
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async delete(req, res) {
        const { id } = req.body

        try {
            const deleteCategory = await CategoryModule.delete({ id })

            if (!deleteCategory) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo eliminar la categoria'
                })
            }

            return res.json({
                status: 'success',
                message: 'La categoria se elimino exitosamente'
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }
}