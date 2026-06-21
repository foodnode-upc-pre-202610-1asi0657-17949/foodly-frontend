<template>
  <div class="menu-page">
    <NavBarOwner />

    <main class="menu-main">

      <!-- Header -->
      <div class="menu-header">
        <button class="btn-back" @click="$router.push('/mi-menu')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Mis menús
        </button>
        <div>
          <h1 class="menu-header__title">Actualiza los platos disponibles para hoy</h1>
          <p class="menu-header__sub">Mantén tu menú al día para atraer a más comensales en Lima.</p>
        </div>
      </div>

      <!-- Aviso -->
      <div class="menu-notice">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        El menú publicado es visible para todos los comensales en el radar en tiempo real.
      </div>

      <div class="menu-layout">

        <!-- Lista de platos -->
        <div class="menu-left">
          <div class="dishes-list">
            <div v-for="(dish, index) in dishes" :key="dish.id" class="dish-card">
              <div class="dish-card__img-wrap">
                <img :src="dish.image" :alt="dish.name" class="dish-card__img" />
              </div>
              <div class="dish-card__content">
                <div class="dish-card__header">
                  <span class="dish-card__number">Plato {{ index + 1 }}</span>
                  <div class="dish-card__actions">
                    <button class="dish-action dish-action--edit" @click="editPhoto(index)" title="Cambiar foto">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="dish-action dish-action--delete" @click="removeDish(index)" title="Eliminar plato">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="dish-card__fields">
                  <div class="dish-field dish-field--name">
                    <label class="dish-field__label">Nombre del plato</label>
                    <input v-model="dish.name" type="text" class="dish-input" :placeholder="`Plato ${index + 1}`" />
                  </div>
                  <div class="dish-field dish-field--price">
                    <label class="dish-field__label">Precio (S/.)</label>
                    <div class="price-input-wrap">
                      <span class="price-prefix">S/</span>
                      <input v-model="dish.price" type="number" class="dish-input price-input" placeholder="0" />
                    </div>
                  </div>
                </div>
                <div class="dish-field">
                  <label class="dish-field__label">Descripción corta</label>
                  <textarea v-model="dish.description" class="dish-textarea" rows="3" placeholder="Describe brevemente el plato..." />
                </div>
              </div>
            </div>
          </div>

          <button class="btn-add-dish" @click="addDish">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            + Agregar plato
          </button>
        </div>

        <!-- Sidebar derecho -->
        <div class="menu-right">
          <div class="card card--preview">
            <h2 class="card__title">Vista Previa Rápida</h2>
            <div class="preview-list">
              <div v-for="dish in dishes" :key="dish.id" class="preview-item" :class="{ 'preview-item--muted': !dish.name }">
                <span class="preview-item__name">{{ dish.name || 'Sin nombre' }}</span>
                <span class="preview-item__price" :class="{ 'preview-item__price--muted': !dish.price }">
                  S/ {{ dish.price || '—' }}
                </span>
              </div>
            </div>
            <button class="btn-publish" @click="saveMenu">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Guardar y Publicar
            </button>
            <button class="btn-discard" @click="discardChanges">Descartar cambios</button>
          </div>

          <div class="inspiration-banner">
            <img src="https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&q=80" alt="Inspiración" class="inspiration-banner__img" />
            <div class="inspiration-banner__overlay">
              <p class="inspiration-banner__title">Inspiración del día</p>
              <p class="inspiration-banner__sub">Un plato bien fotografiado atrae 3x más clientes.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import NavBarOwner from '@/components/common/NavBarOwner.vue'

let nextId = 4

