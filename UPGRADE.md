# Panduan Migrasi Nuxt 3 ke Nuxt 4

## Overview
Panduan ini menjelaskan langkah-langkah untuk migrasi project NuxtJS-Anime-Project dari Nuxt 3 ke Nuxt 4.

## Persiapan

### 1. Buat Branch Migrasi (Recommended)
```bash
# Pastikan berada di branch V1 dan clean
git checkout V1
git status

# Buat branch baru khusus untuk migrasi
git checkout -b migrate-to-nuxt4

# ATAU jika ingin backup juga (extra safety)
git checkout -b backup-before-nuxt4
git checkout V1
git checkout -b migrate-to-nuxt4
```

**Keuntungan strategi ini:**
- ✅ Branch `V1` tetap stabil dan bisa di-deploy kapan saja
- ✅ Bisa eksperimen bebas di `migrate-to-nuxt4`
- ✅ Mudah rollback jika ada masalah (tinggal delete branch)
- ✅ Bisa review changes sebelum merge
- ✅ Tim lain bisa tetap development di `V1`

### 2. Update Nuxt Config
File `nuxt.config.ts` sudah dikonfigurasi dengan benar:
```ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4, // ✅ Sudah benar
  },
  // ... config lainnya
})
```

## Langkah Migrasi (di Branch migrate-to-nuxt4)

### 3. Update Dependencies
Update semua dependencies Nuxt ke versi 4.x:

```json
{
  "dependencies": {
    "nuxt": "^4.0.0",
    "@nuxt/eslint": "latest",
    "@nuxt/image": "latest", 
    "@nuxt/scripts": "latest",
    "@nuxt/test-utils": "latest",
    "@pinia/nuxt": "latest",
    "@nuxtjs/tailwindcss": "latest",
    "@prisma/nuxt": "latest",
    "@nuxt/icon": "latest"
  }
}
```

Jalankan update:
```bash
# Update Nuxt core
npm install nuxt@latest

# Update Nuxt modules
npm update @nuxt/eslint @nuxt/image @nuxt/icon @nuxt/test-utils

# Update UI framework (pilih salah satu)
# Opsi A: Nuxt UI v2 (kompatibel Nuxt 3 & 4)
npm install @nuxt/ui@^2.18.7

# Opsi B: Nuxt UI v3 (hanya Nuxt 4)
npm install @nuxt/ui@latest

# Update dependencies lainnya
npm update @pinia/nuxt @nuxtjs/tailwindcss @prisma/nuxt
```

### 4. Clear Cache dan Reinstall
```bash
# Windows PowerShell
Remove-Item -Recurse -Force .nuxt, .output, node_modules -ErrorAction SilentlyContinue
npm install

# Linux/Mac
rm -rf .nuxt .output node_modules
npm install
```

### 5. Test Aplikasi
```bash
npm run dev
```

## Struktur Folder

### Struktur TIDAK Berubah
Struktur folder utama tetap sama:
```
├── components/      # ✅ Tidak berubah
├── composables/     # ✅ Tidak berubah  
├── pages/           # ✅ Tidak berubah
├── plugins/         # ✅ Tidak berubah
├── middleware/      # ✅ Tidak berubah
├── layouts/         # ✅ Tidak berubah
├── server/          # ✅ Tidak berubah
├── assets/          # ✅ Tidak berubah
├── public/          # ✅ Tidak berubah
├── stores/          # ✅ Tidak berubah (Pinia)
├── prisma/          # ✅ Tidak berubah
├── database/        # ✅ Tidak berubah
```

### Folder Opsional Baru (Jika Diperlukan)
```
├── app/             # 🆕 Opsional untuk app config
├── utils/           # 🆕 Auto-import utils (jika tidak pakai composables)
```

## File yang Perlu Diperhatikan

### 1. Root Files
- ✅ `app.vue` - Check struktur app wrapper
- ✅ `error.vue` - Pastikan error handling compatible
- ✅ `nuxt.config.ts` - Sudah dikonfigurasi dengan benar

### 2. Components
Semua komponen di folder berikut harus tetap berfungsi:
- `components/common/` - Header, Footer, Search, dll
- `components/media/` - Anime, Character, Staff, dll  
- `components/UI/` - Button, Card, Input components
- `components/V1/` - Legacy components

### 3. Modules
Module custom yang ada:
- `modules/anime/`
- `modules/blog/`
- `modules/forum/`
- `modules/trending-cache/`

### 4. Server Routes
Routes di `server/api/` harus tetap kompatible.

