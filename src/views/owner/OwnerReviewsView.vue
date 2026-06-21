<template>
  <div class="reviews-page">
    <NavBarOwner />

    <main class="reviews-main">

      <!-- Header -->
      <div class="reviews-header">
        <div>
          <h1 class="reviews-header__title">Reseñas</h1>
          <p class="reviews-header__sub">Lo que dicen tus comensales sobre {{ restaurantName }}.</p>
        </div>
      </div>

      <!-- Resumen -->
      <div class="summary-grid">
        <div class="summary-card summary-card--score">
          <p class="summary-card__value">{{ averageRating.toFixed(1) }}</p>
          <div class="summary-card__stars">
            <svg v-for="n in 5" :key="n" width="16" height="16" viewBox="0 0 24 24" :fill="n <= Math.round(averageRating) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
            </svg>
          </div>
          <p class="summary-card__label">{{ reviews.length }} reseñas en total</p>
        </div>

        <div class="summary-card summary-card--bars">
          <div v-for="bar in ratingBreakdown" :key="bar.stars" class="rating-bar">
            <span class="rating-bar__label">{{ bar.stars }} ★</span>
            <div class="rating-bar__track">
              <div class="rating-bar__fill" :style="{ width: bar.pct + '%' }"></div>
            </div>
            <span class="rating-bar__count">{{ bar.count }}</span>
          </div>
        </div>

        <div class="summary-card summary-card--pending">
          <div class="summary-card__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <p class="summary-card__value">{{ pendingCount }}</p>
          <p class="summary-card__label">Sin responder</p>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters">
        <button
            v-for="f in filters"
            :key="f.value"
            class="filter-chip"
            :class="{ 'filter-chip--active': activeFilter === f.value }"
            @click="activeFilter = f.value"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Estado vacío -->
      <div v-if="filteredReviews.length === 0" class="empty-state">
        <div class="empty-state__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <p class="empty-state__title">No hay reseñas en este filtro</p>
      </div>

      <!-- Lista de reseñas -->
      <div v-else class="reviews-list">
        <div v-for="review in filteredReviews" :key="review.id" class="review-card">
          <div class="review-card__top">
            <div class="review-card__user">
              <div class="review-card__avatar">{{ review.initials }}</div>
              <div>
                <p class="review-card__name">{{ review.userName }}</p>
                <div class="review-card__stars">
                  <svg v-for="n in 5" :key="n" width="13" height="13" viewBox="0 0 24 24" :fill="n <= review.rating ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
            </div>
            <span class="review-card__date">{{ review.date }}</span>
          </div>

          <p class="review-card__comment">{{ review.comment }}</p>

          <!-- Respuesta existente -->
          <div v-if="review.reply" class="reply-block">
            <p class="reply-block__label">Tu respuesta</p>
            <p class="reply-block__text">{{ review.reply }}</p>
          </div>

          <!-- Formulario de respuesta -->
          <div v-else-if="review.replying" class="reply-form">
            <textarea v-model="review.draftReply" class="reply-form__input" rows="2" placeholder="Escribe una respuesta pública..."></textarea>
            <div class="reply-form__actions">
              <button class="btn-cancel" @click="cancelReply(review)">Cancelar</button>
              <button class="btn-send" @click="sendReply(review)">Responder</button>
            </div>
          </div>

          <button v-else class="btn-reply" @click="startReply(review)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Responder
          </button>
        </div>
      </div>

    </main>
  </div>
</template>

<script>
import NavBarOwner from '@/components/common/NavBarOwner.vue'

export default {
  name: 'OwnerReviewsView',
  components: { NavBarOwner },
  data() {
    return {
      restaurantName: 'tu local',
      activeFilter: 'all',
      filters: [
        { label: 'Todas', value: 'all' },
        { label: 'Sin responder', value: 'pending' },
        { label: 'Respondidas', value: 'replied' }
      ],
      reviews: [
        {
          id: 1,
          userName: 'Mariana Quispe',
          initials: 'MQ',
          rating: 5,
          date: 'hace 2 días',
          comment: 'El lomo saltado estaba espectacular, justo como en casa. La atención también fue muy rápida.',
          reply: '¡Gracias Mariana! Nos alegra mucho que te haya gustado, te esperamos pronto otra vez.',
          replying: false,
          draftReply: ''
        },
        {
          id: 2,
          userName: 'Carlos Effio',
          initials: 'CE',
          rating: 4,
          date: 'hace 4 días',
          comment: 'Buena sazón, aunque la porción de arroz podría ser un poco más generosa. Volveré a probar otros platos.',
          reply: '',
          replying: false,
          draftReply: ''
        },
        {
          id: 3,
          userName: 'Lucía Fernández',
          initials: 'LF',
          rating: 3,
          date: 'hace 1 semana',
          comment: 'La comida bien, pero demoraron bastante en atender un sábado al mediodía.',
          reply: '',
          replying: false,
          draftReply: ''
        },
        {
          id: 4,
          userName: 'Jorge Ramos',
          initials: 'JR',
          rating: 5,
          date: 'hace 2 semanas',
          comment: 'El mejor ají de gallina que he probado en Lince. Definitivamente mi nuevo lugar favorito.',
          reply: 'Muchas gracias Jorge, ¡un gusto tenerte como cliente!',
          replying: false,
          draftReply: ''
        }
      ]
    }
  },
  computed: {
    averageRating() {
      if (!this.reviews.length) return 0
      return this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length
    },
    pendingCount() {
      return this.reviews.filter(r => !r.reply).length
    },
    ratingBreakdown() {
      const total = this.reviews.length || 1
      return [5, 4, 3, 2, 1].map(stars => {
        const count = this.reviews.filter(r => r.rating === stars).length
        return { stars, count, pct: Math.round((count / total) * 100) }
      })
    },
    filteredReviews() {
      if (this.activeFilter === 'pending') return this.reviews.filter(r => !r.reply)
      if (this.activeFilter === 'replied') return this.reviews.filter(r => r.reply)
      return this.reviews
    }
  },
  methods: {
    startReply(review) {
      review.replying = true
    },
    cancelReply(review) {
      review.replying = false
      review.draftReply = ''
    },
    sendReply(review) {
      if (!review.draftReply.trim()) return
      review.reply = review.draftReply.trim()
      review.replying = false
      review.draftReply = ''
    }
  }
}
</script>

<style scoped>
.reviews-page { min-height: 100vh; background: var(--color-bg); }
.reviews-main { max-width: 900px; margin: 0 auto; padding: 2rem 2rem 3rem; }

.reviews-header { margin-bottom: 1.5rem; }
.reviews-header__title { font-size: 1.75rem; font-weight: 900; color: var(--color-brand); margin: 0 0 4px; }
.reviews-header__sub   { font-size: 0.92rem; color: var(--color-input-icon); margin: 0; }

/* Summary */
.summary-grid { display: grid; grid-template-columns: 160px 1fr 140px; gap: 1.25rem; margin-bottom: 1.5rem; }

.summary-card { background: var(--color-card-bg); border-radius: var(--radius-xl); box-shadow: 0 2px 12px var(--color-card-shadow); padding: 1.25rem; }

.summary-card--score { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.summary-card__value { font-size: 2rem; font-weight: 900; color: var(--color-label); margin: 0; line-height: 1.1; }
.summary-card__stars { display: flex; gap: 2px; color: var(--color-brand); margin: 6px 0; }
.summary-card__label { font-size: 0.75rem; color: var(--color-input-icon); margin: 0; }

.summary-card--bars { display: flex; flex-direction: column; justify-content: center; gap: 6px; }
.rating-bar { display: flex; align-items: center; gap: 8px; }
.rating-bar__label { font-size: 0.72rem; font-weight: 600; color: var(--color-input-icon); width: 28px; flex-shrink: 0; }
.rating-bar__track { flex: 1; height: 6px; background: var(--color-input-border); border-radius: 99px; overflow: hidden; }
.rating-bar__fill { height: 100%; background: var(--color-brand); border-radius: 99px; }
.rating-bar__count { font-size: 0.72rem; color: var(--color-input-icon); width: 16px; text-align: right; flex-shrink: 0; }

.summary-card--pending { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--color-brand); }
.summary-card__icon { margin-bottom: 4px; }
.summary-card--pending .summary-card__value { color: var(--color-brand); }

