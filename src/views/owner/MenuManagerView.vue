<template>
  <div class="menu-page">
    <NavBarOwner />

    <main class="menu-main">

      <!-- Header -->
      <div class="menu-header">
        <div>
          <h1 class="menu-header__title">Mis menús</h1>
          <p class="menu-header__sub">Gestiona los platos que ofreces a los comensales en Lima.</p>
        </div>
        <button v-if="menus.length" class="btn-new-menu" @click="goCreate">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Nuevo menú
        </button>
      </div>

      <!-- Estado vacío -->
      <div v-if="!loading && menus.length === 0" class="empty-state">
        <div class="empty-state__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <h2 class="empty-state__title">Todavía no tienes un menú publicado</h2>
        <p class="empty-state__sub">Crea tu primer menú para que los comensales puedan verlo en el radar en tiempo real.</p>
        <button class="btn-publish" @click="goCreate">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Crear mi primer menú
        </button>
      </div>

      <!-- Listado de menús -->
      <div v-else-if="!loading" class="menus-grid">
        <div v-for="menu in menus" :key="menu.id" class="menu-card">
          <div class="menu-card__header">
            <div>
              <h2 class="menu-card__title">{{ menu.name }}</h2>
              <span class="menu-card__status" :class="{ 'menu-card__status--draft': !menu.published }">
                <span class="menu-card__dot"></span>
                {{ menu.published ? 'Vigente' : 'Borrador' }}
              </span>
            </div>
            <button class="btn-edit" @click="goEdit(menu.id)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar
            </button>
          </div>

          <div class="menu-card__dishes">
            <div v-for="dish in menu.dishes.slice(0, 4)" :key="dish.id" class="dish-chip">
              <img :src="dish.image" :alt="dish.name" class="dish-chip__img" />
              <div class="dish-chip__info">
                <span class="dish-chip__name">{{ dish.name }}</span>
                <span class="dish-chip__price">S/ {{ dish.price }}</span>
              </div>
            </div>
          </div>

          <p v-if="menu.dishes.length > 4" class="menu-card__more">
            + {{ menu.dishes.length - 4 }} plato{{ menu.dishes.length - 4 === 1 ? '' : 's' }} más
          </p>

          <div class="menu-card__footer">
            <span class="menu-card__count">{{ menu.dishes.length }} plato{{ menu.dishes.length === 1 ? '' : 's' }}</span>
            <span class="menu-card__updated">Actualizado {{ menu.updatedAt }}</span>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script>
import NavBarOwner from '@/components/common/NavBarOwner.vue'

export default {
  name: 'MenuManagerView',
  components: { NavBarOwner },
  data() {
    return {
      loading: false,
      menus: [
        {
          id: 1,
          name: 'Menú del día',
          published: true,
          updatedAt: 'hoy',
          dishes: [
            { id: 1, name: 'Lomo saltado', price: 18, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80' },
            { id: 2, name: 'Ají de gallina', price: 15, image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=200&q=80' },
            { id: 3, name: 'Caldo de gallina', price: 12, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&q=80' }
          ]
        }
      ]
    }
  },
  methods: {
    goCreate() {
      this.$router.push('/mi-menu/nuevo')
    },
    goEdit(id) {
      this.$router.push(`/mi-menu/editar/${id}`)
    }
  }
}
</script>

<style scoped>
.menu-page { min-height: 100vh; background: var(--color-bg); }
.menu-main { max-width: 1100px; margin: 0 auto; padding: 2rem 2rem 3rem; }

.menu-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.75rem; }
.menu-header__title { font-size: 1.75rem; font-weight: 900; color: var(--color-brand); margin: 0 0 4px; }
.menu-header__sub   { font-size: 0.92rem; color: var(--color-input-icon); margin: 0; }

.btn-new-menu { display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: var(--color-brand); color: #fff; border: none; border-radius: var(--radius-md); font-size: 0.88rem; font-weight: 700; font-family: var(--font-main); cursor: pointer; transition: background 0.2s; white-space: nowrap; }
.btn-new-menu:hover { background: var(--color-brand-dark); }

/* Empty state */
.empty-state { background: var(--color-card-bg); border-radius: var(--radius-xl); box-shadow: 0 2px 12px var(--color-card-shadow); padding: 3.5rem 2rem; display: flex; flex-direction: column; align-items: center; text-align: center; }
.empty-state__icon { width: 64px; height: 64px; border-radius: 50%; background: #fde8e0; color: var(--color-brand); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; }
.empty-state__title { font-size: 1.2rem; font-weight: 800; color: var(--color-label); margin: 0 0 8px; }
.empty-state__sub { font-size: 0.9rem; color: var(--color-input-icon); margin: 0 0 1.75rem; max-width: 380px; }

.btn-publish { padding: 13px 28px; background: var(--color-brand); color: #fff; border: none; border-radius: var(--radius-md); font-size: 0.92rem; font-weight: 700; font-family: var(--font-main); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s; }
.btn-publish:hover { background: var(--color-brand-dark); }

/* Menus grid */
.menus-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem; }

.menu-card { background: var(--color-card-bg); border-radius: var(--radius-xl); box-shadow: 0 2px 12px var(--color-card-shadow); padding: 1.5rem; display: flex; flex-direction: column; }

.menu-card__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; margin-bottom: 1.1rem; }
.menu-card__title { font-size: 1.05rem; font-weight: 800; color: var(--color-label); margin: 0 0 6px; }
.menu-card__status { display: inline-flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; color: #15803d; }
.menu-card__status--draft { color: var(--color-input-icon); }
.menu-card__dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; }
.menu-card__status--draft .menu-card__dot { background: var(--color-input-icon); }

.btn-edit { flex-shrink: 0; display: flex; align-items: center; gap: 6px; padding: 9px 14px; background: #fde8e0; color: var(--color-brand); border: none; border-radius: var(--radius-md); font-size: 0.82rem; font-weight: 700; font-family: var(--font-main); cursor: pointer; transition: background 0.2s; }
.btn-edit:hover { background: #f5c9b0; }

.menu-card__dishes { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 0.5rem; }
.dish-chip { display: flex; align-items: center; gap: 0.75rem; }
.dish-chip__img { width: 44px; height: 44px; border-radius: var(--radius-md); object-fit: cover; flex-shrink: 0; }
.dish-chip__info { display: flex; flex-direction: column; min-width: 0; }
.dish-chip__name { font-size: 0.85rem; font-weight: 600; color: var(--color-label); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dish-chip__price { font-size: 0.78rem; font-weight: 700; color: var(--color-brand); }

.menu-card__more { font-size: 0.78rem; color: var(--color-input-icon); margin: 0.25rem 0 0; }

.menu-card__footer { display: flex; align-items: center; justify-content: space-between; margin-top: 1.1rem; padding-top: 0.9rem; border-top: 1px solid var(--color-input-border); }
.menu-card__count { font-size: 0.78rem; font-weight: 700; color: var(--color-label); }
.menu-card__updated { font-size: 0.75rem; color: var(--color-input-icon); }

@media (max-width: 768px) {
  .menu-header { flex-direction: column; align-items: stretch; }
  .btn-new-menu { justify-content: center; }
  .menus-grid { grid-template-columns: 1fr; }
}
</style>