<template>
  <div class="menu-page">
    <NavBarOwner />

    <main class="menu-main">

      <!-- Header -->
      <div class="menu-header">
        <div>
          <h1 class="menu-header__title">Mi Menú</h1>
          <p class="menu-header__sub">Gestiona los platos disponibles para tus comensales.</p>
        </div>
        <button class="btn-save" :disabled="saving" @click="saveMenu">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          {{ saving ? 'Guardando...' : 'Guardar y Publicar' }}
        </button>
      </div>

      <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>
      <p v-if="successMsg" class="form-success">{{ successMsg }}</p>

      <!-- Sin huarique -->
      <div v-if="!loading && !huariqueId" class="empty-state">
        <div class="empty-state__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <h2 class="empty-state__title">Primero crea tu huarique</h2>
        <p class="empty-state__sub">Necesitas registrar tu local antes de gestionar tu menú.</p>
        <button class="btn-publish" @click="$router.push('/owner-perfil')">Ir a mi perfil</button>
      </div>

      <!-- Contenido -->
      <div v-else-if="!loading" class="menu-layout">

        <!-- Lista de platos -->
        <div class="menu-left">

          <div class="menu-notice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            El menú publicado es visible para todos los comensales en el radar en tiempo real.
          </div>

          <div class="dishes-list">
            <div v-for="(dish, index) in products" :key="dish.id" class="dish-card">

              <!-- Foto del plato -->
              <div class="dish-card__img-wrap" @click="triggerPhotoUpload(index)">
                <img :src="dish.imageUrl || placeholderImg" :alt="dish.name" class="dish-card__img" />
                <div class="dish-card__img-overlay">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <span>{{ dish.uploading ? 'Subiendo...' : 'Cambiar foto' }}</span>
                </div>
                <input
                    :ref="'photoInput_' + index"
                    type="file"
                    accept="image/*"
                    class="hidden-input"
                    @change="(e) => handlePhotoChange(e, index)"
                />
              </div>

              <div class="dish-card__content">
                <div class="dish-card__header">
                  <span class="dish-card__number">Plato {{ index + 1 }}</span>
                  <div class="dish-card__actions">
                    <label class="dish-toggle" :title="dish.available ? 'Disponible' : 'No disponible'">
                      <input type="checkbox" v-model="dish.available" class="dish-toggle__check" />
                      <span class="dish-toggle__label" :class="{ 'dish-toggle__label--off': !dish.available }">
                        {{ dish.available ? 'Disponible' : 'No disponible' }}
                      </span>
                    </label>
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
                    <input v-model="dish.name" type="text" class="dish-input" placeholder="Ej: Lomo saltado" />
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
                  <textarea v-model="dish.description" class="dish-textarea" rows="2" placeholder="Describe brevemente el plato..." />
                </div>
              </div>
            </div>
          </div>

          <button class="btn-add-dish" @click="addDish">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Agregar plato
          </button>
        </div>

        <!-- Sidebar -->
        <div class="menu-right">
          <div class="card">
            <h2 class="card__title">Vista Previa</h2>
            <div class="preview-list">
              <div v-if="products.length === 0" class="preview-empty">Sin platos aún</div>
              <div v-for="dish in products" :key="dish.id" class="preview-item" :class="{ 'preview-item--unavailable': !dish.available }">
                <span class="preview-item__name">{{ dish.name || 'Sin nombre' }}</span>
                <span class="preview-item__price">S/ {{ dish.price || '—' }}</span>
              </div>
            </div>
            <p class="preview-count">{{ products.filter(p => p.available).length }} plato(s) disponibles</p>
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
import { menuService } from '@/services/menuService'
import { cloudinaryService } from '@/services/cloudinaryService'

let nextId = 1

export default {
  name: 'MenuEditView',
  components: { NavBarOwner },
  data() {
    return {
      loading: true,
      saving: false,
      huariqueId: null,
      products: [],
      categories: [],
      errorMsg: '',
      successMsg: '',
      placeholderImg: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80'
    }
  },
  async mounted() {
    await this.loadMenu()
  },
  methods: {
    async loadMenu() {
      this.loading = true
      this.errorMsg = ''
      try {
        const { exists, huariqueId, products, categories } = await menuService.getMyMenu()
        this.huariqueId = huariqueId
        this.categories = categories || []
        if (exists && products.length > 0) {
          this.products = products.map(p => ({ ...p, uploading: false }))
          nextId = products.length + 1
        }
      } catch (e) {
        this.errorMsg = e.message || 'No se pudo cargar el menú'
      } finally {
        this.loading = false
      }
    },

    addDish() {
      this.products.push({
        id: 'new_' + nextId++,
        name: '',
        description: '',
        price: '',
        available: true,
        imageUrl: '',
        uploading: false
      })
    },

    removeDish(index) {
      if (this.products.length > 1) {
        this.products.splice(index, 1)
      } else {
        this.errorMsg = 'El menú debe tener al menos un plato'
        setTimeout(() => { this.errorMsg = '' }, 3000)
      }
    },

    triggerPhotoUpload(index) {
      const ref = this.$refs['photoInput_' + index]
      if (ref && ref[0]) ref[0].click()
      else if (ref) ref.click()
    },

    async handlePhotoChange(e, index) {
      const file = e.target.files[0]
      if (!file) return

      this.products[index].uploading = true
      this.errorMsg = ''
      try {
        const url = await cloudinaryService.uploadImage(file)
        this.products[index].imageUrl = url
      } catch (err) {
        this.errorMsg = 'No se pudo subir la foto. Intenta de nuevo.'
      } finally {
        this.products[index].uploading = false
        e.target.value = ''
      }
    },

    async saveMenu() {
      if (this.products.length === 0) {
        this.errorMsg = 'Agrega al menos un plato antes de guardar'
        return
      }

      const invalid = this.products.find(p => !p.name || !p.name.trim())
      if (invalid) {
        this.errorMsg = 'Todos los platos deben tener un nombre'
        return
      }

      this.saving = true
      this.errorMsg = ''
      this.successMsg = ''
      try {
        const productsToSave = this.products.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          price: parseFloat(p.price) || 0,
          available: p.available,
          imageUrl: p.imageUrl || ''
        }))

        await menuService.saveMenu(this.huariqueId, productsToSave, this.categories)
        this.successMsg = 'Menú guardado y publicado correctamente ✓'
        setTimeout(() => { this.successMsg = '' }, 3000)
      } catch (e) {
        this.errorMsg = e.message || 'No se pudo guardar el menú'
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.menu-page { min-height: 100vh; background: var(--color-bg); }
.menu-main { max-width: 1100px; margin: 0 auto; padding: 2rem 2rem 3rem; }

.menu-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.75rem; }
.menu-header__title { font-size: 1.75rem; font-weight: 900; color: var(--color-brand); margin: 0 0 4px; }
.menu-header__sub { font-size: 0.92rem; color: var(--color-input-icon); margin: 0; }