/* Filters */
.filters { display: flex; gap: 8px; margin-bottom: 1.25rem; }
.filter-chip { padding: 8px 16px; background: var(--color-card-bg); border: 1.5px solid var(--color-input-border); border-radius: var(--radius-pill); font-size: 0.82rem; font-weight: 600; color: var(--color-input-icon); cursor: pointer; font-family: var(--font-main); transition: all 0.2s; }
.filter-chip:hover { border-color: var(--color-brand-light); }
.filter-chip--active { background: var(--color-brand); border-color: var(--color-brand); color: #fff; }

/* Empty state */
.empty-state { background: var(--color-card-bg); border-radius: var(--radius-xl); box-shadow: 0 2px 12px var(--color-card-shadow); padding: 3rem 2rem; display: flex; flex-direction: column; align-items: center; text-align: center; color: var(--color-input-icon); }
.empty-state__icon { margin-bottom: 0.75rem; }
.empty-state__title { font-size: 0.95rem; font-weight: 600; margin: 0; }

/* Reviews list */
.reviews-list { display: flex; flex-direction: column; gap: 1rem; }

.review-card { background: var(--color-card-bg); border-radius: var(--radius-xl); box-shadow: 0 2px 12px var(--color-card-shadow); padding: 1.25rem 1.5rem; }

.review-card__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem; }
.review-card__user { display: flex; align-items: center; gap: 10px; }
.review-card__avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--color-brand-light); color: #fff; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.review-card__name { font-size: 0.9rem; font-weight: 700; color: var(--color-label); margin: 0 0 2px; }
.review-card__stars { display: flex; gap: 1px; color: var(--color-brand); }
.review-card__date { font-size: 0.75rem; color: var(--color-input-icon); white-space: nowrap; }

.review-card__comment { font-size: 0.88rem; color: var(--color-input-text); line-height: 1.55; margin: 0 0 0.9rem; }

.btn-reply { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: #fde8e0; color: var(--color-brand); border: none; border-radius: var(--radius-md); font-size: 0.8rem; font-weight: 700; font-family: var(--font-main); cursor: pointer; transition: background 0.2s; }
.btn-reply:hover { background: #f5c9b0; }

.reply-block { background: var(--color-input-bg); border-left: 3px solid var(--color-brand-light); border-radius: var(--radius-md); padding: 10px 14px; }
.reply-block__label { font-size: 0.72rem; font-weight: 700; color: var(--color-brand); margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.4px; }
.reply-block__text { font-size: 0.84rem; color: var(--color-input-text); margin: 0; line-height: 1.5; }

.reply-form { display: flex; flex-direction: column; gap: 8px; }
.reply-form__input { padding: 10px 12px; background: var(--color-input-bg); border: 1.5px solid var(--color-input-border); border-radius: var(--radius-md); font-size: 0.85rem; color: var(--color-input-text); font-family: var(--font-main); outline: none; resize: vertical; width: 100%; box-sizing: border-box; transition: border-color 0.2s; }
.reply-form__input:focus { border-color: var(--color-brand); }
.reply-form__actions { display: flex; justify-content: flex-end; gap: 8px; }
.btn-cancel { padding: 8px 14px; background: transparent; border: 1.5px solid var(--color-input-border); border-radius: var(--radius-md); font-size: 0.8rem; font-weight: 600; color: var(--color-input-icon); font-family: var(--font-main); cursor: pointer; transition: background 0.2s; }
.btn-cancel:hover { background: var(--color-input-bg); }
.btn-send { padding: 8px 16px; background: var(--color-brand); border: none; border-radius: var(--radius-md); font-size: 0.8rem; font-weight: 700; color: #fff; font-family: var(--font-main); cursor: pointer; transition: background 0.2s; }
.btn-send:hover { background: var(--color-brand-dark); }

@media (max-width: 768px) {
  .summary-grid { grid-template-columns: 1fr; }
  .review-card__top { flex-direction: column; gap: 4px; }
}
</style>