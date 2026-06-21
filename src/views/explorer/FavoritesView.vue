<template>
  <div class="page">
    <NavBar />

    <div class="promo-banner">
      <span>🐾 Tu bienestar empieza con lo que eliges hoy</span>
    </div>

    <main class="content">

      <div class="header">
        <div>
          <h1 class="title">Mis Lugares Favoritos</h1>
          <p class="subtitle">Tus rincones culinarios guardados para cualquier momento.</p>
        </div>
        <button class="btn-filter">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Filtrar
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">Cargando favoritos...</div>

      <!-- Error -->
      <p v-else-if="error" class="error">{{ error }}</p>

      <!-- Vacío -->
      <div v-else-if="favorites.length === 0" class="empty">
        <span class="empty__icon">🤍</span>
        <p>Aún no tienes favoritos guardados.</p>
        <router-link to="/explorar" class="btn-explore">Explorar huariques</router-link>
      </div>

      <!-- Grid de favoritos -->
      <div v-else class="grid">
        <div
            v-for="rest in favorites"
            :key="rest.id"
            class="card"
            @click="$router.push(`/restaurante/${rest.id}`)"
        >
          <!-- Imagen -->
          <div class="card__img">
            <img v-if="rest.image" :src="rest.image" :alt="rest.name" />
            <div v-else class="card__img-placeholder">{{ rest.name.charAt(0) }}</div>
            <span class="card__badge card__badge--open">● Abierto</span>
          </div>

          <!-- Info -->
          <div class="card__body">
            <h3 class="card__name">{{ rest.name }}</h3>
            <div class="card__meta">
              <span class="card__tag">{{ rest.category || 'Huarique' }}</span>
              <span class="card__dot">•</span>
              <span class="card__price">S/ —</span>
              <span class="card__dot">•</span>
              <span class="card__dist">📍 {{ rest.address || 'Lima' }}</span>
            </div>
            <div class="card__saved">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-brand)" stroke="var(--color-brand)" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>Guardado</span>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar.vue'
import { communityApi, businessApi } from '@/services/api.js'

export default {
  name: 'FavoritesView',
  components: { NavBar },

  data() {
    return {
      favorites: [],
      loading: true,
      error: null
    }
  },

  async mounted() {
    try {
      // 1. Traer IDs de favoritos del usuario
      const favIds = await communityApi.getMyFavorites()
      if (!Array.isArray(favIds) || favIds.length === 0) {
        this.favorites = []
        return
      }

      // 2. Traer todos los huariques del business service
      const allHuariques = await businessApi.getHuariques()
      if (!Array.isArray(allHuariques)) {
        this.error = 'No se pudo cargar la información de los huariques.'
        return
      }

      // 3. Cruzar: solo los que están en favIds
      this.favorites = allHuariques.filter(h => favIds.includes(h.id))

    } catch (e) {
      this.error = 'Error al cargar favoritos. Verifica tu conexión.'
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.page { min-height: 100vh; background: var(--color-bg); }

.promo-banner {
  background: var(--color-brand); color: #fff;
  text-align: center; padding: 10px 1rem;
  font-size: 0.88rem; font-weight: 600;
}

.content {
  max-width: 900px; margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.header {
  display: flex; justify-content: space-between;
  align-items: flex-start; margin-bottom: 2rem;
}

.title {
  font-size: 1.6rem; font-weight: 900;
  color: var(--color-label); margin: 0 0 4px;
}

.subtitle {
  font-size: 0.88rem; color: var(--color-input-icon); margin: 0;
}

.btn-filter {
  display: flex; align-items: center; gap: 6px;
  background: none; border: 1.5px solid var(--color-input-border);
  border-radius: var(--radius-pill); padding: 8px 14px;
  font-size: 0.85rem; font-weight: 600; color: var(--color-label);
  cursor: pointer; transition: border-color 0.2s;
}
.btn-filter:hover { border-color: var(--color-brand); color: var(--color-brand); }

.loading { color: var(--color-input-icon); font-size: 0.9rem; }
.error   { color: var(--color-error); font-weight: 600; font-size: 0.88rem; }

.empty {
  text-align: center; padding: 4rem 0;
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
}
.empty__icon { font-size: 3rem; }
.empty p { color: var(--color-input-icon); font-size: 0.95rem; }

.btn-explore {
  background: var(--color-brand); color: #fff;
  padding: 10px 24px; border-radius: var(--radius-pill);
  text-decoration: none; font-weight: 700; font-size: 0.9rem;
  transition: background 0.2s;
}
.btn-explore:hover { background: var(--color-brand-dark); }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

/* Card */
.card {
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  box-shadow: 0 2px 12px var(--color-card-shadow);
  overflow: hidden; cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px var(--color-card-shadow);
}

.card__img {
  position: relative; height: 180px;
  background: var(--color-tab-inactive);
}
.card__img img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.card__img-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 3rem; font-weight: 800; color: var(--color-brand);
}

.card__badge {
  position: absolute; top: 10px; left: 10px;
  padding: 4px 10px; border-radius: var(--radius-pill);
  font-size: 0.75rem; font-weight: 700;
}
.card__badge--open {
  background: #e8f5e9; color: #2e7d32;
}

.card__body { padding: 1rem; }

.card__name {
  font-size: 1rem; font-weight: 800;
  color: var(--color-label); margin: 0 0 8px;
}

.card__meta {
  display: flex; align-items: center; gap: 6px;
  flex-wrap: wrap; font-size: 0.78rem; color: var(--color-input-icon);
  margin-bottom: 10px;
}

.card__tag {
  background: var(--color-tab-inactive);
  padding: 2px 8px; border-radius: var(--radius-pill);
  font-weight: 600; color: var(--color-label); font-size: 0.75rem;
}

.card__dot { opacity: 0.4; }

.card__saved {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.82rem; font-weight: 700; color: var(--color-brand);
}
</style>