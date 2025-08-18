// ('Winter', 'The coldest season of the year, typically runs from January to March. Associated with snow and ice.'),
// 		('Spring', 'The season of new beginnings, typically runs from March to June. Associated with blooming flowers and warmer weather.'),
// 		('Summer', 'The warmest season of the year, typically runs from June to September. Associated with vacations and outdoor activities.'),
// 		('Fall', 'The season of harvest, typically runs from September to December. Associated with falling leaves and cooler temperatures.');

export async function seedSeasons(prisma) {
  await prisma.seasons.createMany({
    data: [
      {
        name: 'Winter',
        description: 'The coldest season of the year, typically runs from December to February. Associated with snow and ice.'
      },
      {
        name: 'Spring',
        description: 'The season of new beginnings, typically runs from March to May. Associated with blooming flowers and warmer weather.'
      },
      {
        name: 'Summer',
        description: 'The warmest season of the year, typically runs from June to August. Associated with vacations and outdoor activities.'
      },
      {
        name: 'Fall',
        description: 'The season of harvest, typically runs from September to November. Associated with falling leaves and cooler temperatures.'
      }
    ]
  })
}