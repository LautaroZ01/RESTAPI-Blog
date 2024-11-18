import { uploadFile } from "../Models/Firebase/firebase.js";
import { CategoryModule } from "../Models/Postgres/category.js";
import { PostsModule } from "../Models/Postgres/post.js"
import { PostImageModel } from "../Models/Postgres/postImage.js";
import { StatesModule } from "../Models/Postgres/states.js";
import { TagModule } from "../Models/Postgres/tag.js";
import { validatParcialPost, validatPosts } from "../Schemas/post.js";

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

    static async getAllP(req, res) {
        const { category, limit, status, id } = req.query

        try {
            const posts = await PostsModule.getAll({ category, limit, status, id_user: id });

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
            return res.status(500).json({
                status: 'error',
                error: 'Se produjo un error al intentar traer todos las categorias'
            })
        }
    }

    static async getAllStates(req, res) {
        try {
            const request = await StatesModule.getAll();

            if (!request) {
                return res.status(400).json({
                    status: "error",
                    error: 'No hay estados disponibles'
                })
            }

            return res.json({
                status: 'success',
                states: request
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 'error',
                error: 'Se produjo un error al intentar traer todos las estados'
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

            return res.status(201).json({
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

    static async upload(req, res) {
        const image = req.files.photo
        const { id_post, id_type } = req.params

        if (image && image.length > 0 && id_post) {
            try {
                const { ref, downloadURL } = await uploadFile(image[0], 1280, 720)

                const postImage = await PostImageModel.create({ id_post, id_type, url: downloadURL })

                if (!postImage) {
                    return res.status(400).json({
                        status: 'error',
                        error: 'No se pudo subir la imagen'
                    })
                }

                return res.json({
                    status: 'success',
                    message: 'La imagen se subio correctamente'
                })
            } catch (error) {
                return res.status(500).json({
                    status: "error",
                    error: "Algo salio mal en el servidor"
                })
            }
        } else {
            return res.status(400).json({
                status: 'error',
                error: 'Faltan datos por enviar'
            })
        }
    }

    static async editUpload(req, res) {
        const image = req.files.photo
        const { id } = req.params

        if (image && image.length > 0 && id) {

            try {
                const { ref, downloadURL } = await uploadFile(image[0], 1280, 720)

                const editedImage = await PostImageModel.edit({ id, url: downloadURL })

                if (!editedImage) {
                    return res.status(400).json({
                        status: 'error',
                        error: 'No se pudo actualizar la imagen'
                    })
                }

                return res.json({
                    status: 'success',
                    message: 'La imagen se subio correctamente'
                })

            } catch (error) {
                return res.status(500).json({
                    status: "error",
                    error: "Algo salio mal en el servidor"
                })
            }

        } else {
            return res.status(400).json({
                status: 'error',
                error: 'Faltan datos por enviar'
            })
        }
    }

    static async getById(req, res) {
        const { id } = req.params

        try {
            const data = await PostsModule.getById({ id });
            const tags = await TagModule.GetByPostId({ id });

            if (!data) {
                return res.status(400).json({
                    status: 'error',
                    error: 'El articulo no existe'
                })
            }

            return res.json({
                status: 'success',
                post: data,
                tags
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal al intentar traer el articulo'
            })
        }
    }

    // Editar
    static async edit(req, res) {
        const post = validatParcialPost(req.body)
        const { id } = req.params

        if (post.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(post.error.message)
            })
        }

        try {
            const editPost = await PostsModule.edit({ id, input: post.data });

            if (!editPost) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo actualizar el post'
                })
            }

            return res.json({
                status: 'success',
                post: editPost
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    // Elimniar (Cambiar visualizacion)
    static async delete(req, res) {
        const { id } = req.body

        try {

            const deletedPost = await PostsModule.delete({ id })

            if (!deletedPost) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo eliminar el post'
                })
            }

            res.json({
                status: 'success',
                message: 'El post se elimino correctamente'
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async deletePost(req, res) {
        const { id } = req.body

        try {

            const deletedPost = await PostsModule.deletePost({ id })

            if (!deletedPost) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo eliminar el post'
                })
            }

            res.json({
                status: 'success',
                message: 'El post se elimino correctamente'
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }
}