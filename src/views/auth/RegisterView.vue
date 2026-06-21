<template>
  <div class="auth-page">
    <div class="brand">
      <img src="@/assets/foodly_logo.png" alt="Foodly logo" class="brand__logo" />
    </div>

    <div class="auth-card">
      <div class="role-tabs">
        <button class="role-tabs__btn" :class="{ 'role-tabs__btn--active': activeRole === 'comensal' }" @click="activeRole = 'comensal'">Soy Comensal</button>
        <button class="role-tabs__btn" :class="{ 'role-tabs__btn--active': activeRole === 'dueno' }" @click="activeRole = 'dueno'">Soy Dueño de Local</button>
      </div>

      <form class="auth-form" @submit.prevent="handleRegister">

        <div class="form-group">
          <label class="form-group__label">Nombre(s)</label>
          <div class="input-wrapper">
            <span class="input-wrapper__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <input v-model="form.firstName" type="text" class="input-wrapper__field" placeholder="Tu nombre" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-group__label">Apellido(s)</label>
          <div class="input-wrapper">
            <span class="input-wrapper__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <input v-model="form.lastName" type="text" class="input-wrapper__field" placeholder="Tu apellido" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-group__label">Correo electrónico</label>
          <div class="input-wrapper">
            <span class="input-wrapper__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </span>
            <input v-model="form.email" type="email" class="input-wrapper__field" placeholder="tucorreo@ejemplo.com" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-group__label">Contraseña</label>
          <div class="input-wrapper">
    <span class="input-wrapper__icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    </span>
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="input-wrapper__field" placeholder="Mín. 8 caracteres" required />
            <button type="button" class="input-wrapper__eye" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>

          <!-- Checklist de requisitos -->
          <div v-if="form.password.length > 0" class="pwd-rules">
            <div class="pwd-rule" :class="{ 'pwd-rule--ok': rules.length }">
              <span class="pwd-rule__icon">{{ rules.length ? '✓' : '✗' }}</span>
              Mínimo 8 caracteres
            </div>
            <div class="pwd-rule" :class="{ 'pwd-rule--ok': rules.upper }">
              <span class="pwd-rule__icon">{{ rules.upper ? '✓' : '✗' }}</span>
              Una letra mayúscula
            </div>
            <div class="pwd-rule" :class="{ 'pwd-rule--ok': rules.number }">
              <span class="pwd-rule__icon">{{ rules.number ? '✓' : '✗' }}</span>
              Un número
            </div>
            <div class="pwd-rule" :class="{ 'pwd-rule--ok': rules.special }">
              <span class="pwd-rule__icon">{{ rules.special ? '✓' : '✗' }}</span>
              Un símbolo (!@#$...)
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-group__label">Repetir contraseña</label>
          <div class="input-wrapper" :class="{ 'input-wrapper--error': passwordMismatch }">
            <span class="input-wrapper__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input v-model="form.confirmPassword" :type="showConfirm ? 'text' : 'password'" class="input-wrapper__field" placeholder="••••••••" required />
            <button type="button" class="input-wrapper__eye" @click="showConfirm = !showConfirm">
              <svg v-if="!showConfirm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
          <p v-if="passwordMismatch" class="form-error">Las contraseñas no coinciden</p>
        </div>

        <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>

        <button type="submit" class="btn-submit" :disabled="loading || passwordMismatch || !passwordValid">
          <span v-if="!loading">Registrarse →</span>
          <span v-else>Registrando...</span>
        </button>

      </form>

      <p class="auth-link">
        ¿Tienes una cuenta?
        <router-link to="/login" class="auth-link__a">Iniciar sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { authApi } from '@/services/api.js'

export default {
  name: 'RegisterView',
  data() {
    return {
      activeRole: 'comensal',
      showPassword: false,
      showConfirm: false,
      loading: false,
      errorMsg: '',
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },

  computed: {
    rules() {
      const p = this.form.password
      return {
        length:  p.length >= 8,
        upper:   /[A-Z]/.test(p),
        number:  /[0-9]/.test(p),
        special: /[^a-zA-Z0-9]/.test(p)
      }
    },
    passwordValid() {
      return Object.values(this.rules).every(Boolean)
    },
    passwordMismatch() {
      return this.form.confirmPassword.length > 0 && this.form.password !== this.form.confirmPassword
    }
  },

  methods: {
    async handleRegister() {
      this.errorMsg = ''
      if (this.passwordMismatch || !this.passwordValid) return
      this.loading = true

      try {
        const res = await authApi.register({
          firstName: this.form.firstName,
          lastName:  this.form.lastName,
          username:  this.form.email.split('@')[0],
          email:     this.form.email,
          password:  this.form.password,
          roles: this.activeRole === 'comensal' ? ['CLIENT'] : ['HUARIQUE_ADMIN']
        })

        if (res.accessToken) {
          localStorage.setItem('foodly_token', res.accessToken)
          localStorage.setItem('foodly_user', JSON.stringify(res))
          this.$router.push(this.activeRole === 'comensal' ? '/explorar' : '/dashboard')
        } else {
          this.errorMsg = res.message || res.error || 'No se pudo registrar. Intenta de nuevo.'
        }
      } catch (e) {
        this.errorMsg = 'Error de conexión. Verifica que el servidor esté activo.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>


.auth-page {
  min-height: 100vh;
  background-color: var(--color-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem 3rem;
}

.brand {
  display: flex;
  align-items: center;
  margin-top: 2.5rem;
  margin-bottom: 1.75rem;
}

.brand__logo { width: 110px; height: 110px; object-fit: contain; }

.auth-card {
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 24px var(--color-card-shadow);
  padding: 1.75rem;
  width: 100%;
  max-width: 360px;
}

.role-tabs {
  display: flex;
  background: var(--color-tab-inactive);
  border-radius: var(--radius-pill);
  padding: 4px;
  margin-bottom: 1.5rem;
  gap: 4px;
}

.role-tabs__btn {
  flex: 1; padding: 10px 8px; border: none;
  border-radius: var(--radius-pill);
  font-family: var(--font-main); font-size: 0.82rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
  background: transparent; color: var(--color-tab-text-inactive);
  white-space: nowrap;
}

.role-tabs__btn--active {
  background: var(--color-tab-active); color: #fff;
  box-shadow: 0 2px 8px rgba(123,58,16,0.25);
}

.auth-form { display: flex; flex-direction: column; gap: 1rem; }

.form-group { display: flex; flex-direction: column; gap: 6px; }

.form-group__label { font-size: 0.875rem; font-weight: 600; color: var(--color-label); }

.input-wrapper {
  display: flex; align-items: center;
  background: var(--color-input-bg);
  border: 1.5px solid var(--color-input-border);
  border-radius: var(--radius-md);
  padding: 0 14px; gap: 10px; transition: border-color 0.2s;
}

.input-wrapper:focus-within { border-color: var(--color-brand); }
.input-wrapper--error { border-color: var(--color-error) !important; }

.input-wrapper__icon { color: var(--color-input-icon); display: flex; align-items: center; flex-shrink: 0; }

.input-wrapper__field {
  flex: 1; height: 48px; border: none; outline: none;
  font-family: var(--font-main); font-size: 0.9rem;
  color: var(--color-input-text); background: transparent;
}

.input-wrapper__field::placeholder { color: var(--color-placeholder); }

.input-wrapper__eye {
  background: none; border: none; cursor: pointer;
  color: var(--color-input-icon); display: flex; align-items: center; padding: 0;
}

/* Password strength */
.password-strength {
  display: flex; align-items: center; gap: 10px; margin-top: 2px;
}

.password-strength__bar {
  flex: 1; height: 4px;
  background: var(--color-input-border);
  border-radius: 99px; overflow: hidden;
}

.password-strength__fill {
  height: 100%; border-radius: 99px; transition: width 0.3s, background 0.3s;
}

.password-strength__label { font-size: 0.72rem; font-weight: 700; min-width: 65px; text-align: right; }

.strength--weak  { background: #ef4444; color: #ef4444; }
.strength--fair  { background: #f97316; color: #f97316; }
.strength--good  { background: #eab308; color: #eab308; }
.strength--strong { background: #22c55e; color: #22c55e; }

.field-hint { font-size: 0.75rem; color: var(--color-input-icon); font-weight: 500; }

.form-error { font-size: 0.8rem; color: var(--color-error); font-weight: 500; }

.btn-submit {
  width: 100%; padding: 14px;
  background: var(--color-brand); color: #fff;
  border: none; border-radius: var(--radius-md);
  font-family: var(--font-main); font-size: 1rem; font-weight: 700;
  cursor: pointer; transition: background 0.2s, transform 0.1s; margin-top: 0.25rem;
}

.btn-submit:hover { background: var(--color-brand-dark); }
.btn-submit:active { transform: scale(0.98); }
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

.auth-link { text-align: center; margin-top: 1rem; font-size: 0.85rem; color: var(--color-input-icon); }

.auth-link__a { color: var(--color-brand-light); font-weight: 700; text-decoration: none; }
.auth-link__a:hover { text-decoration: underline; }


.pwd-rules {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 6px;
  padding: 10px 12px;
  background: var(--color-input-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-input-border);
}

.pwd-rule {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-input-icon);
  transition: color 0.2s;
}

.pwd-rule--ok {
  color: #22c55e;
}

.pwd-rule__icon {
  font-size: 0.75rem;
  font-weight: 800;
  width: 14px;
  text-align: center;
}

</style>