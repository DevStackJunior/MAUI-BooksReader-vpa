import Book from '#models/book'
import Evaluate from '#models/evaluate'
import Comment from '#models/comment'
import type { HttpContext } from '@adonisjs/core/http'

export default class BooksController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const book = await Book.query().preload('writer').preload('user').preload('category')

    return await book
  }

  /**
   * Display form to create a new record
   */
  //async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  // async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const book = await Book.query()
      .preload('writer')
      .preload('user')
      .preload('category')
      .where('id', params.id)
      .firstOrFail()

    const evaluates = await Evaluate.query().where('book_id', params.id)
    const total = evaluates.length
    const average =
      total > 0 ? evaluates.reduce((sum, evaluate) => sum + evaluate.note, 0) / total : 0

    return {
      ...book.toJSON(),
      global_rating: Math.floor(average * 10) / 10,
      total_comments: total,
    }
  }

  async home({}: HttpContext) {
    const book = await Book.query()
      .orderBy('created_at', 'desc')
      .limit(5)
      .preload('writer')
      .preload('user')
      .preload('category')

    return await book
  }

  async booksPerCategory({ params, response }: HttpContext) {
    const books = await Book.query()
      .where('category_id', params.category_id)
      .preload('writer')
      .preload('user')
      .preload('category')
      .preload('comment')
    return response.ok(books)
  }

  /**
   * Show Books noted per user
   */
  async showPerUser({ params, response }: HttpContext) {
    const books = await Book.query()
      .where('user_id', params.user_id)
      .preload('writer')
      .preload('user')
      .preload('category')
      .preload('comment')
    return response.ok(books)
  }
  /*
   * Create a book
   */
  async store({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const data = request.only([
      'title',
      'number_of_pages',
      'pdf_link',
      'abstract',
      'editor',
      'edition_year',
      'image_path',
      'category_id',
      'writer_id',
    ])
    const book = await Book.create({
      ...data,
      userId: user.id,
    })

    return response.created(book)
  }
  /////////////////////////////////////////////////////
  async update({ params, request, response }: HttpContext) {
    const book = await Book.findOrFail(params.id)
    const data = request.only([
      'title',
      'number_of_pages',
      'pdf_link',
      'abstract',
      'editor',
      'edition_year',
      'image_path',
      'category_id',
      'writer_id',
    ])
    book.merge(data)
    await book.save()
    return response.ok(book)
  }
  async destroy({ params, auth, response }: HttpContext) {
    //const user = auth.user!
    const book = await Book.findOrFail(params.id)
    await book.delete()
    return response.ok({ message: 'Livre supprimé avec succès.' })
  }
  // Récupérer toutes les notes et commentaires pour ce livre
  public async getReviewsByBook({ params, response }: HttpContext) {
    const bookId = params.id

    try {
      const evaluates = await Evaluate.query().where('book_id', bookId).preload('user')
      const comments = await Comment.query().where('book_id', bookId)

      // Fusionner par userId
      const merged = evaluates.map((evaluate) => {
        const comment = comments.find((c) => c.userId === evaluate.userId)
        return {
          evaluateId: evaluate.id,
          userId: evaluate.userId,
          username: evaluate.user?.username ?? null,
          rating: evaluate.note,
          comment: evaluate.comment ?? comment?.comment ?? null,
        }
      })

      return response.ok(merged)
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur serveur',
        error: error.message,
      })
    }
  }
}
