import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'booksepub'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // LUCID ORM doesn't take in charge the LONGBLOB Format
      // Rethrieves epub_blob as a binary format file
      table.specificType('epub_blob', 'LONGBLOB').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
