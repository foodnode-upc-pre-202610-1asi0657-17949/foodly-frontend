import { businessApi } from './api'

/**
 * Servicio del huarique del dueño autenticado.
 * Envuelve businessApi con una interfaz más simple para las vistas owner.
 */
export const restaurantService = {
    /**
     * Obtiene el huarique del dueño logueado.
     * Devuelve { exists: true, data } si ya tiene un local,
     * o { exists: false } si todavía no ha creado uno (404 esperado).
     */
    async getMyRestaurant() {
        const { ok, status, data } = await businessApi.getMyRestaurant()
        if (ok) return { exists: true, data }
        if (status === 404) return { exists: false, data: null }
        throw new Error(data?.message || 'No se pudo cargar tu local')
    },

    async createRestaurant(payload) {
        const { ok, data } = await businessApi.createRestaurant(payload)
        if (!ok) throw new Error(data?.message || 'No se pudo crear el local')
        return data
    },

    async updateMyRestaurant(payload) {
        const { ok, data } = await businessApi.updateMyRestaurant(payload)
        if (!ok) throw new Error(data?.message || 'No se pudo actualizar el local')
        return data
    }
}

export default restaurantService