using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VersOne.Epub;
using HtmlAgilityPack;

namespace MAUI_Flashcards_vpa.Services
{
    public class EpubService
    {
        // ─────────────────────────────────────────────
        // Sauvegarde du flux binaire (venant de l'API)
        // ─────────────────────────────────────────────
        public async Task<string> SaveEpubToCacheAsync(byte[] epubBytes, string filename)
        {
            string filePath = Path.Combine(FileSystem.CacheDirectory, filename);
            await File.WriteAllBytesAsync(filePath, epubBytes);
            return filePath;
        }

        // ─────────────────────────────────────────────
        // Extraction des métadonnées
        // ─────────────────────────────────────────────
        public async Task<EpubMetadata> GetMetadataAsync(string filePath)
        {
            // Lecture complète d'un fichier epubBook
            EpubBook book = await EpubReader.ReadBookAsync(filePath);

            return new EpubMetadata
            {
                Title = book.Title,
                Author = book.Author,
                CoverImage = book.CoverImage,  // byte[]
            };
        }

        // ─────────────────────────────────────────────
        // Extraction des chapitres (texte propre)
        // ─────────────────────────────────────────────
        public async Task<List<EpubChapter>> GetChaptersAsync(string filePath)
        {
            // Lecture complète d'un fichier epubBook
            EpubBook book = await EpubReader.ReadBookAsync(filePath);
            var chapters = new List<EpubChapter>();

            foreach (var item in book.ReadingOrder)
            {
                // HtmlAgilityPack nettoie le HTML brut
                var htmlDoc = new HtmlDocument();
                htmlDoc.LoadHtml(item.Content);

                // Suppression des balises scripts/styles
                htmlDoc.DocumentNode
                    .SelectNodes("//script|//style")?
                    .ToList()
                    .ForEach(n => n.Remove());

                chapters.Add(new EpubChapter
                {
                    Title = item.FilePath,
                    PlainText = htmlDoc.DocumentNode.InnerText.Trim(),
                    HtmlContent = item.Content  // HTML original pour WebView
                });
            }

            return chapters;
        }
    }

    // ─────────────────────────────────────────────
    // Modèles de retour
    // ─────────────────────────────────────────────
    public class EpubMetadata
    {
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public byte[]? CoverImage { get; set; }
    }

    public class EpubChapter
    {
        public string Title { get; set; } = string.Empty;
        public string PlainText { get; set; } = string.Empty;
        public string HtmlContent { get; set; } = string.Empty;
    }
}