import { PrismaClient } from '@prisma/client'
import { seedReleaseMediaTypes } from './seeds/seed-release-media-types.js'
import { seedReleaseFormats } from './seeds/seed-release-formats.js'
import { seedReleaseStatusTypes } from './seeds/seed-release-status-types.js'
import { seedSeasons } from './seeds/seed-seasons.js'
import { seedRelationTypes } from './seeds/seed-relation-types.js'

const prisma = new PrismaClient()

async function main() {
	await seedReleaseMediaTypes(prisma);
  await seedReleaseFormats(prisma);
  await seedReleaseStatusTypes(prisma);
  await seedSeasons(prisma);
  await seedRelationTypes(prisma);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })