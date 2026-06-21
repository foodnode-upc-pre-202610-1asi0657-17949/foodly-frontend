import { businessApi } from './api'

export const menuService = {
    async getMyMenu() {
        const { ok, status, data } = await businessApi.getMyRestaurant()
        if (ok) return { exists: true, huariqueId: data.id, products: data.menu?.products || [], categories: data.menu?.categories || [] }
        if (status === 404) return { exists: false, huariqueId: null, products: [], categories: [] }
        throw new Error(data?.message || 'No se pudo cargar el menú')
    },

    async saveMenu(huariqueId, products, categories) {
        const { ok, data } = await businessApi.updateMenu(huariqueId, {
            products,
            categories
        })
        if (!ok) throw new Error(data?.message || 'No se pudo guardar el menú')
        return data
    }
}