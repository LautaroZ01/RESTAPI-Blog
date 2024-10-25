import { CategoryModule } from "../Models/Postgres/category.js";
import { PostsModule } from "../Models/Postgres/post.js"
import { validatPosts } from "../Schemas/post.js";

export class PostController {
    static async getAll(req, res) {
        const { category, limit } = req.query

        try {
            const posts = await PostsModule.getAll({ category, limit });

            if (!posts) {
                return res.status(400).json({
                    status: "error",
                    error: 'No hay articulos disponibles'
                })
            }

            return res.json({
                status: 'success',
                posts
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Se produjo un error al intentar traer todos los articulos'
            })
        }
    }

    static async getAllCategories(req, res) {
        try {
            const request = await CategoryModule.getAll();

            if (!request) {
                return res.status(400).json({
                    status: "error",
                    error: 'No hay categorias disponibles'
                })
            }

            return res.json({
                status: 'success',
                categories: request
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 'error',
                error: 'Se produjo un error al intentar traer todos las categorias'
            })
        }
    }

    static async create(req, res) {
        const post = validatPosts(req.body);

        if (post.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(post.error.message)
            })
        }

        post.data.id_author = req.auth.id;

        try {
            const newPost = await PostsModule.create({ input: post.data });

            if (!newPost) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo crear el articulo'
                })
            }

            return res.json({
                status: 'success',
                post: newPost
            })


        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Se produjo un error al intentar crear un articulos'
            })
        }
    }

    static async getById(req, res) {
        const { id } = req.params

        try {
            const data = await PostsModule.getById({ id });

            if (!data) {
                return res.status(400).json({
                    status: 'error',
                    error: 'El articulo no existe'
                })
            }

            return res.json({
                status: 'success',
                post: data
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal al intentar traer el articulo'
            })
        }
    }

    // Editar

    // Cambiar visualizacion

    // Elimniar
}