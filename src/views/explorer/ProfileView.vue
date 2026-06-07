<template>
  <div class="page">
    <NavBar />

    <div class="promo-banner">
      <span>🍽️ Tu bienestar empieza con lo que eliges hoy</span>
    </div>

    <main class="content">

      <!-- Layout principal: izquierda sidebar, derecha contenido -->
      <div class="layout">

        <!-- ===== SIDEBAR izquierda ===== -->
        <aside class="sidebar">

          <!-- Card perfil -->
          <div class="profile-card" v-if="!loading">
            <div class="profile-card__avatar">
              <span>{{ initials }}</span>
              <div class="profile-card__avatar-btn">+</div>
            </div>
            <div class="profile-card__info">
              <h2 class="profile-card__name">{{ displayName }}</h2>
              <p class="profile-card__bio">Amante de los huariques</p>
              <div class="profile-card__badges">
                <span class="badge badge--level">📍 Guía Local Nivel 4</span>
                <span class="badge badge--pro">⭐ Foodie Pro</span>
              </div>
            </div>
          </div>
          <div class="profile-card" v-else>
            <div class="profile-card__skeleton"></div>
          </div>

          <!-- Stats -->
          <div class="stats-row">
            <div class="stat-box">
              <span class="stat-box__num">{{ favCount }}</span>
              <span class="stat-box__label">Favoritos</span>
            </div>
            <div class="stat-box">
              <span class="stat-box__num">—</span>
              <span class="stat-box__label">Reseñas</span>
            </div>
          </div>

          <!-- Preferencias -->
          <div class="prefs-card">
            <h3 class="prefs-card__title">Preferencias Gastronómicas</h3>
            <div class="prefs-card__tags">
              <span v-for="pref in prefs" :key="pref.id"
                    class="pref-tag"
                    :class="{ 'pref-tag--active': pref.active }"
                    @click="pref.active = !pref.active"
              >{{ pref.label }}</span>
            </div>
          </div>

          <!-- Actividad reciente -->
          <div class="activity-card">
            <h3 class="activity-card__title">Mi Actividad Reciente</h3>
            <div class="activity-empty" v-if="recentActivity.length === 0">
              <p>Aún no tienes actividad reciente.</p>
            </div>
            <div v-for="item in recentActivity" :key="item.id" class="activity-item">
              <div class="activity-item__img">{{ item.name.charAt(0) }}</div>
              <div class="activity-item__info">
                <span class="activity-item__name">{{ item.name }}</span>
                <div class="activity-item__stars">
                  <span v-for="s in item.rating" :key="s">⭐</span>
                </div>
                <p class="activity-item__comment">"{{ item.comment }}"</p>
                <span class="activity-item__when">{{ item.when }}</span>
              </div>
            </div>
          </div>

        </aside>

        <!-- ===== PANEL derecha: Configuración ===== -->
        <div class="config-panel">

          <div class="config-card">
            <h3 class="config-card__title">Configuración</h3>

            <button class="config-item" @click="activeSection = 'cuenta'">
              <span class="config-item__icon">👤</span>
              <span class="config-item__label">Cuenta</span>
              <span class="config-item__arrow">›</span>
            </button>

            <button class="config-item" @click="activeSection = 'privacidad'">
              <span class="config-item__icon">🔒</span>
              <span class="config-item__label">Privacidad y Seguridad</span>
              <span class="config-item__arrow">›</span>
            </button>

            <button class="config-item" @click="activeSection = 'ayuda'">
              <span class="config-item__icon">❓</span>
              <span class="config-item__label">Centro de Ayuda</span>
              <span class="config-item__arrow">›</span>
            </button>

            <button class="config-item config-item--danger" @click="logout">
              <span class="config-item__icon">🚪</span>
              <span class="config-item__label">Cerrar Sesión</span>
            </button>
          </div>

          <!-- Panel: Cuenta -->
          <div v-if="activeSection === 'cuenta'" class="section-panel">
            <div class="section-panel__header">
              <button class="btn-back" @click="activeSection = null">← Volver al Perfil</button>
            </div>

            <div class="info-card">
              <div class="info-card__avatar">
                <span>{{ initials }}</span>
                <div class="info-card__avatar-edit">📷</div>
              </div>
              <h3 class="info-card__name">{{ displayName }}</h3>
              <p class="info-card__change">Cambiar foto de perfil</p>
            </div>

            <div class="form-card">
              <h4 class="form-card__title">👤 Información Personal</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>Nombre Completo</label>
                  <input v-model="form.fullName" type="text" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Correo Electrónico</label>
                  <input v-model="form.email" type="email" class="form-input" />
                </div>
              </div>
              <div class="form-group">
                <label>Teléfono</label>
                <input v-model="form.phone" type="text" class="form-input" placeholder="+51 999 999 999" />
              </div>
            </div>

            <div class="form-card">
              <h4 class="form-card__title">🛡️ Seguridad</h4>
              <div class="security-row">
                <div>
                  <p class="security-row__label">Contraseña</p>
                  <p class="security-row__sub">Actualizada hace 3 meses</p>
                </div>
                <button class="btn-outline">Cambiar contraseña</button>
              </div>
              <div class="security-row">
                <div>
                  <p class="security-row__label">Autenticación de dos pasos</p>
                  <p class="security-row__sub">Protege tu cuenta con una capa extra</p>
                </div>
                <div class="toggle" :class="{ 'toggle--on': twoFactor }" @click="twoFactor = !twoFactor">
                  <div class="toggle__dot"></div>
                </div>
              </div>
            </div>

            <div class="form-card">
              <h4 class="form-card__title">⚙️ Preferencias</h4>
              <div class="form-group">
                <label>Idioma de la App</label>
                <select class="form-input">
                  <option>Español (Latinoamérica)</option>
                  <option>English</option>
                </select>
              </div>
              <div class="security-row">
                <div>
                  <p class="security-row__label">Notificaciones de Recetas</p>
                  <p class="security-row__sub">Alertas sobre nuevas recetas de tus perfiles favoritos</p>
                </div>
                <div class="toggle toggle--on">
                  <div class="toggle__dot"></div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button class="btn-discard" @click="activeSection = null">Descartar cambios</button>
              <button class="btn-save">Guardar cambios</button>
            </div>
          </div>

          <!-- Panel: Privacidad -->
          <div v-if="activeSection === 'privacidad'" class="section-panel">
            <h2 class="section-panel__title">Privacidad y Seguridad</h2>
            <p class="section-panel__sub">Administra cómo se protege tu cuenta y quién puede ver tu actividad culinaria.</p>

            <div class="privacy-grid">
              <div class="privacy-box">
                <h4>🔑 Gestión de contraseña</h4>
                <p>Actualiza tu contraseña regularmente para mantener tu cuenta segura.</p>
                <button class="btn-dark">Cambiar contraseña</button>
              </div>
              <div class="privacy-box">
                <div class="security-row">
                  <div>
                    <p class="security-row__label">Visibilidad del perfil</p>
                    <p class="security-row__sub">Hacer perfil público para otros foodies</p>
                  </div>
                  <div class="toggle">
                    <div class="toggle__dot"></div>
                  </div>
                </div>
              </div>
              <div class="privacy-box">
                <div class="security-row">
                  <div>
                    <p class="security-row__label">Autenticación de dos pasos</p>
                    <p class="security-row__sub">Capa extra de seguridad al iniciar sesión.</p>
                  </div>
                  <div class="toggle toggle--on">
                    <div class="toggle__dot"></div>
                  </div>
                </div>
              </div>
              <div class="privacy-box">
                <h4>📱 Sesiones activas</h4>
                <div class="session-item">
                  <span>💻</span>
                  <div>
                    <p class="security-row__label">Este dispositivo</p>
                    <p class="security-row__sub">Sesión actual</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="privacy-banner">
              <h4>Tu privacidad es nuestra receta secreta</h4>
              <p>En Foodly, nos tomamos en serio la protección de tus datos culinarios. Nunca compartiremos tus recetas favoritas ni tu ubicación sin tu permiso explícito.</p>
            </div>
          </div>

          <!-- Panel: Ayuda -->
          <div v-if="activeSection === 'ayuda'" class="section-panel">
            <h2 class="section-panel__title">¿Cómo podemos ayudarte hoy?</h2>
            <div class="help-search">
              <span>🔍</span>
              <input type="text" placeholder="Escribe tu duda o problema..." class="form-input" />
            </div>
            <p class="help-popular">Búsquedas populares:
              <a href="#">Estado del pedido</a> ·
              <a href="#">Reembolsos</a> ·
              <a href="#">Foodly Premium</a>
            </p>

            <div class="help-grid">
              <div class="help-box">🛒<h4>Descubrimientos</h4><p>Seguimiento, cambios o cancelaciones de tus compras.</p></div>
              <div class="help-box">👤<h4>Cuenta</h4><p>Seguridad, edición de perfil y privacidad de tus datos.</p></div>
              <div class="help-box">⭐<h4>Premium</h4><p>Beneficios, suscripciones y gestión de membresía.</p></div>
            </div>

            <div class="help-contact">
              <div>
                <h4>¿Aún necesitas ayuda?</h4>
                <p>Nuestro equipo de soporte está disponible 24/7.</p>
                <button class="btn-dark">💬 Chat en vivo</button>
                <button class="btn-outline" style="margin-top:8px">✉️ Enviar correo</button>
              </div>
              <div class="help-stat">
                <span class="help-stat__badge">AHORA</span>
                <p class="help-stat__num">~2 min</p>
                <p class="help-stat__label">Tiempo de espera</p>
              </div>
            </div>
          </div>

          <!-- Premium card -->
          <div class="premium-card">
            <h4>Foodly Premium</h4>
            <p>Descubre beneficios exclusivos y sin anuncios.</p>
            <button class="btn-premium">Actualizar ahora</button>
          </div>

        </div>
      </div>

    </main>
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar.vue'
import { userApi, communityApi } from '@/services/api.js'

