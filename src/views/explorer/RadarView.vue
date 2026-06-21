<template>
  <div class="radar-view">
    <NavBar />

    <div class="radar-view__banner">
      <span>📡 Radar Activo — Mostrando huariques cerca de ti en tiempo real</span>
    </div>

    <main class="radar-view__content">

      <!-- Panel lateral -->
      <aside class="radar-view__sidebar">
        <h2 class="radar-view__title">Cerca de ti ahora</h2>

        <p v-if="geoError" class="radar-view__error">{{ geoError }}</p>

        <div v-else-if="geoLoading" class="radar-view__loading">Obteniendo tu ubicación...</div>

        <template v-else>
          <p v-if="radarError" class="radar-view__error">{{ radarError }}</p>

          <p v-else-if="!radarLoading && huariques.length === 0" class="radar-view__empty">
            No hay huariques aquí aún, ¡recomienda uno!
          </p>

          <!-- Lista de huariques -->
          <div v-else-if="!selectedHuarique" class="radar-view__list">
            <div
                v-for="h in huariques"
                :key="h.id"
                class="radar-card"
                @click="selectHuarique(h)"
            >
              <div class="radar-card__avatar">{{ h.name.charAt(0) }}</div>
              <div class="radar-card__info">
                <span class="radar-card__name">{{ h.name }}</span>
                <span class="radar-card__distance">📍 a {{ h.distanceMeters }}m</span>
              </div>
            </div>
          </div>

          <!-- Tarjeta expandida del huarique seleccionado -->
          <div v-else class="huarique-detail">
            <button class="huarique-detail__back" @click="selectedHuarique = null">← Volver</button>

            <div class="huarique-detail__avatar">{{ selectedHuarique.name.charAt(0) }}</div>

            <h3 class="huarique-detail__name">{{ selectedHuarique.name }}</h3>
            <span class="huarique-detail__distance">📍 a {{ selectedHuarique.distanceMeters }}m — {{ selectedHuarique.address }}</span>

            <div v-if="detailLoading" class="radar-view__loading">Cargando menú...</div>

            <template v-else-if="selectedMenu">
              <h4 class="huarique-detail__subtitle">Categorías</h4>
              <div class="huarique-detail__tags">
                <span v-for="c in selectedMenu.categories" :key="c" class="tag">{{ c }}</span>
              </div>

              <h4 class="huarique-detail__subtitle">Menú</h4>
              <p v-if="!selectedMenu.products || selectedMenu.products.length === 0" class="radar-view__empty">
                Este huarique aún no publicó su menú.
              </p>
              <div v-else class="huarique-detail__products">
                <div v-for="p in selectedMenu.products" :key="p.id" class="product-row">
                  <span class="product-row__name">{{ p.name }}</span>
                  <span class="product-row__price">S/ {{ p.price?.toFixed(2) }}</span>
                </div>
              </div>
            </template>

            <h4 class="huarique-detail__subtitle">Reseñas recientes</h4>
            <div v-if="reviewsLoading" class="radar-view__loading">Cargando reseñas...</div>
            <p v-else-if="reviews.length === 0" class="radar-view__empty">Aún no hay reseñas.</p>
            <div v-else class="huarique-detail__reviews">
              <div v-for="r in reviews" :key="r.id" class="review-row">
                <span class="review-row__user">{{ r.customerUsername }}</span>
                <span class="review-row__rating">⭐ {{ r.rating }}</span>
                <p v-if="r.comment" class="review-row__comment">{{ r.comment }}</p>
              </div>
            </div>
          </div>
        </template>
      </aside>

      <!-- Mapa -->
      <section class="radar-view__map">
        <RadarMapViewer
            :user-lat="latitude"
            :user-lng="longitude"
            :huariques="huariques"
            :loading="radarLoading"
            :selected-huarique-id="selectedHuarique?.id || null"
            @select-huarique="goToDetail"
        />
      </section>

    </main>
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar.vue'
import RadarMapViewer from '@/components/explorer/RadarMapViewer.vue'
import { useGeolocation } from '@/composables/useGeolocation.js'
import { useRadarStore } from '@/stores/radarStore.js'
import { businessApi, communityApi } from '@/services/api.js'

