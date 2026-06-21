<template>
  <nav class="navbar">
    <div class="navbar__inner">
      <div class="navbar__brand">
        <span class="navbar__name">Foodly Admin</span>
      </div>

      <div class="navbar__links">
        <router-link to="/dashboard"   class="navbar__link" active-class="navbar__link--active">Dashboard</router-link>
        <router-link to="/mi-menu"     class="navbar__link" active-class="navbar__link--active">Mi Menú</router-link>
        <router-link to="/resenas"     class="navbar__link" active-class="navbar__link--active">Reseñas</router-link>
        <router-link to="/owner-perfil" class="navbar__link" active-class="navbar__link--active">Perfil</router-link>
      </div>

      <div class="navbar__account" v-click-outside="closeMenu">
        <div class="navbar__avatar" @click="menuOpen = !menuOpen">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>

        <div v-if="menuOpen" class="navbar__menu">
          <button class="navbar__menu-item" @click="goProfile">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Mi perfil
          </button>
          <button class="navbar__menu-item navbar__menu-item--danger" @click="logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBarOwner',
  data() {
    return {
      menuOpen: false
    }
  },
  directives: {
    clickOutside: {
      mounted(el, binding) {
        el.__clickOutsideHandler__ = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event)
          }
        }
        document.addEventListener('click', el.__clickOutsideHandler__)
      },
      unmounted(el) {
        document.removeEventListener('click', el.__clickOutsideHandler__)
      }
    }
  },
  methods: {
    closeMenu() {
      this.menuOpen = false
    },
    goProfile() {
      this.menuOpen = false
      this.$router.push('/owner-perfil')
    },
    logout() {
      localStorage.removeItem('foodly_token')
      localStorage.removeItem('foodly_user')
      this.menuOpen = false
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.navbar {
  background: var(--color-card-bg);
  box-shadow: 0 2px 12px var(--color-card-shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.navbar__brand { display: flex; align-items: center; }

.navbar__name {
  font-size: 1.3rem;
  font-weight: 900;
  color: var(--color-brand);
  letter-spacing: -0.5px;
}

.navbar__links {
  display: flex;
  gap: 2rem;
}

.navbar__link {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-input-icon);
  text-decoration: none;
  transition: color 0.2s;
  padding-bottom: 2px;
}

.navbar__link:hover { color: var(--color-brand); }

.navbar__link--active {
  color: var(--color-brand);
  border-bottom: 2px solid var(--color-brand);
}

.navbar__account {
  margin-left: auto;
  position: relative;
}

.navbar__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-brand-light);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.navbar__avatar:hover { background: var(--color-brand); }

.navbar__menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--color-card-bg);
  border: 1px solid var(--color-input-border);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 24px var(--color-card-shadow);
  min-width: 180px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 200;
}

.navbar__menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-label);
  font-family: var(--font-main);
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}

.navbar__menu-item:hover { background: var(--color-input-bg); }

.navbar__menu-item--danger { color: #ef4444; }
.navbar__menu-item--danger:hover { background: #fee2e2; }
</style>