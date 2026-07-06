<template>
  <div class="profile-page">
    <NavBarOwner />

    <main class="profile-main">

      <!-- Header -->
      <!-- Header -->
      <div class="profile-header">
        <div>
          <h1 class="profile-header__title">Gestión del Huarique</h1>
          <p class="profile-header__sub">Administra la identidad visual y los datos de contacto de tu local.</p>
        </div>
        <div class="profile-header__actions">
          <label class="open-toggle">
            <input type="checkbox" v-model="isOpen" class="open-toggle__check" />
            <span :class="{ 'open-toggle__label--closed': !isOpen }">{{ isOpen ? 'Local Abierto' : 'Local Cerrado' }}</span>
          </label>
          <button class="btn-save" :disabled="saving" @click="saveProfile">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            {{ saving ? 'Guardando...' : (isNewRestaurant ? 'Crear mi Huarique' : 'Guardar Cambios') }}
          </button>
        </div>
      </div>

      <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>
      <p v-if="successMsg" class="form-success">{{ successMsg }}</p>

      <div class="profile-layout">

        <!-- Columna izquierda -->
        <div class="profile-left">

          <!-- Información Básica -->
          <section class="card">
            <h2 class="card__title">
              <span class="card__title-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <path d="M8 21h8M12 17v4"/>
                </svg>
              </span>
              Información Básica
            </h2>

            <div class="form-row">
              <div class="form-group">
                <label class="form-group__label">Nombre del Restaurante</label>
                <input v-model="form.name" type="text" class="form-input" placeholder="El Pez de Oro" />
              </div>
              <div class="form-group">
                <label class="form-group__label">Tipo de Cocina</label>
                <input v-model="form.cuisine" type="text" class="form-input" placeholder="Cevicheria & Marina" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-group__label">Dirección Completa</label>
              <div class="input-icon-wrapper">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <input v-model="form.address" type="text" class="form-input form-input--icon" placeholder="Av. Petit Thouars 1234, Lince, Lima" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-group__label">Teléfono de Reservas</label>
                <input v-model="form.phone" type="text" class="form-input" placeholder="+51 987 654 321" />
              </div>
              <div class="form-group">
                <label class="form-group__label">Rango de Precios (S/.)</label>
                <input v-model="form.priceRange" type="text" class="form-input" placeholder="S/ 30 - 65" />
              </div>
            </div>
          </section>

          <!-- Horario de Atención -->
          <section class="card">
            <div class="card__title-row">
              <h2 class="card__title">
                <span class="card__title-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </span>
                Horario de Atención
              </h2>
              <button class="card__hint card__hint--action" @click="copyToAllDays">Copiar lunes a todos</button>
            </div>

            <div class="schedule-list">
              <div v-for="day in schedule" :key="day.key" class="schedule-row">
                <label class="schedule-row__day">
                  <input type="checkbox" v-model="day.open" class="schedule-row__check" />
                  {{ day.label }}
                </label>

                <template v-if="day.open">
                  <input v-model="day.from" type="time" class="schedule-row__time" />
                  <span class="schedule-row__sep">a</span>
                  <input v-model="day.to" type="time" class="schedule-row__time" />
                </template>
                <span v-else class="schedule-row__closed">Cerrado</span>
              </div>
            </div>
          </section>

          <!-- Galería de Fotos -->
          <section class="card">
            <div class="card__title-row">
              <h2 class="card__title">
                <span class="card__title-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </span>
                Galería de Fotos
              </h2>
              <span class="card__hint">Mín. 3 fotos recomendadas</span>
            </div>

            <!-- Drop zone -->
            <div class="dropzone" @click="triggerUpload" @dragover.prevent @drop.prevent="handleDrop">
              <div class="dropzone__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
              </div>
              <p class="dropzone__text">Suelta tus fotos aquí o haz clic para subir</p>
              <p class="dropzone__hint">PNG, JPG hasta 10MB cada una</p>
              <input ref="fileInput" type="file" accept="image/*" multiple class="dropzone__input" @change="handleFiles" />
            </div>

            <!-- Thumbnails -->
            <div class="gallery-grid">
              <div
                  v-for="(photo, i) in photos"
                  :key="i"
                  class="gallery-item"
                  :class="{ 'gallery-item--cover': i === 0 }"
              >
                <img :src="photo" :alt="`Foto ${i+1}`" class="gallery-item__img" />
                <span v-if="i === 0" class="gallery-item__badge">Portada</span>
                <button class="gallery-item__remove" @click="removePhoto(i)">×</button>
              </div>

              <!-- Botón agregar -->
              <div class="gallery-item gallery-item--add" @click="triggerUpload">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
            </div>
          </section>

        </div>

        <!-- Columna derecha -->
        <div class="profile-right">

          <!-- Preview -->
          <section class="card card--preview">
            <h2 class="card__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              Previsualización en Radar
            </h2>

            <div class="preview-card">
              <div class="preview-card__img-wrap">
                <img :src="photos[0] || placeholderImg" alt="Preview" class="preview-card__img" />
                <span class="preview-card__status" :class="{ 'preview-card__status--closed': !isOpen }">
                  ● {{ isOpen ? 'Abierto' : 'Cerrado' }}
                </span>
              </div>
              <div class="preview-card__body">
                <div class="preview-card__top">
                  <div>
                    <p class="preview-card__name">{{ form.name || 'Nombre del local' }}</p>
                    <p class="preview-card__cuisine">{{ form.cuisine || 'Tipo de cocina' }}</p>
                  </div>
                </div>
                <p class="preview-card__meta">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ form.address || 'Dirección sin definir' }}
                </p>
                <p class="preview-card__meta">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                  {{ form.priceRange || 'S/ —' }}
                </p>
              </div>
            </div>
          </section>

          <!-- Mapa -->
          <section class="card card--map">
            <h2 class="card__title">Ubicación (Coordenadas)</h2>
            <div class="map-placeholder">
              <div class="map-placeholder__pin">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="var(--color-brand)"/>
                </svg>
              </div>
            </div>
            <div style="padding: 1rem; display: flex; gap: 1rem; border-top: 1.5px solid var(--color-input-border);">
              <div class="form-group" style="flex: 1; margin: 0;">
                <label class="form-group__label">Latitud</label>
                <input v-model.number="form.latitude" type="number" step="any" class="form-input" />
              </div>
              <div class="form-group" style="flex: 1; margin: 0;">
                <label class="form-group__label">Longitud</label>
                <input v-model.number="form.longitude" type="number" step="any" class="form-input" />
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer__inner">
        <span class="footer__copy">© 2026 Foodly Lima. Hecho con sabor peruano.</span>
      </div>
    </footer>
  </div>
