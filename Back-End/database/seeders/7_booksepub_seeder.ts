import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import fs from 'node:fs'
import path from 'node:path'

export default class extends BaseSeeder {
  async run() {
    const tableName = 'booksepub'
    const directoryPath = path.join(process.cwd(), 'database/seeders/assets')

    // 1. Scanner le dossier et filtrer les fichiers .epub
    const epubFiles = fs.readdirSync(directoryPath).filter((file) => file.endsWith('.epub'))

    if (epubFiles.length === 0) {
      console.log('--- [Seeder] Aucun fichier .epub trouvé dans /database/seeders ---')
      return
    }

    console.log(`--- [Seeder] Début de l'importation de ${epubFiles.length} fichier(s) ---`)

    // 2. Boucle de traitement (Itération)
    for (const fileName of epubFiles) {
      try {
        const fullPath = path.join(directoryPath, fileName)

        // Lecture binaire du fichier
        const fileBuffer = fs.readFileSync(fullPath)

        // Insertion en base de données
        await db.table(tableName).insert({
          epub_blob: fileBuffer,
          // Vous pourriez aussi insérer le nom du fichier ici :
          // title: fileName.replace('.epub', '')
        })

        console.log(`✅ Succès : ${fileName}`)
      } catch (error) {
        console.error(`❌ Erreur lors de l'importation de ${fileName} :`, error.message)
      }
    }

    console.log('--- [Seeder] Importation terminée ---')
  }
}
