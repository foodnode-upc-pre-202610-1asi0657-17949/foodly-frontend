import { ref, onUnmounted } from 'vue'

export function useGeolocation() {
    const latitude = ref(null)
    const longitude = ref(null)
    const error = ref(null)
    const loading = ref(true)
    let watchId = null

    function startWatching() {
        loading.value = true
        error.value = null

        if (!navigator.geolocation) {
            error.value = 'Tu navegador no soporta geolocalización.'
            loading.value = false
            return
        }

        watchId = navigator.geolocation.watchPosition(
            (position) => {
                latitude.value = position.coords.latitude
                longitude.value = position.coords.longitude
                error.value = null
                loading.value = false
            },
            (err) => {
                error.value = 'No se pudo obtener tu ubicación. Activa el GPS o dale permiso al navegador.'
                loading.value = false
                console.error(err)
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        )
    }

    function stopWatching() {
        if (watchId != null) {
            navigator.geolocation.clearWatch(watchId)
            watchId = null
        }
    }

    startWatching()
    onUnmounted(stopWatching)

    return { latitude, longitude, error, loading, refresh: startWatching }
}