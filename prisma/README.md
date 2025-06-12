# Prisma Setup Guide

## Installation

1. **Install Prisma and the required dependencies:**
   ```sh
   npm install @prisma/client
   npm install -D prisma
   ```

2. **Initialize Prisma in your project:**
   ```sh
   npx prisma init
   ```
   This will create a `prisma/` folder with a `schema.prisma` file and a `.env` file.

---

## After Editing `schema.prisma`

Whenever you update your `schema.prisma` file:

1. **Run a migration to update the database:**
   ```sh
   npx prisma migrate dev --name <migration-name>
   ```
   Replace `<migration-name>` with a descriptive name, e.g., `add-user-table`.
   `this will generate database file (.db, .sqlite, .sqlite3)`

2. **Regenerate the Prisma Client:**
   ```sh
   npx prisma generate
   ```

---

## Seeding the Database with JavaScript

This project uses plain JavaScript for seeding.

### File Structure

```
prisma/
├── seed.js
└── seeds/
    └── seed-users.js
```

1. **Create your seed file:**  
   Example: `prisma/seed.js`
   ```js
   import { PrismaClient } from '@prisma/client'
   const prisma = new PrismaClient()

   async function main() {
     await prisma.user.create({
       data: { name: 'Alice', email: 'alice@example.com' }
     })
   }

   main()
     .catch(e => {
       console.error(e)
       process.exit(1)
     })
     .finally(async () => {
       await prisma.$disconnect()
     })
   ```

2. **If you split your seeds into multiple files:**  
   - Place them in a folder, e.g., `prisma/seeds/seed-users.js`
   - in `prisma/seeds/seed-users.js`:
    
   - Import them in `seed.js` using the full path and extension:
     ```js
     import { seedUsers } from './seeds/seed-users.js'

     async function main() {
         await seedUsers(prisma)
     }
     ```

3. **Files `seed-users.js` like:**
     ```js
     export async function seedMediaTypes(prisma) {
      await prisma.media_types.createMany({
        data: [...
        ]
      })
     }
     ```

4. **Update your `package.json` to use the JS seed file:**
   ```json
   "prisma": {
     "seed": "node prisma/seed.js"
   }
   ```

5. **Run the seed command:**
   ```sh
   npx prisma db seed
   ```

**Note:**  
- If your project uses `"type": "module"` in `package.json`, always include the `.js` extension in your import paths.
- Make sure all imported seed files exist and are named correctly.