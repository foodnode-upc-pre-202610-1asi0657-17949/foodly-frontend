<template>
  <div class="dashboard-page">
    <NavBarOwner />

    <main class="dashboard-main">

      <!-- Header -->
      <div class="dashboard-header">
        <div>
          <h1 class="dashboard-header__title">Hola, {{ restaurantName }}</h1>
          <p class="dashboard-header__sub">Gestión diaria de tu local en {{ district }}.</p>
        </div>
        <div class="status-toggle">
          <button
              class="status-toggle__btn"
              :class="{ 'status-toggle__btn--active': isOpen }"
              @click="isOpen = true"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
            </svg>
            ABIERTO
          </button>
          <button
              class="status-toggle__btn"
              :class="{ 'status-toggle__btn--active': !isOpen }"
              @click="isOpen = false"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
            CERRADO
          </button>
        </div>
      </div>

      <!-- Métricas -->
      <div class="metrics-grid">
        <!-- Visualizaciones -->
        <div class="metric-card">
          <div class="metric-card__top">
            <div class="metric-card__icon metric-card__icon--views">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <span class="metric-card__badge">+12% vs ayer</span>
          </div>
          <p class="metric-card__label">Visualizaciones del perfil</p>
          <p class="metric-card__value">1,240</p>
        </div>

        <!-- Favoritos -->
        <div class="metric-card">
          <div class="metric-card__top">
            <div class="metric-card__icon metric-card__icon--favs">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
          </div>
          <p class="metric-card__label">Favoritos</p>
          <p class="metric-card__value">450</p>
          <p class="metric-card__sub">Clientes que guardaron el local</p>
        </div>

        <!-- Radar -->
        <div class="metric-card metric-card--dark">
          <div class="metric-card__top">
            <div class="metric-card__icon metric-card__icon--radar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
              </svg>
            </div>
          </div>
          <p class="metric-card__label">Apariciones en el Radar</p>
          <p class="metric-card__value">890</p>
          <div class="metric-card__bar">
            <div class="metric-card__bar-fill"></div>
          </div>
        </div>
      </div>

      <!-- Accesos rápidos + Banner -->
      <div class="bottom-grid">
        <!-- Accesos rápidos -->
        <div class="quick-access">
          <h2 class="section-title">Accesos Rápidos</h2>
          <div class="quick-access__list">
            <router-link to="/mi-menu" class="quick-card">
              <div class="quick-card__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div>
                <p class="quick-card__title">Actualizar Perfil</p>
                <p class="quick-card__sub">Cambia fotos, horarios o menú</p>
              </div>
            </router-link>

            <router-link to="/resenas" class="quick-card">
              <div class="quick-card__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div>
                <p class="quick-card__title">Ver Reseñas</p>
                <p class="quick-card__sub">4.8 estrellas en Miraflores</p>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Banner promoción -->
        <div class="promo-banner">
          <div class="promo-banner__overlay">
            <span class="promo-badge">PROMOCIÓN ACTIVA</span>
            <h3 class="promo-banner__title">Sanguche de Chicharrón + Café Pasado</h3>
            <p class="promo-banner__sub">Tu promoción esta atrayendo a un 25% más de clientes nuevos esta semana en el Radar de Miraflores.</p>
            <button class="promo-banner__btn">Gestionar Campaña</button>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script>
import NavBarOwner from '@/components/common/NavBarOwner.vue'

export default {
  name: 'OwnerDashboard',
  components: { NavBarOwner },
  data() {
    return {
      isOpen: true,
      restaurantName: 'La Lucha Sanguchería',
      district: 'Miraflores'
    }
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('foodly_user') || '{}')
    if (user.firstName) this.restaurantName = user.firstName
  }
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: var(--color-bg);
}

.dashboard-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 2rem 3rem;
}

/* Header */
.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard-header__title {
  font-size: 2rem;
  font-weight: 900;
  color: var(--color-label);
  margin: 0 0 4px;
}

