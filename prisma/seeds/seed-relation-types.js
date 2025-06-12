export async function seedRelationTypes(prisma) {
  await prisma.relation_types.createMany({
    data: [
      {
        name: 'ADAPTATION',
        description: 'An adaptation of a work into another medium, such as an anime adapted from a manga.'
      },
      {
        name: 'ALTERNATIVE',
        description: 'An alternative version or retelling of a story, often with different perspectives or outcomes.'
      },
      {
        name: 'CHARACTER',
        description: 'A relation that focuses on characters, such as spin-offs or side stories centered around specific characters.'
      },
      {
        name: 'OTHER',
        description: 'Any other type of relation that does not fit into the standard categories.'
      },
      {
        name: 'PARENT',
        description: 'A relation where one work is the parent or source material for another, such as a manga being the parent of an anime.'
      },
      {
        name: 'PREQUEL',
        description: 'A work that takes place before the main story, providing background or context to the original work.'
      },
      {
        name: 'SEQUEL',
        description: 'A continuation of a story that follows the events of the original work.'
      },
      {
        name: 'SIDE_STORY',
        description: 'A story that runs parallel to the main narrative, often exploring side characters or events.'
      },
      {
        name: 'SPIN_OFF',
        description: 'A work that is derived from another, focusing on characters or elements from the original but telling a new story.'
      },
      {
        name: 'SUMMARY',
        description: 'A condensed version of a story, often summarizing key events without going into full detail.'
      }
    ]
  })
}