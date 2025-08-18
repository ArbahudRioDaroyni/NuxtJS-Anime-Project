export async function seedReleaseStatusTypes(prisma) {
  await prisma.release_status_types.createMany({
    data: [
      {
        name: 'NOT_YET_RELEASED',
        description: 'The media has not yet been released to the public.'
      },
      {
        name: 'RELEASING',
        description: 'The media is currently being released or aired.'
      },
      {
        name: 'RELEASED',
        description: 'The media has been released to the public.'
      },
      {
        name: 'UNRELEASED',
        description: 'The media has not been released to the public.'
      },
      {
        name: 'ONGOING',
        description: 'The media is currently being produced or aired.'
      },
      {
        name: 'FINISHED',
        description: 'The media has been completed and is no longer being produced.'
      },
      {
        name: 'CANCELLED',
        description: 'The media has been cancelled and will not be completed.'
      },
      {
        name: 'HIATUS',
        description: 'The media is on hold or temporarily suspended.'
      },
      {
        name: 'FINISHED_AIRING',
        description: 'The media has finished airing and is no longer being released.'
      },
      {
        name: 'CURRENTLY_AIRING',
        description: 'The media is currently being aired or released.'
      },
      {
        name: 'UPCOMING',
        description: 'The media is scheduled to be released in the future.'
      },
      {
        name: 'UNKNOWN',
        description: 'The status of the media is unknown or not listed.'
      }
    ]
  })
}