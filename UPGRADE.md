# Panduan Migrasi Nuxt 3 ke Nuxt 4

## Overview
Panduan ini menjelaskan langkah-langkah untuk migrasi project NuxtJS-Anime-Project dari Nuxt 3 ke Nuxt 4.

## Persiapan

### 1. Backup Project
```bash
# Buat backup branch terlebih dahulu
git checkout -b backup-before-nuxt4
git add .
git commit -m "Backup before Nuxt 4 migration"
git checkout V1
```

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

## Langkah Migrasi

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
npm update nuxt @nuxt/eslint @nuxt/image @nuxt/scripts @pinia/nuxt @nuxtjs/tailwindcss @prisma/nuxt @nuxt/icon
```

### 4. Clear Cache dan Reinstall
```bash
# Hapus cache dan node_modules
Remove-Item -Recurse -Force .nuxt, .output, node_modules -ErrorAction SilentlyContinue
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

### ✅ Data & API
- [ ] Database connection berfungsi
- [ ] API routes di `server/api/` response
- [ ] Prisma queries bekerja
- [ ] Anime data loading

### ✅ Styling
- [ ] Tailwind CSS berfungsi
- [ ] SCSS files di `assets/scss/` ter-compile
- [ ] Theme switching bekerja

### ✅ Advanced Features
- [ ] SEO meta tags generate
- [ ] Image optimization (@nuxt/image)
- [ ] Pinia stores berfungsi
- [ ] Auto-imports (composables) bekerja

## Troubleshooting

### Error Common
1. **Module resolution errors**
   ```bash
   rm -rf .nuxt .output
   npm run dev
   ```

2. **TypeScript errors**
   - Check `tsconfig.json` compatibility
   - Update types if needed

3. **Plugin errors**  
   - Check plugin compatibility di `plugins/`
   - Update plugin registration jika perlu

4. **Build errors**
   ```bash
   npm run build
   ```

### Rollback Plan
Jika migrasi gagal:
```bash
git checkout backup-before-nuxt4
git checkout -b rollback-v1
# Lanjutkan development di branch ini
```

## Breaking Changes Potential

### Auto-imports
- File di `composables/` tetap auto-import
- `textUtils.ts`, `useGenerateMetaSeo.ts`, `useThrottle.ts` harus tetap bekerja

### Server API
- Routes di `server/api/` format tetap sama
- Middleware di `server/middleware/` perlu dicek

### Plugins
- Plugin registration mungkin perlu penyesuaian kecil

## Post-Migration

### 1. Update Documentation
- Update `README.md` dengan info Nuxt 4
- Update dependencies list

### 2. Performance Check
- Test build time
- Test runtime performance  
- Check bundle size

### 3. Deploy Testing
- Test build production
- Test deployment pipeline

## Catatan Tambahan

- **Kompatibilitas**: Nuxt 4 mempertahankan backward compatibility
- **Auto-imports**: Tetap berfungsi untuk composables dan utils
- **TypeScript**: Support lebih baik untuk TypeScript
- **Performance**: Peningkatan performa build dan runtime

---

**Tanggal**: October 6, 2025  
**Project**: NuxtJS-Anime-Project  
**Branch**: V1 → Nuxt 4 Migration