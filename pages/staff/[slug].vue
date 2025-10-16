<template>
  <V1Container class="staff-profile-page" tag="section" aria-label="Anime Filters" margin="xl">
    <!-- Loading State -->
    <CommonLoading v-if="pending" type="spinner" size="md" message="Loading profile..." overlay center />

    <!-- Profile Content -->
    <template v-else>
      <!-- Profile Header -->
      <UCard variant="neumorphic-outer">
        <V1Grid flow="column" length="1fr" gap="1rem" class="profile-header">
          <V1Image
            src="/image/image-230x345.webp"
            :data-src="staff?.medium_image_url || staff?.large_image_url || '/image/image-230x345.webp'"
            :alt="staff?.name" :width="250" :height="375" clickable />

          <V1Grid>
            <div>
              <h1 class="profile-name">{{ staff?.name }}</h1>
              <h2 v-if="staff?.name_native" class="profile-native-name">{{ staff?.name_native }}</h2>
            </div>

            <!-- Profile Stats Grid -->
            <V1Grid flow="row" length="1fr 1fr">
              <UCard variant="neumorphic-inner">
                <div class="stat-label">Age</div>
                <div class="stat-value">{{ staff?.age }}</div>
              </UCard>
              <UCard variant="neumorphic-inner">
                <div class="stat-label">Gender</div>
                <div class="stat-value">{{ staff?.gender }}</div>
              </UCard>
              <UCard variant="neumorphic-inner">
                <div class="stat-label">Birthday</div>
                <div class="stat-value">{{ staff?.date_of_birth }}</div>
              </UCard>
              <UCard variant="neumorphic-inner">
                <div class="stat-label">Hometown</div>
                <div class="stat-value">{{ staff?.home_town }}</div>
              </UCard>
            </V1Grid>
          </V1Grid>
        </V1Grid>
      </UCard>

      <!-- Biography Section -->
      <UCard variant="neumorphic-outer">
        <h3 class="section-title">Biography</h3>
        <p class="biography-paragraph">
          {{ description.rawAfterCleanup || 'No biography available.' }}
        </p>
      </UCard>

      <!-- Social Links Section -->
      <UCard variant="neumorphic-outer">
        <h3 class="section-title">Social Links</h3>
        <div class="social-links-grid">
          <UCard
            v-for="link in description.links"
            :key="link.label"
            as="li"
            variant="neumorphic-outline"
            @click="$router.push(link.url)"
          >
            <div class="social-icon">
              🌐
            </div>
            <div class="social-info">
              <div class="social-platform">{{ link.label }}</div>
              <div class="social-handle">{{ link.url }}</div>
            </div>
          </UCard>
        </div>
      </UCard>

      <!-- Works Section -->
      <UCard variant="neumorphic-outer">
        <h3 class="section-title">Notable Works</h3>
        <V1Grid template="columns" gap="1.5rem" length="150px" tag="ul">
          <UCard
            v-for="work in staff?.anime_staff_relations"
            :key="work.id"
            variant="neumorphic-inner"
            as="li"
            @click="$router.push(work.anime?.slug || '#')"
          >
            <V1Image src="/image/image-230x345.webp"
              :data-src="work.anime?.medium_cover_image_url || work.anime?.large_cover_image_url || '/image/image-230x345.webp'"
              :alt="work.anime?.title_romaji" />
            <NuxtLink :to="`/${work.anime?.slug}`">
              <h4 class="work-title">{{ work.anime?.title_romaji }}</h4>
            </NuxtLink>
            <p class="work-role">{{ work.staff_role?.name }}</p>
            <!-- <p class="work-year">{{ work.staff_role?.name }}</p> -->
          </UCard>
        </V1Grid>
      </UCard>
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
const description = computed(() => descriptionParser(staff.value?.description || ''))
useHead({ script: [{ innerHTML: `console.log(${JSON.stringify(description.value, null, 2)})` }] })

const { seoMeta } = useStaffSeo(staff)
useSeoMeta(seoMeta.value)
</script>

<style scoped lang="scss">
.staff-profile-page {
  min-height: 100vh;
  padding: 5rem 0;
  gap: 2rem;
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

/* Stats Grid */
.profile-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
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

.biography-paragraph {
  color: rgb(209, 213, 219);
  line-height: 1.75;
  font-size: 1.125rem;
}

/* Social Links Section */

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
  .works-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
