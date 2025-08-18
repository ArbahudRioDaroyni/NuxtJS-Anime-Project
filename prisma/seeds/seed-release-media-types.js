export async function seedReleaseMediaTypes(prisma) {
  await prisma.release_media_types.createMany({
    data: [
      {
        name: 'Anime',
        description: 'Japanese animation.<br>It is an art form originating from Japan with a distinctive visual style.<br>Anime can encompass various genres and themes, ranging from action, adventure, fantasy, to drama and romance.<br>Anime can be broadcast on television, shown in theaters, or released directly to physical media like DVDs or Blu-rays.<br>It can take the form of TV series, movies, OVAs, ONAs, etc. (as we discussed earlier).<br>It usually features unique art styles, stories, and characters.'
      },
      {
        name: 'Manga',
        description: 'Japanese comics or graphic novels.<br>Manga is an art form originating from Japan with a distinctive visual style.<br>It is usually read from right to left and encompasses various genres and themes, ranging from action, adventure, fantasy, to drama and romance.<br>Manga often serves as inspiration for anime and live-action adaptations.'
      },
      {
        name: 'Novel',
        description: 'Fiction or non-fiction books written in prose.<br>Novels can encompass various genres and themes, similar to manga and anime.<br>Novels often serve as inspiration for anime and live-action adaptations.'
      },
      {
        name: 'Light Novel',
        description: 'Japanese light novels usually accompanied by illustrations.<br>Light novels often have a simpler writing style and are easier to read than regular novels.<br>Light novels often serve as inspiration for anime and manga.'
      },
      {
        name: 'Visual Novel',
        description: 'Interactive fiction games that combine storytelling with visual elements.<br>Visual novels often feature branching storylines and multiple endings.<br>They can encompass various genres and themes, similar to anime, manga, and novels.'
      },
      {
        name: 'Game',
        description: 'Video games or board games played on computers or consoles.<br>Games can encompass various genres and themes, similar to anime, manga, and novels.<br>Some games also feature strong storytelling elements and deep characters.'
      },
      {
        name: 'Manhwa',
        description: 'Korean comics or graphic novels.<br>Manhwa has a visual style similar to manga but is usually read from left to right.<br>Manhwa also encompasses various genres and themes, similar to anime, manga, and novels.'
      },
      {
        name: 'Webtoon',
        description: 'Digital comics usually read online.<br>Webtoons originate from Korea and have a visual style similar to manhwa.<br>Webtoons often have a longer and more flexible format than traditional manga.'
      },
      {
        name: 'Manhua',
        description: 'Chinese comics or graphic novels.<br>Manhua has a visual style similar to manga but is usually read from left to right.<br>Manhua also encompasses various genres and themes, similar to anime, manga, and novels.'
      },
      {
        name: 'Doujinshi',
        description: 'Comics or graphic novels created by fans or amateurs.<br>Doujinshi are often original works or fan fiction based on existing anime, manga, or games.'
      },
      {
        name: 'Live Action',
        description: 'Films or television series starring human actors.<br>Live-action works can encompass various genres and themes, similar to anime, manga, and novels.<br>Some live-action works are also adaptations of anime or manga.'
      },
      {
        name: 'Unknown',
        description: 'Media type is unknown or not listed.'
      }
    ]
  })
}