<template>
  <nav class="navbar">
    <div class="navbar__inner">

      <!-- Logo -->
      <router-link to="/explorar" class="navbar__brand">
        <img src="@/assets/foodly_logo.png" alt="Foodly" class="navbar__logo" />
        <span class="navbar__name">Foodly</span>
      </router-link>

      <!-- Links -->
      <div class="navbar__links">
        <router-link to="/explorar"  class="navbar__link" active-class="navbar__link--active">Inicio</router-link>
        <router-link to="/radar"     class="navbar__link" active-class="navbar__link--active">Radar</router-link>
        <router-link to="/favoritos" class="navbar__link" active-class="navbar__link--active">Favoritos</router-link>
        <router-link to="/perfil"    class="navbar__link" active-class="navbar__link--active">Perfil</router-link>
      </div>

      <!-- Búsqueda -->
      <div class="navbar__search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" placeholder="Buscar huariques..." class="navbar__input" />
      </div>

    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
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
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.navbar__logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.navbar__name {
  font-size: 1.3rem;
  font-weight: 900;
  color: var(--color-brand);
}

.navbar__links {
  display: flex;
  gap: 1.5rem;
  margin-left: 1rem;
}

.navbar__link {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-input-icon);
  text-decoration: none;
  transition: color 0.2s;
}

.navbar__link:hover,
.navbar__link--active {
  color: var(--color-brand);
}

.navbar__search {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-input-bg);
  border: 1.5px solid var(--color-input-border);
  border-radius: var(--radius-pill);
  padding: 8px 14px;
  color: var(--color-input-icon);
}

.navbar__input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.88rem;
  color: var(--color-input-text);
  width: 180px;
}

.navbar__input::placeholder {
  color: var(--color-placeholder);
}
</style>