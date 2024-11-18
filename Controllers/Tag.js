import { connection } from "../Database/postgres.js";
import { TagModule } from "../Models/Postgres/tag.js";
import { validatParcialTags, validatTags } from "../Schemas/tag.js";

export class TagController {
    static async create(req, res) {
        const tag = validatTags(req.body)

        if (tag.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(tag.error.message)
            })
        }

        try {
            const newTag = await TagModule.Create({ input: tag.data })

            if (!newTag) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo crear el tag'
                })
            }

            return res.status(201).json({
                status: 'success',
                newTag
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async edit(req, res) {
        const { id } = req.params
        const tag = validatParcialTags(req.body)

        if (tag.error) {
            return res.status(400).json({
                status: 'error',
                error: JSON.parse(tag.error.message)
            })
        }

        try {
            const editedTag = await TagModule.Edit({ id, input: tag.data })

            if (!editedTag) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo actualizar el tag'
                })
            }

            return res.json({
                status: 'success',
                tag: editedTag
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
            const deletedTag = await TagModule.Delete({ id })

            if (!deletedTag) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo eliminar el tag'
                })
            }

            return res.json({
                status: 'success',
                message: 'Tag eleminada exitosamente'
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async createTagPost(req, res) {
        const { id_post, list } = req.body;

        try {
            let tagPost = [];

            for (const tag of list) {
                const createdTag = await TagModule.CreateTagPost({ input: { id_post, id_tag: tag.id } });
                if (createdTag) {
                    tagPost.push(createdTag);
                }
            }

            if (tagPost.length === 0) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo crear el tag para el post'
                });
            }

            return res.status(201).json({
                status: 'success',
                tagPost
            });

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salió mal en el servidor'
            });
        }
    }

    static async editTagPost(req, res) {
        const id_post = req.params.id;
        const { list } = req.body;

        try {
            // Eliminar tags existentes
            const deleteTags = await TagModule.DeleteTagPost({ id: id_post });

            if (!deleteTags) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudieron eliminar los tags existentes del post',
                });
            }

            // Crear nuevos tags asociados al post
            const tagPost = await Promise.all(
                list.map(async (tag) => {
                    const createdTag = await TagModule.CreateTagPost({ input: { id_post, id_tag: tag.id } });
                    return createdTag;
                })
            );

            return res.json({
                status: 'success',
                tagPost,
            });

        } catch (error) {
            console.error('Error en editTagPost:', error);
            return res.status(500).json({
                status: 'error',
                error: 'Algo salió mal en el servidor',
            });
        }
    }

    static async getByPostId(req, res) {
        const { id } = req.params

        try {
            const tags = await TagModule.GetByPostId({ id })

            if (!tags) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo obtener los tags del post'
                })
            }

            return res.json({
                status: 'success',
                tags
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

    static async getAll(req, res) {
        try {

            const tags = await TagModule.getAll();

            if (!tags) {
                return res.status(400).json({
                    status: 'error',
                    error: 'No se pudo obtener los tags'
                })
            }

            return res.json({
                status: 'success',
                tags
            })

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                error: 'Algo salio mal en el servidor'
            })
        }
    }

}