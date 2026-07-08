<template>
  <div class="radar-map">
    <div class="radar-map__status" v-if="statusMessage">
      <span class="radar-map__status-dot" :class="{ 'radar-map__status-dot--loading': loading }"></span>
      {{ statusMessage }}
    </div>

    <div ref="mapContainer" class="radar-map__canvas"></div>

    <button class="radar-map__theme-btn" @click="toggleTheme">
      {{ isDarkMode ? '☀️' : '🌙' }}
    </button>

    <div v-if="routeInfo" class="radar-map__route-info">
      <div class="radar-map__mode-toggle">
        <button
            class="radar-map__mode-btn"
            :class="{ 'radar-map__mode-btn--active': travelMode === 'walking' }"
            @click="travelMode = 'walking'"
        >🚶</button>
        <button
            class="radar-map__mode-btn"
            :class="{ 'radar-map__mode-btn--active': travelMode === 'driving' }"
            @click="travelMode = 'driving'"
        >🚗</button>
      </div>
      <span>{{ routeInfo.distanceKm }} km — {{ routeInfo.durationMin }} min</span>
    </div>

    <button class="radar-map__locate-btn" @click="centerOnUser" :disabled="!userLat">
      <span class="radar-map__locate-dot"></span>
      Centrar en mi ubicación
    </button>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default {
  name: 'RadarMapViewer',
  props: {
    userLat: { type: Number, default: null },
    userLng: { type: Number, default: null },
    huariques: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    selectedHuariqueId: { type: String, default: null },
    h3Geojson: {
      type: Object,
      default: () => ({ type: 'FeatureCollection', features: [] })
    }
  },
  emits: ['select-huarique'],

  data() {
    return {
      map: null,
      userMarker: null,
      huariqueMarkers: [],
      isDarkMode: false,
      travelMode: 'walking', // 'walking' | 'driving'
      routeInfo: null // { distanceKm, durationMin }
    }
  },

  computed: {
    statusMessage() {
      if (this.loading) return 'Actualizando...'
      if (!this.userLat) return 'Esperando tu ubicación...'
      return null
    }
  },

  watch: {
    huariques: {
      handler() {
        this.renderHuariqueMarkers()
      },
      deep: true
    },
    userLat(newVal) {
      if (newVal != null) {
        this.initMapIfNeeded()
        this.renderUserMarker()
      }
    },
    h3Geojson: {
      handler() {
        this.renderH3Cells()
      },
      deep: true
    },
    selectedHuariqueId(newId) {
      if (newId) {
        this.drawRoute()
      } else {
        this.clearRoute()
      }
    },
    travelMode() {
      if (this.selectedHuariqueId) this.drawRoute()
    }
  },

  mounted() {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
    if (this.userLat != null) {
      this.initMapIfNeeded()
    }
  },

  beforeUnmount() {
    if (this.map) this.map.remove()
  },

  methods: {
    initMapIfNeeded() {
      if (this.map) return

      this.map = new mapboxgl.Map({
        container: this.$refs.mapContainer,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [this.userLng, this.userLat],
        zoom: 15
      })

      this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

      this.map.on('load', () => {
        this.renderUserMarker()
        this.renderHuariqueMarkers()
        this.renderH3Cells()
      })
    },

    renderH3Cells() {
      if (!this.map || !this.map.isStyleLoaded()) return

      const data = this.h3Geojson || { type: 'FeatureCollection', features: [] }

      const source = this.map.getSource('h3-cells')
      if (source) {
        source.setData(data)
        return
      }

      this.map.addSource('h3-cells', { type: 'geojson', data })

      this.map.addLayer({
        id: 'h3-cells-fill',
        type: 'fill',
        source: 'h3-cells',
        paint: {
          // La celda central (donde estás parado) resalta un poco más que las vecinas
          'fill-color': ['case', ['get', 'isCenter'], '#4285f4', '#00c88c'],
          'fill-opacity': ['case', ['get', 'isCenter'], 0.18, 0.08]
        }
      })

      this.map.addLayer({
        id: 'h3-cells-outline',
        type: 'line',
        source: 'h3-cells',
        paint: {
          'line-color': ['case', ['get', 'isCenter'], '#4285f4', '#00c88c'],
          'line-width': 1.5,
          'line-opacity': 0.6
        }
      })
    },

    renderUserMarker() {
      if (!this.map || this.userLat == null) return

      if (this.userMarker) {
        this.userMarker.setLngLat([this.userLng, this.userLat])
        return
      }

      const el = document.createElement('div')
      el.className = 'radar-map__user-pin'

      this.userMarker = new mapboxgl.Marker({ element: el })
          .setLngLat([this.userLng, this.userLat])
          .addTo(this.map)
    },

    renderHuariqueMarkers() {
      if (!this.map) return

      this.huariqueMarkers.forEach(m => m.remove())
      this.huariqueMarkers = []

      this.huariques.forEach(h => {
        if (h.latitude == null || h.longitude == null) return

        const el = document.createElement('div')
        el.className = 'radar-map__huarique-pin'
        el.innerText = h.name.charAt(0)
        el.addEventListener('click', () => this.$emit('select-huarique', h.id))

        const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([h.longitude, h.latitude])
            .addTo(this.map)

        this.huariqueMarkers.push(marker)
      })
    },

    centerOnUser() {
      if (!this.map || this.userLat == null) return
      this.map.flyTo({ center: [this.userLng, this.userLat], zoom: 16 })
    },

    toggleTheme() {
      if (!this.map) return
      this.isDarkMode = !this.isDarkMode
      this.map.setStyle(
          this.isDarkMode
              ? 'mapbox://styles/mapbox/dark-v11'
              : 'mapbox://styles/mapbox/light-v11'
      )
      this.map.once('style.load', () => {
        this.renderUserMarker()
        this.renderHuariqueMarkers()
        this.renderH3Cells()
        if (this.selectedHuariqueId) this.drawRoute()
      })
    },

    async drawRoute() {
      const target = this.huariques.find(h => h.id === this.selectedHuariqueId)
      if (!target || this.userLat == null || !this.map) return

      const profile = this.travelMode === 'walking' ? 'walking' : 'driving'
      const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/` +
          `${this.userLng},${this.userLat};${target.longitude},${target.latitude}` +
          `?geometries=geojson&access_token=${mapboxgl.accessToken}`

      try {
        const res = await fetch(url)
        const data = await res.json()
        const route = data.routes?.[0]
        if (!route) return

        this.routeInfo = {
          distanceKm: (route.distance / 1000).toFixed(1),
          durationMin: Math.round(route.duration / 60)
        }

        const geojson = {
          type: 'Feature',
          properties: {},
          geometry: route.geometry
        }

        if (this.map.getSource('route')) {
          this.map.getSource('route').setData(geojson)
        } else {
          this.map.addSource('route', { type: 'geojson', data: geojson })
          this.map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': '#c2500a',
              'line-width': 5,
              'line-opacity': 0.85
            }
          })
        }

        // Ajusta el zoom para que se vea todo el recorrido
        const coords = route.geometry.coordinates
        const bounds = coords.reduce(
            (b, c) => b.extend(c),
            new mapboxgl.LngLatBounds(coords[0], coords[0])
        )
        this.map.fitBounds(bounds, { padding: 60 })

      } catch (e) {
        console.error('Error calculando ruta', e)
      }
    },

    clearRoute() {
      this.routeInfo = null
      if (this.map?.getLayer('route')) this.map.removeLayer('route')
      if (this.map?.getSource('route')) this.map.removeSource('route')
    }


  }
}
</script>

<style scoped>
.radar-map {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.radar-map__canvas {
  width: 100%;
  height: 100%;
}

.radar-map__status {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 5;
  background: rgba(255, 255, 255, 0.92);
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-label);
  display: flex;
  align-items: center;
  gap: 6px;
}

.radar-map__status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-brand);
}

.radar-map__status-dot--loading {
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.radar-map__locate-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 5;
  background: #fff;
  border: none;
  border-radius: var(--radius-pill);
  padding: 10px 18px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-label);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}

.radar-map__locate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.radar-map__locate-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-brand);
}

:global(.radar-map__user-pin) {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4285f4;
  border: 3px solid #fff;
  box-shadow: 0 0 0 4px rgba(66, 133, 244, 0.3);
}

:global(.radar-map__huarique-pin) {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-brand);
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
}

.radar-map__theme-btn {
  position: absolute;
  top: 14px;
  right: 60px;
  z-index: 5;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.radar-map__route-info {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  background: #fff;
  border-radius: var(--radius-pill);
  padding: 6px 16px 6px 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-label);
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}

.radar-map__mode-toggle {
  display: flex;
  gap: 4px;
  background: var(--color-tab-inactive);
  border-radius: var(--radius-pill);
  padding: 3px;
}

.radar-map__mode-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: transparent;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: all 0.15s;
}

.radar-map__mode-btn--active {
  background: var(--color-brand);
  opacity: 1;
}
</style>