</template>

<script>
import NavBarOwner from '@/components/common/NavBarOwner.vue'
import { restaurantService } from '@/services/restaurantService'

const DEFAULT_SCHEDULE = [
  { key: 'mon', label: 'Lunes',     open: true,  from: '12:00', to: '21:00' },
  { key: 'tue', label: 'Martes',    open: true,  from: '12:00', to: '21:00' },
  { key: 'wed', label: 'Miércoles', open: true,  from: '12:00', to: '21:00' },
  { key: 'thu', label: 'Jueves',    open: true,  from: '12:00', to: '21:00' },
  { key: 'fri', label: 'Viernes',   open: true,  from: '12:00', to: '22:00' },
  { key: 'sat', label: 'Sábado',    open: true,  from: '12:00', to: '22:00' },
  { key: 'sun', label: 'Domingo',   open: false, from: '12:00', to: '17:00' }
]

const DAY_LABELS = {
  mon: 'Lunes', tue: 'Martes', wed: 'Miércoles', thu: 'Jueves',
  fri: 'Viernes', sat: 'Sábado', sun: 'Domingo'
}

export default {
  name: 'OwnerProfileView',
  components: { NavBarOwner },
  data() {
    return {
      loading: true,
      saving: false,
      isNewRestaurant: true,
      errorMsg: '',
      successMsg: '',
      form: {
        name: '',
        cuisine: '',
        address: '',
        phone: '',
        priceRange: '',
        // Coordenadas por defecto (Cerca a San Juan de Miraflores / Surco)
        latitude: -12.174255247214946,
        longitude: -76.9949405256348
      },
      isOpen: true,
      photos: [],
      placeholderImg: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=80',
      schedule: DEFAULT_SCHEDULE.map(d => ({ ...d }))
    }
  },
  async mounted() {
    await this.loadProfile()
  },
  methods: {
    async loadProfile() {
      this.loading = true
      this.errorMsg = ''
      try {
        const { exists, data } = await restaurantService.getMyRestaurant()
        this.isNewRestaurant = !exists
        if (exists && data) {
          this.form.name = data.name || ''
          this.form.cuisine = data.cuisineType || ''
          this.form.address = data.address || ''
          this.form.phone = data.phone || ''
          this.form.priceRange = data.priceRange || ''
          this.isOpen = data.isOpen !== undefined && data.isOpen !== null ? data.isOpen : true
          this.photos = data.photos && data.photos.length ? [...data.photos] : []

          if (data.schedule && data.schedule.length) {
            this.schedule = data.schedule.map(d => ({
              key: d.day,
              label: DAY_LABELS[d.day] || d.day,
              open: !!d.open,
              from: d.from || '12:00',
              to: d.to || '21:00'
            }))
          }
        }
      } catch (e) {
        this.errorMsg = e.message || 'No se pudo cargar la información de tu local'
      } finally {
        this.loading = false
      }
    },

    buildCreatePayload() {
      return {
        name: this.form.name,
        address: this.form.address,
        cuisineType: this.form.cuisine,
        phone: this.form.phone,
        priceRange: this.form.priceRange,
        // ¡Se envían a Java!
        latitude: this.form.latitude,
        longitude: this.form.longitude
      }
    },

    buildPayload() {
      return {
        name: this.form.name,
        address: this.form.address,
        cuisineType: this.form.cuisine,
        phone: this.form.phone,
        priceRange: this.form.priceRange,
        // ¡Se envían a Java!
        latitude: this.form.latitude,
        longitude: this.form.longitude,
        isOpen: this.isOpen,
        photos: this.photos,
        schedule: this.schedule.map(d => ({
          day: d.key,
          open: d.open,
          from: d.from,
          to: d.to
        }))
      }
    },

    async saveProfile() {
      if (!this.form.name || !this.form.name.trim()) {
        this.errorMsg = 'El nombre del restaurante es obligatorio'
        return
      }

      this.saving = true
      this.errorMsg = ''
      this.successMsg = ''
      try {
        if (this.isNewRestaurant) {
          // 1. Crear el local
          const createRes = await restaurantService.createRestaurant(this.buildCreatePayload())
          if (createRes && createRes.ok === false) {
            throw new Error(`Fallo al crear (Código: ${createRes.status || 'desconocido'})`)
          }

          // 2. Actualizar horarios y fotos
          const updateRes = await restaurantService.updateMyRestaurant(this.buildPayload())
          if (updateRes && updateRes.ok === false) { // ¡Corregido aquí!
            throw new Error(`Fallo al actualizar (Código: ${updateRes.status || 'desconocido'})`)
          }

          this.isNewRestaurant = false
        } else {
          // Si ya existe, solo actualiza
          const updateRes = await restaurantService.updateMyRestaurant(this.buildPayload())
          if (updateRes && updateRes.ok === false) { // ¡Corregido aquí!
            throw new Error(`Fallo al actualizar (Código: ${updateRes.status || 'desconocido'})`)
          }
        }

        this.successMsg = 'Cambios guardados correctamente ✓'
        setTimeout(() => { this.successMsg = '' }, 3000)
      } catch (e) {
        this.errorMsg = e.message || 'No se pudo guardar la información'
      } finally {
        this.saving = false
      }
    },

    triggerUpload() {
      this.$refs.fileInput.click()
    },
    handleFiles(e) {
      const files = Array.from(e.target.files)
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (ev) => this.photos.push(ev.target.result)
        reader.readAsDataURL(file)
      })
    },
    handleDrop(e) {
      const files = Array.from(e.dataTransfer.files)
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (ev) => this.photos.push(ev.target.result)
        reader.readAsDataURL(file)
      })
    },
    removePhoto(index) {
      this.photos.splice(index, 1)
    },
    copyToAllDays() {
      const monday = this.schedule.find(d => d.key === 'mon')
      this.schedule.forEach(d => {
        if (d.key !== 'mon') {
          d.open = monday.open
          d.from = monday.from
          d.to = monday.to
        }
      })
    }
  }
}
</script>

