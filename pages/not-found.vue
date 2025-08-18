<script setup lang="ts">
// Set the error status code
setResponseStatus(404)

// SEO meta for 404 page
useSeoMeta({
  title: '404 - Page Not Found | AniWorld',
  description: 'The page you are looking for could not be found. Browse our anime collection or return to the homepage.',
  ogTitle: '404 - Page Not Found | AniWorld',
  ogDescription: 'The page you are looking for could not be found.',
  ogType: 'website',
  twitterCard: 'summary',
  twitterTitle: '404 - Page Not Found | AniWorld',
  twitterDescription: 'The page you are looking for could not be found.'
})

// Navigation function
const router = useRouter()
const goBack = () => {
  if (import.meta.client && window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="error-page">
    <div class="error-container">
      <!-- 404 Animation/Icon -->
      <div class="error-icon">
        <div class="number-404">
          <span class="four">4</span>
          <span class="zero">0</span>
          <span class="four">4</span>
        </div>
        <div class="anime-character">
          <div class="character-face">
            <div class="eyes">
              <div class="eye left" />
              <div class="eye right" />
            </div>
            <div class="mouth" />
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div class="error-content">
        <h1 class="error-title">Oops! Page Not Found</h1>
        <p class="error-description">
          The anime page you're looking for seems to have disappeared into another dimension.
          Don't worry, even the best anime characters get lost sometimes!
        </p>
        
        <!-- Action Buttons -->
        <div class="error-actions">
          <button class="btn btn-secondary" @click="goBack">
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
          
          <NuxtLink to="/" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </NuxtLink>
        </div>

        <!-- Popular Links -->
        <div class="popular-links">
          <h3>Popular Sections:</h3>
          <div class="links-grid">
            <NuxtLink to="/" class="popular-link">
              <span>🏠</span> Home
            </NuxtLink>
            <NuxtLink to="/anime" class="popular-link">
              <span>📺</span> Browse Anime
            </NuxtLink>
            <NuxtLink to="/trending" class="popular-link">
              <span>🔥</span> Trending
            </NuxtLink>
            <NuxtLink to="/search" class="popular-link">
              <span>🔍</span> Search
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.error-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.error-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.error-icon {
  margin-bottom: 2rem;
  position: relative;
}

.number-404 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.number-404 span {
  font-size: 4rem;
  font-weight: bold;
  color: #667eea;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: bounce 2s infinite;
}

.number-404 .zero {
  animation-delay: 0.2s;
}

.number-404 .four:last-child {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.anime-character {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.character-face {
  width: 80px;
  height: 80px;
  background: #ffd700;
  border-radius: 50%;
  position: relative;
  border: 3px solid #333;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.eyes {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 15px;
}

.eye {
  width: 12px;
  height: 12px;
  background: #333;
  border-radius: 50%;
  animation: blink 4s infinite;
}

@keyframes blink {
  0%, 90%, 100% {
    transform: scaleY(1);
  }
  95% {
    transform: scaleY(0.1);
  }
}

.mouth {
  width: 20px;
  height: 10px;
  background: #333;
  border-radius: 0 0 20px 20px;
  margin: 10px auto 0;
}

.error-content {
  color: #333;
}

.error-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #667eea;
}

.error-description {
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-secondary {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.popular-links {
  text-align: center;
}

.popular-links h3 {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.popular-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 10px;
  text-decoration: none;
  color: #667eea;
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.popular-link:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.popular-link span {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .error-container {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  
  .number-404 span {
    font-size: 3rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 200px;
  }
  
  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .error-container {
    padding: 1.5rem 1rem;
  }
  
  .number-404 span {
    font-size: 2.5rem;
  }
  
  .error-title {
    font-size: 1.75rem;
  }
  
  .error-description {
    font-size: 1rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .error-container {
    background: rgba(30, 30, 30, 0.95);
    color: #e5e5e5;
  }
  
  .error-title {
    color: #9ca3af;
  }
  
  .error-description {
    color: #9ca3af;
  }
  
  .popular-links h3 {
    color: #9ca3af;
  }
  
  .popular-link {
    background: rgba(255, 255, 255, 0.05);
    color: #9ca3af;
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .popular-link:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