export default {
  name: 'RadarView',
  components: { NavBar, RadarMapViewer },

  setup() {
    const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation()
    const { huariques, loading: radarLoading, error: radarError, loadNearbyHuariques } = useRadarStore()

    return { latitude, longitude, geoError, geoLoading, huariques, radarLoading, radarError, loadNearbyHuariques }
  },

  data() {
    return {
      selectedHuarique: null,
      selectedMenu: null,
      detailLoading: false,
      reviews: [],
      reviewsLoading: false
    }
  },

  watch: {
    latitude(newVal) {
      if (newVal != null) {
        this.loadNearbyHuariques(this.latitude, this.longitude)
      }
    }
  },

  methods: {
    async selectHuarique(h) {
      this.selectedHuarique = h
      this.selectedMenu = null
      this.reviews = []
      await Promise.all([this.loadMenu(h.id), this.loadReviews(h.id)])
    },

    async loadMenu(id) {
      this.detailLoading = true
      try {
        const data = await businessApi.getMenu(id)
        this.selectedMenu = data.menu || data
      } catch (e) {
        console.error('Error cargando menú', e)
      } finally {
        this.detailLoading = false
      }
    },

    async loadReviews(id) {
      this.reviewsLoading = true
      try {
        const data = await communityApi.getReviews(id)
        this.reviews = Array.isArray(data) ? data : []
      } catch (e) {
        console.error('Error cargando reseñas', e)
      } finally {
        this.reviewsLoading = false
      }
    },

    goToDetail(id) {
      const h = this.huariques.find(x => x.id === id)
      if (h) this.selectHuarique(h)
    }
  }
}
</script>

<style scoped>
.radar-view { min-height: 100vh; background: var(--color-bg); }

.radar-view__banner {
  background: var(--color-brand); color: #fff;
  text-align: center; padding: 8px 1rem;
  font-size: 0.82rem; font-weight: 600;
}

.radar-view__content {
  max-width: 1400px; margin: 0 auto;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  height: calc(100vh - 110px);
}

.radar-view__sidebar {
  overflow-y: auto;
  padding-right: 4px;
}

.radar-view__title {
  font-size: 1.1rem; font-weight: 800;
  color: var(--color-label); margin-bottom: 1rem;
}

.radar-view__loading,
.radar-view__empty {
  color: var(--color-input-icon); font-size: 0.88rem;
}

.radar-view__error {
  color: var(--color-error); font-size: 0.85rem; font-weight: 600;
}

.radar-view__list {
  display: flex; flex-direction: column; gap: 0.75rem;
}

.radar-card {
  display: flex; align-items: center; gap: 12px;
  background: var(--color-card-bg);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  box-shadow: 0 2px 8px var(--color-card-shadow);
  cursor: pointer;
  transition: transform 0.15s;
}
.radar-card:hover { transform: translateY(-2px); }

.radar-card__avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--color-brand-light);
  color: #fff; font-weight: 800; font-size: 1.1rem;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.radar-card__info { display: flex; flex-direction: column; gap: 2px; }
.radar-card__name { font-weight: 700; font-size: 0.9rem; color: var(--color-label); }
.radar-card__distance { font-size: 0.78rem; color: var(--color-input-icon); }

.radar-view__map { border-radius: var(--radius-xl); overflow: hidden; }

@media (max-width: 860px) {
  .radar-view__content { grid-template-columns: 1fr; height: auto; }
  .radar-view__map { height: 400px; }
}

.huarique-detail {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.huarique-detail__back {
  background: none;
  border: none;
  color: var(--color-brand);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  text-align: left;
  padding: 0;
  margin-bottom: 4px;
}

.huarique-detail__avatar {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--color-brand-light);
  color: #fff; font-weight: 800; font-size: 1.6rem;
  display: flex; align-items: center; justify-content: center;
}

.huarique-detail__name {
  font-size: 1.1rem; font-weight: 800; color: var(--color-label);
}

.huarique-detail__distance {
  font-size: 0.8rem; color: var(--color-input-icon);
}

.huarique-detail__subtitle {
  font-size: 0.85rem; font-weight: 700; color: var(--color-label);
  margin-top: 8px;
}

.huarique-detail__tags {
  display: flex; flex-wrap: wrap; gap: 6px;
}

.tag {
  background: var(--color-tab-inactive);
  color: var(--color-tab-text-inactive);
  font-size: 0.72rem; font-weight: 600;
  padding: 4px 10px; border-radius: var(--radius-pill);
}

.huarique-detail__products {
  display: flex; flex-direction: column; gap: 6px;
}

.product-row {
  display: flex; justify-content: space-between;
  background: var(--color-card-bg);
  padding: 8px 10px; border-radius: var(--radius-md);
  font-size: 0.85rem;
}

.product-row__name { color: var(--color-label); font-weight: 600; }
.product-row__price { color: var(--color-brand); font-weight: 700; }

.huarique-detail__reviews {
  display: flex; flex-direction: column; gap: 8px;
}

.review-row {
  background: var(--color-card-bg);
  padding: 8px 10px; border-radius: var(--radius-md);
}

.review-row__user { font-weight: 700; font-size: 0.82rem; color: var(--color-label); }
.review-row__rating { font-size: 0.78rem; margin-left: 6px; }
.review-row__comment { font-size: 0.8rem; color: var(--color-input-icon); margin-top: 4px; }
</style>