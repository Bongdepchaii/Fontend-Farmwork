import { createWebHistory, createRouter } from 'vue-router'

import NotFound from './components/NotFound.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Profile from './Lab1.vue'
import Product from './components/product.vue'
import ProductDetail from './components/Product-Detail.vue'
import Index from './components/Index.vue'
import Category from './components/Category.vue'
import Userdetail from './components/Userdetail.vue'
import Store from './components/Cart.vue'
import User from './components/User.vue'
import HistoryOrder from './components/HistoryOrder.vue'

const routes = [
    { path: '/', name: 'Home', component: Index, meta: { isAuth: false } },
    { path: '/profile', name: 'Profile', component: Profile, meta: { isAuth: false } },
    { path: '/register', name: 'Register', component: Register, meta: { isAuth: false } },
    { path: '/login', name: 'Login', component: Login, meta: { isAuth: false } },
    { path: '/product', name: 'Product', component: Product, meta: { isAuth: false } },
    { path: '/category', name: 'Category', component: Category, meta: { isAuth: false } },
    { path: '/product-detail/:id', name: 'ProductDetail', component: ProductDetail, meta: { isAuth: false } },
    { path: '/index', name: 'Index', component: Index, meta: { isAuth: false } },
    { path: '/userdetail/:id', name: 'Userdetail', component: Userdetail, meta: { isAuth: false } },
    { path: '/store', name: 'Store', component: Store, meta: { isAuth: false } },
    { path: '/user', name: 'User', component: User, meta: { isAuth: false } },
    { path: '/historyorder', name: 'HistoryOrder', component: HistoryOrder, meta: { isAuth: false } },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
        meta: { isAuth: true }
    },
]
const router = createRouter({
    history: createWebHistory(''),
    routes
})
/**
 * check permission
 * 
 */
router.beforeEach((to, from, next) => {
    const currentUser = localStorage.getItem('userlogin');
    if (to.meta.isAuth && currentUser) {
        const user = JSON.parse(currentUser)
        console.log('user', user)
        if (!user.role)
            next({ name: 'Login' });
    } else {
        next();
    }
    // next()
})

export default router