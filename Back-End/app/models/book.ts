import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Category from './category.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Writer from './writer.js'
import User from './user.js'
import Comment from './comment.js'

export default class Book extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  //number = Small Int
  @column()
  declare numberOfPages: number

  @column()
  declare pdfLink: string

  //résumé du livre
  @column()
  declare abstract: string

  @column()
  declare editor: string

  //number = Small Int
  @column()
  declare editionYear: number

  @column()
  declare imagePath: string

  //Récupération des 3 clefs étrangères
  @column()
  declare categoryId: number | null

  @column()
  declare writerId: number | null

  @column()
  declare userId: number | null

  //Assignation des clefs étrangères à book
  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Writer)
  declare writer: BelongsTo<typeof Writer>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Comment)
  declare comment: HasMany<typeof Comment>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
