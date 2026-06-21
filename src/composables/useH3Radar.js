import { computed } from 'vue'
import { latLngToCell, cellToBoundary } from 'h3-js'

// Resolución 9 de H3 ≈ celdas de ~170m de diámetro, buena para radio urbano
const H3_RESOLUTION = 9

export function useH3Radar(latitude, longitude) {
    const h3Index = computed(() => {
        if (latitude.value == null || longitude.value == null) return null
        return latLngToCell(latitude.value, longitude.value, H3_RESOLUTION)
    })

    // Devuelve el contorno del hexágono en formato [lng, lat] (el que usa Mapbox)
    const h3Boundary = computed(() => {
        if (!h3Index.value) return []
        return cellToBoundary(h3Index.value, true) // true = formato [lng, lat]
    })

    return { h3Index, h3Boundary }
}