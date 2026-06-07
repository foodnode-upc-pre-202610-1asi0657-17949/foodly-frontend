<template>
  <div class="card" @click="$emit('click')">
    <div class="card__img">
      <img v-if="restaurant.image" :src="restaurant.image" :alt="restaurant.name" />
      <div v-else class="card__placeholder">{{ restaurant.name.charAt(0) }}</div>
    </div>
    <div class="card__footer">
      <div class="card__avatar">
        <span>{{ restaurant.name.charAt(0) }}</span>
      </div>
      <div class="card__info">
        <div class="card__top">
          <span class="card__name">{{ restaurant.name }}</span>
          <span class="card__rating">⭐ {{ restaurant.rating || '—' }}</span>
        </div>
        <div class="card__times">
          <span>🚶 {{ restaurant.walkMin || '?' }} min</span>
          <span class="card__sep">|</span>
          <span>🚗 {{ restaurant.driveMin || '?' }} min</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RestaurantCard',
  props: { restaurant: { type: Object, required: true } },
  emits: ['click']
}
</script>

<style scoped>
.card {
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 12px var(--color-card-shadow);
  background: #000;
  position: relative;
}
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px var(--color-card-shadow); }

.card__img {
  width: 100%;
  height: 200px;
  display: block;
  position: relative;
}
.card__img img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  border-radius: var(--radius-xl);
}
.card__placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: var(--color-tab-inactive);
  font-size: 3.5rem; font-weight: 800; color: var(--color-brand);
  border-radius: var(--radius-xl);
}

.card__footer {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.75));
  padding: 2rem 0.75rem 0.75rem;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}

.card__avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--color-brand);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; font-weight: 800; color: #fff;
  flex-shrink: 0;
  border: 2px solid #fff;
}

.card__info { flex: 1; }

.card__top {
  display: flex; align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.card__name {
  font-size: 0.88rem; font-weight: 700;
  color: #fff; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}

.card__rating {
  font-size: 0.8rem; font-weight: 700; color: #FFD700;
  flex-shrink: 0;
}

.card__times {
  font-size: 0.75rem; color: rgba(255,255,255,0.85);
  display: flex; gap: 6px; margin-top: 2px;
}

.card__sep { opacity: 0.5; }
</style>