export async function seedReleaseFormats(prisma) {
  await prisma.release_formats.createMany({
    data: [
      {
        name: 'TV',
        stands_for: 'Television',
        description: 'Anime series that are broadcast on television. Anime that airs regularly on Japanese TV stations.<br>Usually has 12, 13, 24, or 26 episodes per season.'
      },
      {
        name: 'OVA',
        stands_for: 'Original Video Animation',
        description: 'Anime released directly to physical media (DVD/Blu-ray), without airing on TV or in theaters.<br>Often has higher animation quality than TV versions due to no time slot restrictions.<br>Can be side stories, additional content, or bonuses.<br>Usually has 1-6 episodes.'
      },
      {
        name: 'Special',
        stands_for: 'Special Episode',
        description: 'Special episodes that usually air on TV as special events or are released as bonuses (e.g., bundled with manga or Blu-ray).<br>Can be additional stories, recaps, or crossovers.<br>Usually released after the main anime finishes airing.<br>Usually has 1 episode.'
      },
      {
        name: 'Movie',
        stands_for: 'Movie',
        description: 'Anime films that air in theaters or are released directly to physical media.<br>Often have stories different from TV or OVA versions.<br>Can be part of the main story or original content.<br>Usually has the highest animation quality.<br>Usually has 1-3 episodes.'
      },
      {
        name: 'ONA',
        stands_for: 'Original Net Animation',
        description: 'Anime released exclusively on streaming platforms (not TV or physical media).<br>Usually has a shorter and more flexible format than TV anime.<br>Often airs on platforms like YouTube, Netflix, etc.<br>Can be original stories or adaptations of manga, light novels, etc.<br>Usually has 1-12 episodes.'
      },
      {
        name: 'Web',
        stands_for: 'Web Series',
        description: 'Anime released online, usually in the form of short episodes or web series.<br>Can be original stories or adaptations of manga, light novels, etc.<br>Usually has a shorter format than TV anime.<br>Usually has 1-12 episodes.'
      },
      {
        name: 'Theatrical',
        stands_for: 'Theatrical Release',
        description: 'Anime that airs in theaters, often as full-length films or specials.<br>Can be original stories or adaptations of manga, light novels, etc.<br>Usually has a higher animation quality than TV or OVA versions.<br>Usually has 1-3 episodes.'
      },
      {
        name: 'TV SHORT',
        stands_for: 'Television Short',
        description: 'TV anime with short durations, usually less than 15 minutes per episode. <br>Often has a more flexible format than regular TV anime.<br>Can be original stories or adaptations of manga, light novels, etc.<br>Usually has 1-12 episodes.'
      },
      {
        name: 'Music',
        stands_for: 'Music Video',
        description: 'Anime music videos or short films that are often released as promotional content.'
      },
      {
        name: 'Unknown',
        stands_for: 'Unknown',
        description: 'The release format is unknown or not listed.'
      }
    ]
  })
}