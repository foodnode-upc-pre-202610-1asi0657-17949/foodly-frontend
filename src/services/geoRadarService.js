import { radarApi } from '@/services/api.js'


function distanceInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000 // radio de la Tierra en metros
    const toRad = (deg) => (deg * Math.PI) / 180

    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

export const geoRadarService = {
    /**
     * Trae los huariques desde REDIS (vía H3) y calcula los metros exactos
     */
    async getNearbyHuariques(userLat, userLng) {
        // 1. LLAMADA AL MICROSERVICIO DE RADAR (REDIS)
        // Ya no descargamos la BD entera. Solo enviamos coordenadas.
        const response = await radarApi.post('/radar/search', {
            latitude: userLat,
            longitude: userLng,
            kRingRadius: 1 // 1 anillo de hexágonos a la redonda
        });

        const huariquesEnMiZona = response.data; // Dependiendo de Axios, podría ser data.data

        if (!Array.isArray(huariquesEnMiZona)) return [];

        // 2. ORDENAMIENTO FINO (Frontend)
        // Aplicamos Haversine solo a los pocos locales devueltos por la caché
        return huariquesEnMiZona
            .filter(h => h.latitude != null && h.longitude != null)
            .map(h => ({
                ...h,
                distanceMeters: Math.round(
                    distanceInMeters(userLat, userLng, h.latitude, h.longitude)
                )
            }))
            .sort((a, b) => a.distanceMeters - b.distanceMeters)
    }
}