<style scoped>
.profile-page { min-height: 100vh; background: var(--color-bg); display: flex; flex-direction: column; }

.profile-main {
  flex: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 2rem 3rem;
  width: 100%;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.profile-header__title { font-size: 1.75rem; font-weight: 900; color: var(--color-brand); margin: 0 0 4px; }
.profile-header__sub   { font-size: 0.92rem; color: var(--color-input-icon); margin: 0; }

.profile-header__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.open-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #15803d;
  cursor: pointer;
}

.open-toggle__check {
  width: 18px;
  height: 18px;
  accent-color: var(--color-brand);
  cursor: pointer;
}

.open-toggle__label--closed {
  color: var(--color-input-icon);
}

.preview-card__status--closed {
  color: #f87171;
}

.form-error {
  background: #fee2e2;
  color: #b91c1c;
  border: 1.5px solid #fecaca;
  border-radius: var(--radius-md);
  padding: 10px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 1.25rem;
}

.form-success {
  background: #dcfce7;
  color: #15803d;
  border: 1.5px solid #bbf7d0;
  border-radius: var(--radius-md);
  padding: 10px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 1.25rem;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-save {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  background: var(--color-brand);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  font-weight: 700;
  font-family: var(--font-main);
  cursor: pointer;
  transition: background 0.2s;
}
.btn-save:hover { background: var(--color-brand-dark); }

.profile-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.5rem;
  align-items: start;
}

.card {
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  padding: 1.75rem;
  box-shadow: 0 2px 12px var(--color-card-shadow);
  margin-bottom: 1.25rem;
}

.card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--color-label);
  margin: 0 0 1.25rem;
}

.card__title-icon {
  width: 32px;
  height: 32px;
  background: #fde8e0;
  color: var(--color-brand);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 1rem; }
.form-row .form-group { margin-bottom: 0; }
.form-group__label { font-size: 0.82rem; font-weight: 600; color: var(--color-label); }

.form-input {
  height: 44px;
  padding: 0 14px;
  background: var(--color-input-bg);
  border: 1.5px solid var(--color-input-border);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  color: var(--color-input-text);
  outline: none;
  transition: border-color 0.2s;
  font-family: var(--font-main);
}
.form-input:focus { border-color: var(--color-brand); }
.form-input::placeholder { color: var(--color-placeholder); }

.input-icon-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-input-bg);
  border: 1.5px solid var(--color-input-border);
  border-radius: var(--radius-md);
  padding: 0 14px;
  color: var(--color-input-icon);
  transition: border-color 0.2s;
}
.input-icon-wrapper:focus-within { border-color: var(--color-brand); }

.form-input--icon {
  border: none;
  padding: 0;
  background: transparent;
  flex: 1;
}
.form-input--icon:focus { border: none; }

/* Dropzone */
.dropzone {
  border: 2px dashed var(--color-input-border);
  border-radius: var(--radius-lg);
  background: #fdf7f3;
  padding: 2rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  margin-bottom: 1.25rem;
  position: relative;
}
.dropzone:hover { border-color: var(--color-brand-light); background: #fef0e8; }

.dropzone__icon {
  width: 56px;
  height: 56px;
  background: #fde8e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  color: var(--color-brand);
}

.dropzone__text { font-size: 0.9rem; font-weight: 600; color: var(--color-label); margin: 0 0 4px; }
.dropzone__hint { font-size: 0.78rem; color: var(--color-input-icon); margin: 0; }
.dropzone__input { display: none; }

/* Gallery */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.gallery-item {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  aspect-ratio: 1;
  background: var(--color-input-bg);
}

.gallery-item__img { width: 100%; height: 100%; object-fit: cover; display: block; }

.gallery-item__badge {
  position: absolute;
  bottom: 6px;
  left: 6px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
}

.gallery-item__remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
}
.gallery-item:hover .gallery-item__remove { display: flex; }

.gallery-item--add {
  border: 2px dashed var(--color-input-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-input-icon);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.gallery-item--add:hover { border-color: var(--color-brand); color: var(--color-brand); }

/* Card title row (título + acción a la derecha) */
.card__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.card__title-row .card__title { margin-bottom: 0; }

.card__hint { font-size: 0.78rem; color: var(--color-input-icon); }
.card__hint--action {
  background: none;
  border: none;
  color: var(--color-brand);
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: var(--font-main);
  transition: color 0.2s;
}
.card__hint--action:hover { color: var(--color-brand-dark); text-decoration: underline; }

/* Schedule */
.schedule-list { display: flex; flex-direction: column; gap: 0.6rem; }

.schedule-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--color-input-bg);
  border: 1.5px solid var(--color-input-border);
  border-radius: var(--radius-md);
  gap: 0.75rem;
}

.schedule-row__day {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-label);
  width: 110px;
  flex-shrink: 0;
  cursor: pointer;
}

.schedule-row__check { accent-color: var(--color-brand); width: 16px; height: 16px; cursor: pointer; }

.schedule-row__time {
  height: 36px;
  padding: 0 10px;
  background: var(--color-card-bg);
  border: 1.5px solid var(--color-input-border);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  color: var(--color-input-text);
  font-family: var(--font-main);
  outline: none;
  transition: border-color 0.2s;
}
.schedule-row__time:focus { border-color: var(--color-brand); }

.schedule-row__sep { font-size: 0.8rem; color: var(--color-input-icon); }

.schedule-row__closed {
  margin-left: auto;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-input-icon);
}

/* Preview card */
.preview-card {
  border: 1.5px solid var(--color-input-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.preview-card__img-wrap { position: relative; }
.preview-card__img { width: 100%; height: 150px; object-fit: cover; display: block; }
.preview-card__status {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.55);
  color: #4ade80;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
}

.preview-card__body { padding: 1rem; }

.preview-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.preview-card__name { font-size: 1rem; font-weight: 800; color: var(--color-label); margin: 0 0 2px; }
.preview-card__cuisine { font-size: 0.8rem; color: var(--color-input-icon); margin: 0; }
.preview-card__rating { font-size: 0.85rem; font-weight: 700; color: var(--color-brand); white-space: nowrap; }

.preview-card__meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  color: var(--color-input-icon);
  margin: 0 0 8px;
}

.preview-card__tags { display: flex; gap: 6px; flex-wrap: wrap; }

.tag {
  background: var(--color-tab-inactive);
  color: var(--color-label);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
}

/* Map */
.card--map { padding-bottom: 0; overflow: hidden; }

.map-placeholder {
  height: 130px;
  background: linear-gradient(135deg, #c8d8c8, #a8b8a8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 -1.75rem;
}

.map-placeholder__pin {
  width: 44px;
  height: 44px;
  background: var(--color-brand);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-placeholder__pin svg { transform: rotate(45deg); }

.btn-location {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 14px 1.75rem;
  background: none;
  border: none;
  border-top: 1.5px solid var(--color-input-border);
  color: var(--color-brand);
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  margin: 0 -1.75rem;
  width: calc(100% + 3.5rem);
  transition: background 0.2s;
}
.btn-location:hover { background: #fef0e8; }

/* Footer */
.footer {
  background: var(--color-brand-dark);
  padding: 1.25rem 2rem;
  margin-top: auto;
}

.footer__inner {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}

.footer__copy { font-size: 0.78rem; color: rgba(255,255,255,0.7); }

/* Responsive */
@media (max-width: 768px) {
  .profile-layout { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
  .gallery-grid { grid-template-columns: repeat(3, 1fr); }
  .schedule-row { flex-wrap: wrap; }
  .schedule-row__closed { margin-left: 0; }
}
</style>