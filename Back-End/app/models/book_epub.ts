import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Book from './book.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class BookEpub extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare epubBlob: Uint8Array | null

  //Récupération des 3 clefs étrangères
  @column()
  declare bookId: number | null

  //Assignation des clefs étrangères à book
  @belongsTo(() => Book)
  declare book: BelongsTo<typeof Book>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
