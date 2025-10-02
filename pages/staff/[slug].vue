<template>
  <V1Container class="staff-profile-page">
    <!-- Loading State -->
    <CommonLoading v-if="pending" type="spinner" size="md" message="Loading profile..." overlay center />
    
    <!-- Profile Content -->
    <template v-else>
      <!-- Profile Header -->
      <section class="profile-header">
        <div class="profile-image-section">
          <div class="profile-image-wrapper">
            <V1Image
              src="/image/image-230x345.webp"
              :data-src="staff?.medium_image_url || staff?.large_image_url || '/image/image-230x345.webp'"
              :alt="staff?.name"
              :width="250"
              :height="375"
              clickable
            />
          </div>
        </div>
        
        <div class="profile-info-section">
          <div class="profile-basic-info">
            <h1 class="profile-name">{{ staff?.name }}</h1>
            <h2 v-if="staff?.name_native" class="profile-native-name">{{ staff?.name_native }}</h2>
            <p class="profile-role">{{ profileData.role }}</p>
          </div>
          
          <!-- Profile Stats Grid -->
          <div class="profile-stats-grid">
            <V1Card layout="none" variant="inner">
              <div class="stat-label">Age</div>
              <div class="stat-value">{{ staff?.age }}</div>
            </V1Card>
            <V1Card layout="none" variant="inner">
              <div class="stat-label">Gender</div>
              <div class="stat-value">{{ staff?.gender }}</div>
            </V1Card>
            <V1Card layout="none" variant="inner">
              <div class="stat-label">Birthday</div>
              <div class="stat-value">{{ staff?.date_of_birth }}</div>
            </V1Card>
            <V1Card layout="none" variant="inner">
              <div class="stat-label">Hometown</div>
              <div class="stat-value">{{ staff?.home_town }}</div>
            </V1Card>
          </div>
        </div>
      </section>

      <!-- Biography Section -->
      <section class="biography-section">
        <h3 class="section-title">Biography</h3>
        <div class="biography-content">
          <p class="biography-paragraph">
            {{ staff?.description }}
          </p>
        </div>
      </section>

      <!-- Social Links Section -->
      <section class="social-links-section">
        <h3 class="section-title">Social Links</h3>
        <div class="social-links-grid">
          <a 
            v-for="link in profileData.socialLinks" 
            :key="link.platform"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link-card"
          >
            <div class="social-icon">
              {{ link.emoji }}
            </div>
            <div class="social-info">
              <div class="social-platform">{{ link.platform }}</div>
              <div class="social-handle">{{ link.handle }}</div>
            </div>
          </a>
        </div>
      </section>

      <!-- Works Section -->
      <V1Card tag="section" layout="none" variant="both" padding="lg">
        <h3 class="section-title">Notable Works</h3>
        <div class="works-grid">
          <V1Card
            v-for="work in staff?.anime_staff_relations"
            :key="work.id"
            layout="none"
            variant="inner"
          >
          <!-- <V1Card
            v-for="work in staff?.anime_staff_relations"
            :key="work.id"
            layout="none"
            variant="inner"
            clickable
            :href="`/${work.anime?.slug}`"
          > -->
            <V1Image
              src="/image/image-230x345.webp"
              :data-src="work.anime?.medium_cover_image_url || work.anime?.large_cover_image_url || '/image/image-230x345.webp'"
              :alt="work.anime?.title_romaji"
              clickable
            />
            <NuxtLink :to="`/${work.anime?.slug}`">
              <h4 class="work-title">{{ work.anime?.title_romaji }}</h4>
            </NuxtLink>
            <p class="work-role">{{ work.staff_role?.name }}</p>
            <!-- <p class="work-year">{{ work.staff_role?.name }}</p> -->
          </V1Card>
        </div>
      </V1Card>
    </template>
  </V1Container>
</template>

<script setup lang="ts">
import type { ResponseType } from '~/types/database'
import type { AnimeStaffRelation } from '~/types/relations'
import type { Staff } from '~/types/metadata'

interface StaffData extends Staff {
  anime_staff_relations: AnimeStaffRelation[]
}

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const staffId = computed(() => {
  const parts = slug.value.split('-')
  return parts[0] ? parseInt(parts[0]) : null
})

const { data: response, pending, error: _error } = await useFetch<ResponseType>(`/api/staff/${staffId.value}`, {
  key: `staff-${staffId.value}`,
  server: true,
  default: () => ({ success: false, code: 404, message: 'Staff member not found', length: 0, data: [] })
})

const staff = computed(() => response.value?.data?.[0] as StaffData | undefined)