export default {
  name: 'MenuEditView',
  components: { NavBarOwner },
  data() {
    return {
      dishes: [
        { id: 1, name: 'Lomo saltado', price: 18, description: 'Trozos de lomo fino salteados con cebolla roja, tomate, ají amarillo y un toque de cilantro, servido con papas fritas y arroz blanco.', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80' },
        { id: 2, name: 'Ají de gallina', price: 15, description: 'Clásico guiso cremoso de gallina deshilachada con ají amarillo, servido con arroz, papa y aceituna.', image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=300&q=80' },
        { id: 3, name: 'Caldo de gallina', price: 12, description: 'Sustancioso caldo de gallina con fideos gruesos, huevo duro, papa amarilla y cebollita china.', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&q=80' }
      ]
    }
  },
  methods: {
    addDish() {
      this.dishes.push({ id: nextId++, name: '', price: '', description: '', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80' })
    },
    removeDish(index) {
      if (this.dishes.length > 1) this.dishes.splice(index, 1)
    },
    editPhoto(index) { alert('Próximamente: subir foto del plato') },
    saveMenu() {
      alert('Menú guardado y publicado ✓')
      this.$router.push('/mi-menu')
    },
    discardChanges() { if (confirm('¿Descartar todos los cambios?')) this.$router.push('/mi-menu') }
  }
}
</script>

<style scoped>
.menu-page { min-height: 100vh; background: var(--color-bg); }
.menu-main { max-width: 1100px; margin: 0 auto; padding: 2rem 2rem 3rem; }
.menu-header { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start; }
.btn-back { display: inline-flex; align-items: center; gap: 6px; background: transparent; border: none; padding: 0; color: var(--color-input-icon); font-size: 0.85rem; font-weight: 700; font-family: var(--font-main); cursor: pointer; transition: color 0.2s; }
.btn-back:hover { color: var(--color-brand); }
.menu-header__title { font-size: 1.75rem; font-weight: 900; color: var(--color-brand); margin: 0 0 4px; }
.menu-header__sub   { font-size: 0.92rem; color: var(--color-input-icon); margin: 0; }
.menu-notice { display: flex; align-items: center; gap: 8px; background: #fff8f0; border: 1.5px solid #f5d9bc; border-radius: var(--radius-md); padding: 12px 16px; font-size: 0.85rem; color: var(--color-brand-dark); font-weight: 500; margin-bottom: 1.5rem; }
.menu-layout { display: grid; grid-template-columns: 1fr 280px; gap: 1.5rem; align-items: start; }
.dishes-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem; }
.dish-card { background: var(--color-card-bg); border-radius: var(--radius-xl); box-shadow: 0 2px 12px var(--color-card-shadow); display: flex; gap: 1.25rem; padding: 1.25rem; align-items: flex-start; }
.dish-card__img-wrap { flex-shrink: 0; width: 130px; height: 130px; border-radius: var(--radius-lg); overflow: hidden; }
.dish-card__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.dish-card__content { flex: 1; }
.dish-card__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
.dish-card__number { font-size: 1rem; font-weight: 800; color: var(--color-brand); }
.dish-card__actions { display: flex; gap: 6px; }
.dish-action { width: 32px; height: 32px; border-radius: var(--radius-md); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
.dish-action--edit  { background: #fde8e0; color: var(--color-brand); }
.dish-action--edit:hover  { background: #f5c9b0; }
.dish-action--delete { background: #fee2e2; color: #ef4444; }
.dish-action--delete:hover { background: #fecaca; }
.dish-card__fields { display: grid; grid-template-columns: 1fr 110px; gap: 0.75rem; margin-bottom: 0.75rem; }
.dish-field { display: flex; flex-direction: column; gap: 4px; }
.dish-field__label { font-size: 0.78rem; font-weight: 600; color: var(--color-label); }
.dish-input { height: 40px; padding: 0 12px; background: var(--color-input-bg); border: 1.5px solid var(--color-input-border); border-radius: var(--radius-md); font-size: 0.88rem; color: var(--color-input-text); font-family: var(--font-main); outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
.dish-input:focus { border-color: var(--color-brand); }
.dish-input::placeholder { color: var(--color-placeholder); }
.price-input-wrap { display: flex; align-items: center; background: var(--color-input-bg); border: 1.5px solid var(--color-input-border); border-radius: var(--radius-md); height: 40px; padding: 0 12px; gap: 6px; transition: border-color 0.2s; }
.price-input-wrap:focus-within { border-color: var(--color-brand); }
.price-prefix { font-size: 0.85rem; font-weight: 700; color: var(--color-input-icon); }
.price-input { border: none; background: transparent; height: 100%; outline: none; font-size: 0.88rem; color: var(--color-input-text); font-family: var(--font-main); width: 60px; padding: 0; }
.dish-textarea { padding: 10px 12px; background: var(--color-input-bg); border: 1.5px solid var(--color-input-border); border-radius: var(--radius-md); font-size: 0.85rem; color: var(--color-input-text); font-family: var(--font-main); outline: none; resize: vertical; transition: border-color 0.2s; width: 100%; box-sizing: border-box; line-height: 1.5; }
.dish-textarea:focus { border-color: var(--color-brand); }
.dish-textarea::placeholder { color: var(--color-placeholder); }
.btn-add-dish { width: 100%; padding: 16px; background: transparent; border: 2px dashed var(--color-brand-light); border-radius: var(--radius-xl); color: var(--color-brand); font-size: 0.95rem; font-weight: 700; font-family: var(--font-main); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s, border-color 0.2s; }
.btn-add-dish:hover { background: #fef0e8; border-color: var(--color-brand); }
.card { background: var(--color-card-bg); border-radius: var(--radius-xl); padding: 1.5rem; box-shadow: 0 2px 12px var(--color-card-shadow); margin-bottom: 1rem; }
.card__title { font-size: 1rem; font-weight: 800; color: var(--color-label); margin: 0 0 1rem; }
.preview-list { display: flex; flex-direction: column; margin-bottom: 1.25rem; }
.preview-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--color-input-border); font-size: 0.88rem; }
.preview-item:last-child { border-bottom: none; }
.preview-item__name { font-weight: 600; color: var(--color-label); }
.preview-item--muted .preview-item__name { color: var(--color-input-icon); }
.preview-item__price { font-weight: 700; color: var(--color-brand); }
.preview-item__price--muted { color: var(--color-input-icon); font-weight: 400; }
.btn-publish { width: 100%; padding: 13px; background: var(--color-brand); color: #fff; border: none; border-radius: var(--radius-md); font-size: 0.92rem; font-weight: 700; font-family: var(--font-main); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s; margin-bottom: 0.6rem; }
.btn-publish:hover { background: var(--color-brand-dark); }
.btn-discard { width: 100%; padding: 12px; background: transparent; border: 1.5px solid var(--color-input-border); border-radius: var(--radius-md); font-size: 0.88rem; font-weight: 600; color: var(--color-brand); font-family: var(--font-main); cursor: pointer; transition: background 0.2s; }
.btn-discard:hover { background: #fef0e8; }
.inspiration-banner { border-radius: var(--radius-xl); overflow: hidden; position: relative; height: 180px; }
.inspiration-banner__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.inspiration-banner__overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.75) 60%, transparent); padding: 1rem; display: flex; flex-direction: column; justify-content: flex-end; }
.inspiration-banner__title { font-size: 0.95rem; font-weight: 800; color: #fff; margin: 0 0 4px; }
.inspiration-banner__sub { font-size: 0.75rem; color: rgba(255,255,255,0.8); margin: 0; }
@media (max-width: 768px) {
  .menu-layout { grid-template-columns: 1fr; }
  .dish-card { flex-direction: column; }
  .dish-card__img-wrap { width: 100%; height: 180px; }
  .dish-card__fields { grid-template-columns: 1fr; }
}
</style>