### 5. Database
- `database/anime.sqlite` dan Prisma schema tetap sama
- `lib/prisma.ts` harus tetap berfungsi

## Checklist Testing

### ✅ Basic Functionality
- [ ] Aplikasi bisa start dengan `npm run dev`  
- [ ] Homepage (`pages/index.vue`) load dengan benar
- [ ] Navigation berfungsi
- [ ] Search functionality bekerja

### ✅ Components
- [ ] Common components (Header, Footer) render
- [ ] Media components (Anime cards, Character) berfungsi
- [ ] UI components (Buttons, Cards) styling benar
- [ ] Nuxt UI components (UAlert, UButton, dll) berfungsi

### ✅ Data & API
- [ ] Database connection berfungsi
- [ ] API routes di `server/api/` response
- [ ] Prisma queries bekerja
- [ ] Anime data loading

### ✅ Styling
- [ ] Tailwind CSS berfungsi
- [ ] SCSS files di `assets/scss/` ter-compile
- [ ] Theme switching bekerja

### ✅ Build & Production
- [ ] `npm run build` berhasil tanpa error
- [ ] `npm run preview` berfungsi
- [ ] Bundle size reasonable

## Merge Strategy

### Jika Migrasi SUKSES ✅

```bash
# 1. Pastikan semua test passed
npm run build
npm run preview

# 2. Commit semua perubahan
git add .
git commit -m "feat: migrate to Nuxt 4"

# 3. Kembali ke V1
git checkout V1

# 4. Merge migrate-to-nuxt4 ke V1
git merge migrate-to-nuxt4

# 5. Push ke remote
git push origin V1

# 6. (Opsional) Hapus branch migrasi
git branch -d migrate-to-nuxt4
git push origin --delete migrate-to-nuxt4
```

### Jika Migrasi GAGAL ❌

```bash
# 1. Kembali ke V1 (yang masih stabil)
git checkout V1

# 2. Hapus branch migrasi
git branch -D migrate-to-nuxt4

# 3. Tetap development di V1 dengan Nuxt 3
# Atau coba lagi dengan strategi berbeda
```

## Rollback Plan

### Quick Rollback (Jika sudah merge tapi ada masalah)
```bash
# Revert merge commit
git revert -m 1 HEAD

# Atau reset ke commit sebelum merge
git reset --hard HEAD~1
git push origin V1 --force  # HATI-HATI!
```

### Safe Rollback (Jika punya backup branch)
```bash
git checkout backup-before-nuxt4
git checkout -b V1-rollback
# Continue development here
```

## Troubleshooting

### Error Common
1. **Module resolution errors**
   ```bash
   rm -rf .nuxt .output node_modules
   npm install
   npm run dev
   ```

2. **Nuxt UI incompatibility**
   ```bash
   # Downgrade ke versi kompatibel
   npm install @nuxt/ui@^2.18.7
   ```

3. **TypeScript errors**
   - Check `.nuxt/tsconfig.json` setelah `npm run dev`
   - Update global types jika perlu

4. **Build errors**
   ```bash
   # Clean build
   rm -rf .nuxt .output
   npm run build
   ```

## Git Workflow Visualization

```
V1 (stable, Nuxt 3)
 |
 |-- migrate-to-nuxt4 (experimental)
 |    |
 |    |-- [upgrade dependencies]
 |    |-- [fix errors]
 |    |-- [testing]
 |    |
 |    |-- SUKSES? --> merge ke V1
 |    |
 |    |-- GAGAL? --> delete branch
 |
 |-- (tetap stabil, bisa deploy)
```

## Post-Migration

### 1. Update Documentation
- [ ] Update `README.md` dengan Nuxt 4 info
- [ ] Update dependencies list di `package.json`
- [ ] Tag release: `git tag v2.0.0-nuxt4`

### 2. Performance Check
- [ ] Compare build time (Nuxt 3 vs 4)
- [ ] Test runtime performance  
- [ ] Check bundle size reduction

### 3. Deploy Testing
- [ ] Test staging deployment
- [ ] Smoke test production features
- [ ] Monitor error logs

## Catatan Tambahan

- **Timeline**: Lakukan migrasi di waktu low-traffic
- **Team Communication**: Inform team sebelum merge ke V1
- **Backup Database**: Pastikan database ter-backup
- **Feature Freeze**: Hindari merge fitur baru selama migrasi

---

**Tanggal**: October 7, 2025  
**Project**: NuxtJS-Anime-Project  
**Strategy**: Feature Branch Migration (`migrate-to-nuxt4` → `V1`)