const profileData = reactive({
  name: "Hiroshi Kamiya",
  nativeName: "神谷 浩史",
  role: "Voice Actor / Seiyuu",
  imageUrl: "/image/staff-profile-placeholder.webp",
  age: "48",
  gender: "Male",
  birthday: "January 28, 1975",
  hometown: "Matsudo, Chiba, Japan",
  bloodType: "A",
  height: "167 cm",
  biography: [
    "Hiroshi Kamiya is a Japanese voice actor and singer affiliated with Aoni Production. He is known for his distinctive voice and has voiced many popular anime characters.",
    "He won the Best Lead Actor Award at the 2nd Seiyu Awards in 2008 and the Best Supporting Actor Award at the 3rd Seiyu Awards in 2009. He is particularly famous for voicing Araragi Koyomi in the Monogatari series.",
    "Kamiya has also been active as a radio personality and has released several character songs and albums. He is considered one of the most popular voice actors in Japan."
  ],
  socialLinks: [
    {
      platform: "Twitter",
      handle: "@HiroshiKamiya_",
      url: "https://twitter.com/HiroshiKamiya_",
      emoji: "🐦"
    },
    {
      platform: "Instagram",
      handle: "@hiroshi_kamiya_official",
      url: "https://instagram.com/hiroshi_kamiya_official",
      emoji: "📸"
    },
    {
      platform: "Official Website",
      handle: "kamiya-hiroshi.com",
      url: "https://kamiya-hiroshi.com",
      emoji: "🌐"
    }
  ]
})

const { seoMeta } = useStaffSeo(staff)
useSeoMeta(seoMeta.value)
</script>

<style scoped>
.staff-profile-page {
  min-height: 100vh;
  padding: 5rem 0;
  gap: 2rem;
}

/* Profile Header */
.profile-header {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  background-color: rgba(17, 24, 39, 0.5);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(75, 85, 99, 0.3);
}

@media (min-width: 1024px) {
  .profile-header {
    grid-template-columns: 1fr 2fr;
  }
}

.profile-image-section {
  display: flex;
  justify-content: center;
}

@media (min-width: 1024px) {
  .profile-image-section {
    justify-content: flex-start;
  }
}

.profile-image-wrapper {
  position: relative;
}

.profile-image {
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 2px solid rgba(75, 85, 99, 0.5);
  transition: all 0.3s ease;
}

.profile-image:hover {
  border-color: rgb(59, 130, 246);
}

.profile-info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-basic-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.profile-name {
  font-size: 2.25rem;
  font-weight: bold;
  color: white;
  line-height: 1.2;
}

.profile-native-name {
  font-size: 1.5rem;
  color: rgb(209, 213, 219);
  font-weight: 500;
}

.profile-role {
  font-size: 1.125rem;
  color: rgb(96, 165, 250);
  font-weight: 600;
}

/* Stats Grid */
.profile-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) {
  .profile-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-label {
  font-size: 0.875rem;
  color: rgb(156, 163, 175);
  font-weight: 500;
}

.stat-value {
  font-size: 1.125rem;
  color: white;
  font-weight: 600;
  margin-top: 0.25rem;
}

/* Section Styles */
.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(75, 85, 99, 0.5);
  padding-bottom: 0.5rem;
}

/* Biography Section */
.biography-section {
  background-color: rgba(17, 24, 39, 0.5);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(75, 85, 99, 0.3);
}

.biography-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.biography-paragraph {
  color: rgb(209, 213, 219);
  line-height: 1.75;
  font-size: 1.125rem;
}

/* Social Links Section */
.social-links-section {
  background-color: rgba(17, 24, 39, 0.5);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(75, 85, 99, 0.3);
}

.social-links-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .social-links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .social-links-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.social-link-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: rgba(31, 41, 55, 0.6);
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid rgba(75, 85, 99, 0.5);
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link-card:hover {
  border-color: rgb(59, 130, 246);
  background-color: rgba(31, 41, 55, 0.8);
}

.social-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: rgba(96, 165, 250, 0.1);
  border-radius: 0.5rem;
}

.social-info {
  flex: 1;
}

.social-platform {
  color: white;
  font-weight: 600;
}

.social-handle {
  color: rgb(156, 163, 175);
  font-size: 0.875rem;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .works-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .works-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.work-card {
  background-color: rgba(31, 41, 55, 0.6);
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid rgba(75, 85, 99, 0.5);
  transition: all 0.3s ease;
}

.work-card:hover {
  border-color: rgb(59, 130, 246);
  background-color: rgba(31, 41, 55, 0.8);
}

.work-title {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.work-role {
  color: rgb(96, 165, 250);
  font-size: 0.75rem;
  font-weight: 500;
}

.work-year {
  color: rgb(156, 163, 175);
  font-size: 0.75rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-header {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .profile-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .works-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
