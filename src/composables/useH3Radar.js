import { computed } from 'vue'
import { latLngToCell, cellToBoundary, gridDisk } from 'h3-js'

// Resolución 9 de H3 ≈ celdas de ~170m de diámetro, buena para radio urbano
const H3_RESOLUTION = 9

// Debe coincidir con el "kRingRadius" que geoRadarService.js envía al backend,
// para que los hexágonos pintados sean exactamente las celdas que se consultan en Redis.
const K_RING_RADIUS = 1

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

    // Anillo completo de celdas que el backend consulta en Redis (centro + vecinas)
    const kRingCells = computed(() => {
        if (!h3Index.value) return []
        return gridDisk(h3Index.value, K_RING_RADIUS)
    })

    // GeoJSON listo para pintar en Mapbox: un polígono por cada celda del k-ring.
    // Se recalcula solo, reactivamente, a partir de la posición del usuario —
    // no depende del zoom del mapa.
    const kRingGeojson = computed(() => ({
        type: 'FeatureCollection',
        features: kRingCells.value.map(cell => ({
            type: 'Feature',
            properties: { h3Index: cell, isCenter: cell === h3Index.value },
            geometry: {
                type: 'Polygon',
                coordinates: [cellToBoundary(cell, true)]
            }
        }))
    }))

    return { h3Index, h3Boundary, kRingCells, kRingGeojson }
}