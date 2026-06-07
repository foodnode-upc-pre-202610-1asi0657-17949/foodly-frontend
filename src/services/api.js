const BASE = {
    identity:  '/identity-api',
    business:  '/business-api',
    community: '/community-api',
}

const token = () => localStorage.getItem('foodly_token')

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token()}`
})

export const authApi = {
    login:    (data) => fetch(`${BASE.identity}/auth/login`,    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
    register: (data) => fetch(`${BASE.identity}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
}

export const businessApi = {
    getHuariques: ()      => fetch(`${BASE.business}/huariques`,          { headers: authHeaders() }).then(r => r.json()),
    getMenu:      (id)    => fetch(`${BASE.business}/huariques/${id}/menu`, { headers: authHeaders() }).then(r => r.json()),
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

