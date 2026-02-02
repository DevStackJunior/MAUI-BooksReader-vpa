import Book from '#models/book'
import Evaluate from '#models/evaluate'
import Comment from '#models/comment'
import type { HttpContext } from '@adonisjs/core/http'

export default class BooksEpubController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const book = await Book.query().preload('writer').preload('user').preload('category')

    return await book
  }
}
