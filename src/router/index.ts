import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

/**
 * NOTICE: WHEN YOU CHANGE ROUTES, PLEASE ALSO CHANGE tools/gen_meta.ts
 */
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import("../views/Home.vue")
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')
    },
    {
        path: '/profile/:userid/en',
        name: 'Profile_En',
        component: () => import("../views/Profile.vue"),
        props: route => Object.assign({}, route.params, {en: true})
    },
    {
        path: '/profile/:userid',
        alias: '/p/:userid',
        name: 'Profile',
        component: () => import("../views/Profile.vue"),
        props: true
    },
    {
        path: '/profile/:userid/backup/:backup',
        alias: '/p/:userid/b/:backup',
        name: 'Channel Backup',
        component: () => import("../views/ChannelBackup.vue"),
        props: true
    },
    {
        path: '/edit-info/:userid',
        name: 'EditInfo',
        component: () => import("../views/EditInfo.vue"),
        props: true
    },
    {
        path: '/__screenshot',
        component: () => import("../views/Profile.vue"),
        props: route => ({ userid: route.query.p, screenshotMode: true })
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import("../views/FourOhFour.vue")
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,

    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition
        if (to.hash) return { selector: to.hash }
        return { top: 0 }
    }
})

export default router
