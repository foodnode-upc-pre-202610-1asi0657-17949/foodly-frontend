<template>
  <div class="home">
    <NavBar />

    <div class="promo-banner">
      <span>🍽️ Tu bienestar empieza con lo que eliges hoy</span>
    </div>

    <main class="home__content">

      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <span @click="selectedCategory = null" :class="{ 'breadcrumb__link': selectedCategory }">Inicio</span>
        <span v-if="selectedCategory"> › Categorías</span>
      </div>

      <!-- Categorías -->
      <section class="section">
        <h2 class="section__title">Categorías</h2>
        <div class="categories">
          <button
              v-for="cat in categories"
              :key="cat.id"
              class="category"
              :class="{ 'category--active': selectedCategory === cat.id }"
              @click="selectedCategory = selectedCategory === cat.id ? null : cat.id"
          >
            <div class="category__icon">{{ cat.emoji }}</div>
            <span class="category__label">{{ cat.label }}</span>
          </button>
        </div>
      </section>

      <!-- Vista filtrada por categoría -->
      <section v-if="selectedCategory" class="section">
        <h2 class="section__title">{{ categoriaLabel }} ({{ filteredHuariques.length }})</h2>
        <div v-if="loading" class="loading">Cargando...</div>
        <p v-else-if="filteredHuariques.length === 0" class="empty">
          No hay huariques en esta categoría aún.
        </p>
        <div v-else class="cards-grid">
          <RestaurantCard
              v-for="rest in filteredHuariques"
              :key="rest.id"
              :restaurant="rest"
              @click="goToDetail(rest.id)"
          />
        </div>
      </section>

      <!-- Vista normal (sin filtro) -->
      <template v-else>

        <!-- Top 5 -->
        <section class="section">
          <h2 class="section__title">¡Los 5 más elegidos!</h2>
          <div v-if="loading" class="loading">Cargando...</div>
          <div v-else class="top5">
            <div
                v-for="rest in top5"
                :key="rest.id"
                class="top5__item"
                @click="goToDetail(rest.id)"
            >
              <div class="top5__avatar">
                <div class="top5__avatar-placeholder">{{ rest.name.charAt(0) }}</div>
              </div>
              <span class="top5__name">{{ rest.name }}</span>
            </div>
          </div>
        </section>

        <!-- Todos los huariques -->
        <section class="section">
          <h2 class="section__title">Huariques disponibles ({{ huariques.length }})</h2>
          <div v-if="loading" class="loading">Cargando...</div>
          <p v-else-if="error" class="error">{{ error }}</p>
          <p v-else-if="huariques.length === 0" class="empty">Aún no hay huariques registrados.</p>
          <div v-else class="cards-grid">
            <RestaurantCard
                v-for="rest in huariques"
                :key="rest.id"
                :restaurant="rest"
                @click="goToDetail(rest.id)"
            />
          </div>
        </section>

      </template>

    </main>
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar.vue'
import RestaurantCard from '@/components/explorer/RestaurantCard.vue'
import { businessApi } from '@/services/api.js'

export default {
  name: 'ExploreView',
  components: { NavBar, RestaurantCard },

  data() {
    return {
      selectedCategory: null,
      huariques: [],
      loading: true,
      error: null,

      categories: [
        { id: 'saludable', emoji: '🥗', label: 'Saludable' },
        { id: 'polleria',  emoji: '🍗', label: 'Pollería' },
        { id: 'fastfood',  emoji: '🍔', label: 'Fast Food' },
        { id: 'postres',   emoji: '🍰', label: 'Postres' },
        { id: 'bebidas',   emoji: '☕', label: 'Bebidas Calientes' },
        { id: 'ceviche',   emoji: '🐟', label: 'Cevichería' },
        { id: 'criolla',   emoji: '🍲', label: 'Criolla' },
      ],
    }
  },

  computed: {
    top5() {
      return this.huariques.slice(0, 5)
    },
    categoriaLabel() {
      return this.categories.find(c => c.id === this.selectedCategory)?.label || ''
    },
    // Filtra por categoría — cuando el backend tenga el campo 'category'
    // por ahora muestra todos si no hay match exacto
    filteredHuariques() {
      if (!this.selectedCategory) return this.huariques
      return this.huariques.filter(h =>
          h.category === this.selectedCategory ||
          h.name?.toLowerCase().includes(this.selectedCategory)
      )
    }
  },

  async mounted() {
    try {
      const data = await businessApi.getHuariques()
      this.huariques = Array.isArray(data) ? data : []
    } catch (e) {
      this.error = 'No se pudo conectar al servidor.'
    } finally {
      this.loading = false
    }
  },

  methods: {
    goToDetail(id) {
      this.$router.push(`/restaurante/${id}`)
    }
  }
}
</script>

<style scoped>
.home { min-height: 100vh; background: var(--color-bg); }

.promo-banner {
  background: var(--color-brand); color: #fff;
  text-align: center; padding: 10px 1rem;
  font-size: 0.88rem; font-weight: 600;
}

.home__content {
  max-width: 900px; margin: 0 auto;
  padding: 1rem 1.5rem 4rem;
  display: flex; flex-direction: column; gap: 2rem;
}

.breadcrumb {
  font-size: 0.82rem; color: var(--color-input-icon);
}
.breadcrumb__link {
  cursor: pointer; color: var(--color-brand); font-weight: 600;
}
.breadcrumb__link:hover { text-decoration: underline; }

.section__title {
  font-size: 1.25rem; font-weight: 800;
  color: var(--color-label); margin-bottom: 1.25rem;
}

.loading { color: var(--color-input-icon); font-size: 0.9rem; }
.error   { color: var(--color-error); font-size: 0.88rem; font-weight: 600; }
.empty   { color: var(--color-input-icon); font-size: 0.88rem; }

.categories { display: flex; gap: 1.5rem; flex-wrap: wrap; }

.category {
  display: flex; flex-direction: column; align-items: center;
  gap: 8px; background: none; border: none; cursor: pointer; padding: 0;
}
.category__icon {
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--color-card-bg);
  box-shadow: 0 2px 10px var(--color-card-shadow);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; transition: transform 0.2s;
  border: 2.5px solid transparent;
}
.category:hover .category__icon { transform: translateY(-3px); }
.category--active .category__icon {
  border-color: var(--color-brand);
  background: var(--color-brand-light, #fff3e0);
}
.category__label {
  font-size: 0.78rem; font-weight: 600;
  color: var(--color-label); text-align: center; max-width: 72px;
}

.top5 { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.top5__item {
  display: flex; flex-direction: column; align-items: center;
  gap: 8px; cursor: pointer; transition: transform 0.2s;
}
.top5__item:hover { transform: translateY(-2px); }
.top5__avatar {
  width: 76px; height: 76px; border-radius: 50%; overflow: hidden;
  box-shadow: 0 2px 10px var(--color-card-shadow);
  border: 3px solid var(--color-card-bg);
  outline: 2px solid var(--color-input-border);
  background: var(--color-tab-inactive);
  display: flex; align-items: center; justify-content: center;
}
.top5__avatar-placeholder {
  font-size: 1.75rem; font-weight: 800; color: var(--color-brand);
}
.top5__name {
  font-size: 0.78rem; font-weight: 600;
  color: var(--color-label); text-align: center; max-width: 80px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}
</style>