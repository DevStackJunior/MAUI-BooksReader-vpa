import { BaseSeeder } from '@adonisjs/lucid/seeders'
import fs from 'node:fs/promises'
import path from 'node:path'
import Book from '#models/book'
import BookEpub from '#models/book_epub'

export default class BookEpubSeeder extends BaseSeeder {
  private readonly epubDir = path.join(process.cwd(), 'Docs', 'EPUB', 'books')

  async run() {
    console.log('📚 Démarrage du seeder BookEpub...')

    // ─────────────────────────────────────────────
    // ÉTAPE 1 : book_epubs déjà peuplée ?
    // ─────────────────────────────────────────────
    const existingEpub = await BookEpub.query().whereNotNull('epub_blob').first()

    if (existingEpub) {
      console.log('✅ La table book_epubs contient déjà des EPUBs.')
      console.log('🔄 Mise à null des champs de la table books...')
      await this.nullifyBooks()
      console.log('✔️  Champs books mis à null avec succès.')
      return
    }

    // ─────────────────────────────────────────────
    // ÉTAPE 2 : Vérifier que le dossier epub existe
    // ─────────────────────────────────────────────
    const dirExists = await fs.stat(this.epubDir).catch(() => null)

    if (!dirExists) {
      console.error(`❌ Dossier introuvable : ${this.epubDir}`)
      return
    }

    // ─────────────────────────────────────────────
    // ÉTAPE 3 : Lister les fichiers .epub
    // ─────────────────────────────────────────────
    const allFiles = await fs.readdir(this.epubDir)
    const epubFiles = allFiles.filter((f) => f.endsWith('.epub'))

    if (epubFiles.length === 0) {
      console.warn('⚠️  Aucun fichier .epub trouvé dans le dossier.')
      return
    }

    console.log(`📖 ${epubFiles.length} fichier(s) .epub détecté(s).`)

    // ─────────────────────────────────────────────
    // ÉTAPE 4 : Itération et insertion séquentielle
    // ─────────────────────────────────────────────
    let success = 0
    let failed = 0

    for (const filename of epubFiles) {
      const filePath = path.join(this.epubDir, filename)

      try {
        // Vérification physique du fichier
        const fileStat = await fs.stat(filePath)
        if (!fileStat.isFile()) continue

        // Lecture unitaire (optimisation mémoire)
        const buffer = await fs.readFile(filePath)
        const epubBlob = new Uint8Array(buffer)

        // Création du book avec tous les champs à null
        const book = await Book.create({
          title: null,
          numberOfPages: null,
          pdfLink: null,
          abstract: null,
          editor: null,
          editionYear: null,
          imagePath: null,
          categoryId: null,
          writerId: null,
          userId: null,
        })

        // Insertion de l'epub lié au book
        await BookEpub.create({
          bookId: book.id,
          epubBlob,
        })

        console.log(`  ✅ [${filename}] importé (book #${book.id})`)
        success++
      } catch (error) {
        console.error(`  ❌ [${filename}] échec : ${(error as Error).message}`)
        failed++
      }
    }

    console.log(`\n📊 Résultat : ${success} succès / ${failed} échec(s)`)
  }

  // ─────────────────────────────────────────────
  // Nullifier tous les champs de books
  // ─────────────────────────────────────────────
  private async nullifyBooks() {
    await Book.query().update({
      title: null,
      numberOfPages: null,
      pdfLink: null,
      abstract: null,
      editor: null,
      editionYear: null,
      imagePath: null,
      categoryId: null,
      writerId: null,
      userId: null,
    })
  }
}
