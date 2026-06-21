import { ref } from 'vue'
import { geoRadarService } from '@/services/geoRadarService.js'

const huariques = ref([])
const loading = ref(false)
const error = ref(null)

export function useRadarStore() {

    async function loadNearbyHuariques(lat, lng) {
        loading.value = true
        error.value = null
        try {
            huariques.value = await geoRadarService.getNearbyHuariques(lat, lng)
        } catch (e) {
            error.value = 'No se pudieron cargar los huariques cercanos.'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    return { huariques, loading, error, loadNearbyHuariques }
}