# ⚡ Prisma CLI Commands Guide

A complete, minimal, and developer-friendly reference for working with **Prisma ORM** in modern web projects (Nuxt, Vue, Laravel API, etc).

---

## 🧩 1. Installation

### Install Prisma
```bash
npm install prisma --save-dev
npm install @prisma/client
```

### Initialize Prisma in your project
```bash
npx prisma init
```

Creates:
- `prisma/schema.prisma`
- `.env` file with `DATABASE_URL`

---

## ⚙️ 2. Generate Prisma Client

```bash
npx prisma generate
```

Regenerates Prisma Client after schema changes.  
Run this every time you edit `schema.prisma`.

---

## 🧱 3. Database Migration

### Create a new migration
```bash
npx prisma migrate dev --name init
```

### Apply migrations in production
```bash
npx prisma migrate deploy
```

### Reset database and reapply all migrations
```bash
npx prisma migrate reset
```

### Check migration status
```bash
npx prisma migrate status
```

### Create migration file only (without applying)
```bash
npx prisma migrate dev --create-only --name add_table
```

---

## 🗃️ 4. Database Commands

### Push schema directly (no migration files)
```bash
npx prisma db push
```

### Pull database structure into schema
```bash
npx prisma db pull
```

### Seed database
```bash
npx prisma db seed
```

**Example seed file:**
```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: { name: 'Admin', email: 'admin@example.com' },
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e)
    prisma.$disconnect()
  })
```

---

## 🧭 5. Prisma Studio (GUI)

### Open visual database explorer
```bash
npx prisma studio
```

> Opens at http://localhost:5555  
> You can edit records directly through the browser.

---

## 🧰 6. Utilities

### Check Prisma version
```bash
npx prisma -v
```

### Validate schema
```bash
npx prisma validate
```

### Format schema file
```bash
npx prisma format
```

---

## 🚀 7. Typical Workflow (Nuxt + Prisma)

1. Edit your models inside `schema.prisma`
2. Create migration:
   ```bash
   npx prisma migrate dev --name adime_model
   ```
3. Regenerate client:
   ```bash
   npx prisma generate
   ```
4. Run Studio to inspect data:
   ```bash
   npx prisma studio
   ```

---

## 🔐 8. Environment Configuration

Example `.env` file:
```bash
DATABASE_URL="file:./dev.db"
# or PostgreSQL:
# DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

---

## 🧩 9. Advanced Usage

### Generate using specific schema file
```bash
npx prisma generate --schema=prisma/custom-schema.prisma
```

### Use custom env file
```bash
npx prisma migrate dev --env-file=.env.local
```

### Diff between schemas
```bash
npx prisma migrate diff   --from-empty   --to-schema-datamodel prisma/schema.prisma   --script
```

---

## 🧾 10. Useful NPM Scripts

Add to your `package.json`:
```json
{
  "scripts": {
    "prisma:generate": "prismad_an generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "prisma:reset": "prisma migrate reset"
  }
}
```

Run:
```bash
npm run prisma:studio
```

---

## 🧠 Summary

| Command | Description |
|----------|--------------|
| `npx prisma init` | Initialize Prisma |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma migrate dev` | Create & apply migrations |
| `npx prisma migrate deploy` | Apply production migrations |
| `npx prisma db push` | Sync schema without migrations |
| `npx prisma db pull` | Reverse engineer DB schema |
| `npx prisma studio` | GUI for database |
| `npx prisma validate` | Validate schema |
| `npx prisma format` | Format schema |
| `npx prisma migrate reset` | Reset and reseed DB |

---

## 📚 References

- [Prisma Official Docs](https://www.prisma.io/docs)
- [Prisma CLI Reference](https://www.prisma.io/docs/reference/api-reference/command-reference)
- [Nuxt + Prisma Module](https://nuxt.com/modules/prisma)

---

💡 **Tip:**  
If you’re using **Nuxt 3**, keep your Prisma client inside `server/` or use the module `@prisma/nuxt` for auto-import and client injection.

💡 **Manual migration:**  
```bash
npx prisma migrate resolve --applied add_rank_and_score_in_anime_table
```
```bash
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script | Out-File prisma/migrations/add_rank_and_score_in_anime_table/migration.sql -Encoding utf8
```
```bash
npx prisma migrate resolve --applied add_rank_and_score_in_anime_table
```
```bash
npx prisma generate
```