export default {
  name: 'ProfileView',
  components: { NavBar },

  data() {
    return {
      loading: true,
      activeSection: null,
      twoFactor: true,
      favCount: 0,
      profile: null,
      form: { fullName: '', email: '', phone: '' },

      prefs: [
        { id: 'criolla',   label: 'Criolla',        active: false },
        { id: 'sangucheria', label: 'Sanguchería',  active: true  },
        { id: 'mariscos',  label: 'Mariscos',       active: false },
        { id: 'nikkei',    label: 'Nikkei',         active: false },
        { id: 'italiana',  label: 'Italiana',       active: false },
        { id: 'pollo',     label: 'Pollo a la Brasa', active: true },
        { id: 'vegana',    label: 'Vegana',         active: false },
      ],

      recentActivity: []
    }
  },

  computed: {
    displayName() {
      if (!this.profile) return ''
      if (this.profile.firstName) return this.profile.firstName
      return this.profile.username || ''
    },
    initials() {
      if (!this.profile) return '?'
      const f = this.profile.firstName?.[0] || ''
      const l = this.profile.lastName?.[0] || ''
      return (f + l).toUpperCase() || this.profile.username?.[0]?.toUpperCase() || '?'
    }
  },

  async mounted() {
    try {
      // Cargar perfil
      this.profile = await userApi.getProfile()
      this.form.fullName = `${this.profile.firstName || ''} ${this.profile.lastName || ''}`.trim()
      this.form.email    = this.profile.email || ''
      this.form.phone    = this.profile.phoneNumber || ''

      // Contar favoritos
      const favIds = await communityApi.getMyFavorites()
      this.favCount = Array.isArray(favIds) ? favIds.length : 0
    } catch (e) {
      console.error('Error cargando perfil', e)
    } finally {
      this.loading = false
    }
  },

  methods: {
    logout() {
      localStorage.removeItem('foodly_token')
      localStorage.removeItem('foodly_user')
      this.$router.push('/login')
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
  max-width: 960px; margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;
  align-items: start;
}

/* ---- Profile card ---- */
.profile-card {
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  box-shadow: 0 2px 12px var(--color-card-shadow);
  padding: 1.5rem; display: flex; gap: 1rem;
  align-items: flex-start; margin-bottom: 1rem;
}
.profile-card__avatar {
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--color-tab-inactive);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; font-weight: 800; color: var(--color-brand);
  flex-shrink: 0; position: relative;
  border: 3px solid var(--color-brand);
}
.profile-card__avatar-btn {
  position: absolute; bottom: 0; right: 0;
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--color-brand); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; font-weight: 700; cursor: pointer;
}
.profile-card__name {
  font-size: 1.4rem; font-weight: 900;
  color: var(--color-label); margin: 0 0 4px;
}
.profile-card__bio {
  font-size: 0.85rem; color: var(--color-input-icon); margin: 0 0 10px;
}
.profile-card__badges { display: flex; gap: 8px; flex-wrap: wrap; }

