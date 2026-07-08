import axios from 'axios';

const BASE = {
    identity:  '/identity-api/api',
    business:  '/business-api/api',
    community: '/community-api/api',
}

const token = () => localStorage.getItem('foodly_token')

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token()}`
})

/**
 * Helper para llamadas autenticadas que necesitan distinguir status code
 * (ej. 404 = "todavía no existe", a diferencia de un error real).
 * Devuelve { ok, status, data }.
 */
async function authFetch(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: { ...authHeaders(), ...(options.headers || {}) }
    })
    let data = null
    try { data = await res.json() } catch (_) { /* respuesta sin body */ }
    return { ok: res.ok, status: res.status, data }
}

export const authApi = {
    login:    (data) => fetch(`${BASE.identity}/auth/login`,    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
    register: (data) => fetch(`${BASE.identity}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
}

export const businessApi = {
    getHuariques: ()      => fetch(`${BASE.business}/huariques`,          { headers: authHeaders() }).then(r => r.json()),
    getMenu:      (id)    => fetch(`${BASE.business}/huariques/${id}/menu`, { headers: authHeaders() }).then(r => r.json()),
    updateMenu:   (id, menu) => authFetch(`${BASE.business}/huariques/${id}/menu`, { method: 'PUT', body: JSON.stringify({ menu }) }),

    // Endpoints del dueño (requieren rol HUARIQUE_ADMIN)
    getMyRestaurant:    ()     => authFetch(`${BASE.business}/huariques/me`),
    createRestaurant:   (data) => authFetch(`${BASE.business}/huariques`,    { method: 'POST', body: JSON.stringify(data) }),
    updateMyRestaurant: (data) => authFetch(`${BASE.business}/huariques/me`, { method: 'PUT',  body: JSON.stringify(data) }),
}

export const communityApi = {
    getReviews:     (id)       => fetch(`${BASE.community}/community/huariques/${id}/reviews`, { headers: authHeaders() }).then(r => r.json()),
    addReview:      (id, data) => fetch(`${BASE.community}/community/huariques/${id}/reviews`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
    getMyFavorites: ()         => fetch(`${BASE.community}/community/favorites/me`,            { headers: authHeaders() }).then(r => r.json()),
    addFavorite:    (id)       => fetch(`${BASE.community}/community/favorites/${id}`,         { method: 'POST', headers: authHeaders() }),
    removeFavorite: (id)       => fetch(`${BASE.community}/community/favorites/${id}`,         { method: 'DELETE', headers: authHeaders() }),
}

export const userApi = {
    getProfile: () => fetch(`${BASE.identity}/users/me`, { headers: authHeaders() }).then(r => r.json()),
}

export const radarApi = {
    post: (url, data) => axios.post(
        `/radar-api/api${url}`,
        data,
        { headers: authHeaders() }
    )
}