.btn-save { display: flex; align-items: center; gap: 8px; padding: 12px 22px; background: var(--color-brand); color: #fff; border: none; border-radius: var(--radius-md); font-size: 0.88rem; font-weight: 700; font-family: var(--font-main); cursor: pointer; transition: background 0.2s; }
.btn-save:hover { background: var(--color-brand-dark); }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

.form-error { background: #fee2e2; color: #b91c1c; border: 1.5px solid #fecaca; border-radius: var(--radius-md); padding: 10px 16px; font-size: 0.85rem; font-weight: 600; margin: 0 0 1.25rem; }
.form-success { background: #dcfce7; color: #15803d; border: 1.5px solid #bbf7d0; border-radius: var(--radius-md); padding: 10px 16px; font-size: 0.85rem; font-weight: 600; margin: 0 0 1.25rem; }

.empty-state { background: var(--color-card-bg); border-radius: var(--radius-xl); box-shadow: 0 2px 12px var(--color-card-shadow); padding: 3.5rem 2rem; display: flex; flex-direction: column; align-items: center; text-align: center; }
.empty-state__icon { width: 64px; height: 64px; border-radius: 50%; background: #fde8e0; color: var(--color-brand); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; }
.empty-state__title { font-size: 1.2rem; font-weight: 800; color: var(--color-label); margin: 0 0 8px; }
.empty-state__sub { font-size: 0.9rem; color: var(--color-input-icon); margin: 0 0 1.75rem; max-width: 380px; }
.btn-publish { padding: 13px 28px; background: var(--color-brand); color: #fff; border: none; border-radius: var(--radius-md); font-size: 0.92rem; font-weight: 700; font-family: var(--font-main); cursor: pointer; transition: background 0.2s; }
.btn-publish:hover { background: var(--color-brand-dark); }

.menu-notice { display: flex; align-items: center; gap: 8px; background: #fff8f0; border: 1.5px solid #f5d9bc; border-radius: var(--radius-md); padding: 12px 16px; font-size: 0.85rem; color: var(--color-brand-dark); font-weight: 500; margin-bottom: 1.5rem; }

.menu-layout { display: grid; grid-template-columns: 1fr 280px; gap: 1.5rem; align-items: start; }

.dishes-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem; }

.dish-card { background: var(--color-card-bg); border-radius: var(--radius-xl); box-shadow: 0 2px 12px var(--color-card-shadow); display: flex; gap: 1.25rem; padding: 1.25rem; align-items: flex-start; }

.dish-card__img-wrap { flex-shrink: 0; width: 130px; height: 130px; border-radius: var(--radius-lg); overflow: hidden; position: relative; cursor: pointer; }
.dish-card__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.dish-card__img-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.45); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; opacity: 0; transition: opacity 0.2s; color: #fff; font-size: 0.75rem; font-weight: 700; }
.dish-card__img-wrap:hover .dish-card__img-overlay { opacity: 1; }
.hidden-input { display: none; }

.dish-card__content { flex: 1; }
.dish-card__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
.dish-card__number { font-size: 1rem; font-weight: 800; color: var(--color-brand); }
.dish-card__actions { display: flex; align-items: center; gap: 8px; }

.dish-toggle { display: flex; align-items: center; gap: 6px; cursor: pointer; }
.dish-toggle__check { display: none; }
.dish-toggle__label { font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: var(--radius-pill); background: #dcfce7; color: #15803d; transition: background 0.2s, color 0.2s; }
.dish-toggle__label--off { background: #f3f4f6; color: var(--color-input-icon); }

.dish-action { width: 32px; height: 32px; border-radius: var(--radius-md); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
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

.preview-list { display: flex; flex-direction: column; margin-bottom: 0.75rem; }
.preview-empty { font-size: 0.85rem; color: var(--color-input-icon); text-align: center; padding: 1rem 0; }
.preview-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--color-input-border); font-size: 0.88rem; }
.preview-item:last-child { border-bottom: none; }
.preview-item__name { font-weight: 600; color: var(--color-label); }
.preview-item--unavailable .preview-item__name { color: var(--color-input-icon); text-decoration: line-through; }
.preview-item__price { font-weight: 700; color: var(--color-brand); }
.preview-count { font-size: 0.78rem; color: var(--color-input-icon); margin: 0; text-align: right; }

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