.badge {
  padding: 4px 12px; border-radius: var(--radius-pill);
  font-size: 0.75rem; font-weight: 700;
}
.badge--level { background: #fff3e0; color: var(--color-brand); }
.badge--pro   { background: var(--color-brand); color: #fff; }

/* ---- Stats ---- */
.stats-row {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 1rem; margin-bottom: 1rem;
}
.stat-box {
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  box-shadow: 0 2px 12px var(--color-card-shadow);
  padding: 1.25rem; text-align: center;
}
.stat-box__num {
  display: block; font-size: 1.8rem; font-weight: 900;
  color: var(--color-brand);
}
.stat-box__label {
  font-size: 0.8rem; color: var(--color-input-icon); font-weight: 600;
}

/* ---- Prefs ---- */
.prefs-card {
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  box-shadow: 0 2px 12px var(--color-card-shadow);
  padding: 1.25rem; margin-bottom: 1rem;
}
.prefs-card__title {
  font-size: 1rem; font-weight: 800;
  color: var(--color-label); margin: 0 0 1rem;
}
.prefs-card__tags { display: flex; flex-wrap: wrap; gap: 8px; }

.pref-tag {
  padding: 6px 14px; border-radius: var(--radius-pill);
  border: 1.5px solid var(--color-input-border);
  font-size: 0.82rem; font-weight: 600;
  color: var(--color-label); cursor: pointer;
  transition: all 0.2s;
}
.pref-tag--active {
  background: var(--color-brand); color: #fff;
  border-color: var(--color-brand);
}

/* ---- Activity ---- */
.activity-card {
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  box-shadow: 0 2px 12px var(--color-card-shadow);
  padding: 1.25rem;
}
.activity-card__title {
  font-size: 1rem; font-weight: 800;
  color: var(--color-label); margin: 0 0 1rem;
}
.activity-empty p { font-size: 0.85rem; color: var(--color-input-icon); }

.activity-item {
  display: flex; gap: 12px; margin-bottom: 1rem;
  padding-bottom: 1rem; border-bottom: 1px solid var(--color-input-border);
}
.activity-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.activity-item__img {
  width: 48px; height: 48px; border-radius: 8px;
  background: var(--color-tab-inactive);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; font-weight: 800; color: var(--color-brand);
  flex-shrink: 0;
}
.activity-item__name { font-size: 0.9rem; font-weight: 700; color: var(--color-label); }
.activity-item__comment { font-size: 0.8rem; color: var(--color-input-icon); margin: 2px 0; font-style: italic; }
.activity-item__when { font-size: 0.75rem; color: var(--color-placeholder); }

/* ---- Config panel ---- */
.config-card {
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  box-shadow: 0 2px 12px var(--color-card-shadow);
  padding: 1.25rem; margin-bottom: 1rem;
}
.config-card__title {
  font-size: 1rem; font-weight: 800;
  color: var(--color-label); margin: 0 0 1rem;
}
.config-item {
  width: 100%; display: flex; align-items: center; gap: 12px;
  background: none; border: none; cursor: pointer;
  padding: 12px 0; border-bottom: 1px solid var(--color-input-border);
  font-size: 0.9rem; color: var(--color-label); font-weight: 600;
  transition: color 0.2s;
}
.config-item:last-child { border-bottom: none; }
.config-item:hover { color: var(--color-brand); }
.config-item--danger { color: #e53935; }
.config-item--danger:hover { color: #b71c1c; }
.config-item__arrow { margin-left: auto; opacity: 0.4; font-size: 1.2rem; }

/* ---- Section panels ---- */
.section-panel {
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  box-shadow: 0 2px 12px var(--color-card-shadow);
  padding: 1.5rem; margin-bottom: 1rem;
}
.section-panel__title {
  font-size: 1.2rem; font-weight: 800;
  color: var(--color-label); margin: 0 0 6px;
}
.section-panel__sub {
  font-size: 0.85rem; color: var(--color-input-icon); margin: 0 0 1.5rem;
}
.btn-back {
  background: none; border: none; cursor: pointer;
  font-size: 0.88rem; color: var(--color-brand); font-weight: 600;
  padding: 0; margin-bottom: 1.5rem;
}

/* Avatar grande en cuenta */
.info-card {
  text-align: center; margin-bottom: 1.5rem;
}
.info-card__avatar {
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--color-brand);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; font-weight: 800; color: #fff;
  margin: 0 auto 8px; position: relative;
}
.info-card__avatar-edit {
  position: absolute; bottom: 0; right: 0;
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--color-card-bg); border: 2px solid var(--color-brand);
  display: flex; align-items: center; justify-content: center; font-size: 0.7rem;
}
.info-card__name { font-size: 1.1rem; font-weight: 800; color: var(--color-label); margin: 0 0 4px; }
.info-card__change { font-size: 0.82rem; color: var(--color-brand); cursor: pointer; margin: 0; }

/* Forms */
.form-card { margin-bottom: 1.25rem; }
.form-card__title { font-size: 0.95rem; font-weight: 800; color: var(--color-label); margin: 0 0 1rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 1rem; }
.form-group label { font-size: 0.82rem; font-weight: 600; color: var(--color-label); }
.form-input {
  border: 1.5px solid var(--color-input-border);
  border-radius: var(--radius-md); padding: 10px 14px;
  font-size: 0.9rem; color: var(--color-input-text);
  background: var(--color-input-bg); outline: none; width: 100%;
  box-sizing: border-box;
}
.form-input:focus { border-color: var(--color-brand); }

/* Security rows */
.security-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 0; border-bottom: 1px solid var(--color-input-border);
}
.security-row:last-child { border-bottom: none; }
.security-row__label { font-size: 0.9rem; font-weight: 600; color: var(--color-label); margin: 0 0 2px; }
.security-row__sub { font-size: 0.78rem; color: var(--color-input-icon); margin: 0; }

/* Toggle */
.toggle {
  width: 44px; height: 24px; border-radius: 12px;
  background: var(--color-input-border); cursor: pointer;
  position: relative; transition: background 0.2s; flex-shrink: 0;
}
.toggle--on { background: var(--color-brand); }
.toggle__dot {
  position: absolute; top: 3px; left: 3px;
  width: 18px; height: 18px; border-radius: 50%;
  background: #fff; transition: left 0.2s;
}
.toggle--on .toggle__dot { left: 23px; }

/* Form actions */
.form-actions {
  display: flex; justify-content: flex-end; gap: 12px; margin-top: 1rem;
}
.btn-discard {
  padding: 10px 20px; background: none;
  border: 1.5px solid var(--color-input-border);
  border-radius: var(--radius-md); font-size: 0.9rem;
  font-weight: 600; color: var(--color-label); cursor: pointer;
}
.btn-save {
  padding: 10px 24px; background: var(--color-brand);
  border: none; border-radius: var(--radius-md);
  font-size: 0.9rem; font-weight: 700; color: #fff; cursor: pointer;
}

/* Privacy */
.privacy-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
.privacy-box {
  background: var(--color-bg); border-radius: var(--radius-xl);
  padding: 1rem; border: 1.5px solid var(--color-input-border);
}
.privacy-box h4 { margin: 0 0 8px; font-size: 0.9rem; color: var(--color-label); }
.privacy-box p  { font-size: 0.8rem; color: var(--color-input-icon); margin: 0 0 12px; }
.privacy-banner {
  background: var(--color-brand); border-radius: var(--radius-xl);
  padding: 1.5rem; color: #fff;
}
.privacy-banner h4 { margin: 0 0 8px; font-size: 1rem; }
.privacy-banner p  { margin: 0; font-size: 0.85rem; opacity: 0.9; }
.session-item { display: flex; gap: 10px; align-items: center; margin-top: 8px; }

/* Help */
.help-search {
  display: flex; align-items: center; gap: 10px;
  border: 1.5px solid var(--color-input-border);
  border-radius: var(--radius-pill); padding: 10px 16px;
  margin-bottom: 8px;
}
.help-popular { font-size: 0.8rem; color: var(--color-input-icon); margin-bottom: 1.5rem; }
.help-popular a { color: var(--color-brand); text-decoration: none; margin: 0 4px; }
.help-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.help-box {
  background: var(--color-bg); border: 1.5px solid var(--color-input-border);
  border-radius: var(--radius-xl); padding: 1rem; text-align: center;
  font-size: 1.5rem;
}
.help-box h4 { font-size: 0.9rem; margin: 8px 0 4px; }
.help-box p  { font-size: 0.78rem; color: var(--color-input-icon); margin: 0; }
.help-contact { display: flex; gap: 1rem; align-items: flex-start; }
.help-stat { text-align: center; background: var(--color-bg); border: 1.5px solid var(--color-input-border); border-radius: var(--radius-xl); padding: 1rem; flex-shrink: 0; }
.help-stat__badge { background: var(--color-brand); color: #fff; font-size: 0.7rem; padding: 2px 8px; border-radius: var(--radius-pill); }
.help-stat__num { font-size: 1.8rem; font-weight: 900; color: var(--color-label); margin: 8px 0 0; }
.help-stat__label { font-size: 0.78rem; color: var(--color-input-icon); }

/* Buttons */
.btn-outline {
  display: block; width: 100%; padding: 10px; margin-top: 12px;
  border: 1.5px solid var(--color-input-border); border-radius: var(--radius-md);
  background: none; font-size: 0.88rem; font-weight: 600;
  color: var(--color-label); cursor: pointer;
}
.btn-dark {
  display: block; width: 100%; padding: 10px; margin-top: 12px;
  background: var(--color-label); color: #fff;
  border: none; border-radius: var(--radius-md);
  font-size: 0.88rem; font-weight: 700; cursor: pointer;
}

/* Premium */
.premium-card {
  background: #4a1a00; border-radius: var(--radius-xl);
  padding: 1.25rem; color: #fff; text-align: center;
}
.premium-card h4 { margin: 0 0 6px; font-size: 1rem; }
.premium-card p  { margin: 0 0 12px; font-size: 0.82rem; opacity: 0.85; }
.btn-premium {
  background: var(--color-brand); color: #fff; border: none;
  border-radius: var(--radius-pill); padding: 10px 20px;
  font-size: 0.9rem; font-weight: 700; cursor: pointer;
}
</style>