.dashboard-header__sub {
  font-size: 0.95rem;
  color: var(--color-input-icon);
  margin: 0;
}

/* Status toggle */
.status-toggle {
  display: flex;
  background: var(--color-card-bg);
  border: 1.5px solid var(--color-input-border);
  border-radius: var(--radius-pill);
  padding: 4px;
  gap: 4px;
}

.status-toggle__btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-pill);
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  background: transparent;
  color: var(--color-input-icon);
  transition: all 0.2s;
  letter-spacing: 0.5px;
}

.status-toggle__btn--active {
  background: var(--color-brand-dark);
  color: #fff;
  box-shadow: 0 2px 8px rgba(123,58,16,0.25);
}

/* Metrics */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: 0 2px 12px var(--color-card-shadow);
}

.metric-card--dark {
  background: var(--color-brand);
  color: #fff;
}

.metric-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.metric-card__icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-card__icon--views { background: #fde8e0; color: var(--color-brand); }
.metric-card__icon--favs  { background: #fde8e0; color: var(--color-brand); }
.metric-card__icon--radar { background: rgba(255,255,255,0.2); color: #fff; }

.metric-card__badge {
  background: #22c55e;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
}

.metric-card__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-input-icon);
  margin: 0 0 4px;
}

.metric-card--dark .metric-card__label { color: rgba(255,255,255,0.8); }

.metric-card__value {
  font-size: 2.25rem;
  font-weight: 900;
  color: var(--color-label);
  margin: 0;
  line-height: 1.1;
}

.metric-card--dark .metric-card__value { color: #fff; }

.metric-card__sub {
  font-size: 0.8rem;
  color: var(--color-input-icon);
  margin: 4px 0 0;
}

.metric-card__bar {
  margin-top: 1rem;
  height: 4px;
  background: rgba(255,255,255,0.3);
  border-radius: 99px;
  overflow: hidden;
}

.metric-card__bar-fill {
  width: 65%;
  height: 100%;
  background: #fff;
  border-radius: 99px;
}

/* Bottom grid */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1.8fr;
  gap: 1.25rem;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-label);
  margin: 0 0 1rem;
}

/* Quick access */
.quick-access__list { display: flex; flex-direction: column; gap: 0.75rem; }

.quick-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--color-card-bg);
  border-radius: var(--radius-lg);
  padding: 1.1rem 1.25rem;
  box-shadow: 0 2px 8px var(--color-card-shadow);
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
}

.quick-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--color-card-shadow);
}

.quick-card__icon {
  width: 42px;
  height: 42px;
  background: #fde8e0;
  color: var(--color-brand);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-card__title {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-label);
  margin: 0 0 2px;
}

.quick-card__sub {
  font-size: 0.78rem;
  color: var(--color-input-icon);
  margin: 0;
}

/* Promo banner */
.promo-banner {
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-brand-light), var(--color-brand));
  min-height: 260px;
  position: relative;
}

.promo-banner__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(120,50,10,0.75) 40%, transparent);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.75rem;
}

.promo-badge {
  display: inline-block;
  background: #22c55e;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  letter-spacing: 0.5px;
  width: fit-content;
}

.promo-banner__title {
  font-size: 1.4rem;
  font-weight: 900;
  color: #fff;
  margin: 0;
  line-height: 1.2;
}

.promo-banner__sub {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.85);
  margin: 0;
  max-width: 340px;
}

.promo-banner__btn {
  margin-top: 0.5rem;
  width: fit-content;
  padding: 12px 24px;
  background: var(--color-brand-dark);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.promo-banner__btn:hover { background: #7a3005; }

/* Responsive */
@media (max-width: 768px) {
  .metrics-grid { grid-template-columns: 1fr; }
  .bottom-grid  { grid-template-columns: 1fr; }
  .dashboard-header { flex-direction: column; }
}
</style>