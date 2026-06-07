import { createRouter, createWebHistory } from 'vue-router'
import LoginView    from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import ExploreView  from '../views/explorer/ExploreView.vue'
import FavoritesView from '../views/explorer/FavoritesView.vue'
import ProfileView  from '../views/explorer/ProfileView.vue'



const routes = [
    { path: '/',         redirect: '/login' },
    { path: '/login',    name: 'Login',    component: LoginView },
    { path: '/register', name: 'Register', component: RegisterView },
    { path: '/explorar', name: 'Explore',  component: ExploreView },

    { path: '/radar',     name: 'Radar',     component: () => import('../views/explorer/ExploreView.vue') },
    { path: '/favoritos', name: 'Favorites', component: () => import('../views/explorer/ExploreView.vue') },
    { path: '/perfil',    name: 'Profile',   component: () => import('../views/explorer/ExploreView.vue') },

    { path: '/:pathMatch(.*)*', redirect: '/login' },
    { path: '/favoritos', name: 'Favorites', component: FavoritesView },
    { path: '/perfil', name: 'Profile', component: ProfileView }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const pub = ['Login', 'Register']
    const token = localStorage.getItem('foodly_token')
    if (!pub.includes(to.name) && !token) next({ name: 'Login' })
    else next()
})

export default router