import { createRouter, createWebHistory } from 'vue-router'
import LoginView    from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import ExploreView  from '../views/explorer/ExploreView.vue'
import RadarView from '../views/explorer/RadarView.vue'
import FavoritesView from '../views/explorer/FavoritesView.vue'
import ProfileView  from '../views/explorer/ProfileView.vue'
import OwnerDashboard from '../views/owner/OwnerDashboard.vue'
import OwnerProfileView from '../views/owner/OwnerProfileView.vue'
import MenuManagerView from '../views/owner/MenuManagerView.vue'
import MenuEditView from '../views/owner/MenuEditView.vue'
import OwnerReviewsView from '../views/owner/OwnerReviewsView.vue'

const routes = [
    { path: '/',         redirect: '/login' },
    { path: '/login',    name: 'Login',    component: LoginView },
    { path: '/register', name: 'Register', component: RegisterView },
    { path: '/explorar', name: 'Explore',  component: ExploreView },
    { path: '/dashboard', name: 'Dashboard', component: OwnerDashboard },

    { path: '/radar',     name: 'Radar',     component: RadarView },
    { path: '/favoritos', name: 'Favorites', component: () => import('../views/explorer/ExploreView.vue') },
    { path: '/perfil',    name: 'Profile',   component: () => import('../views/explorer/ExploreView.vue') },

    { path: '/owner-perfil', name: 'OwnerProfile', component: OwnerProfileView },
    { path: '/mi-menu', name: 'MenuManager', component: MenuManagerView },
    { path: '/mi-menu/nuevo', name: 'MenuCreate', component: MenuEditView },
    { path: '/mi-menu/editar/:id', name: 'MenuEdit', component: MenuEditView, props: true },
    { path: '/resenas', name: 'Reviews', component: OwnerReviewsView },

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