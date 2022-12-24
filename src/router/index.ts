import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import("../views/Home.vue")
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/About.vue')
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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,

    // @ts-ignore Automatically scroll to top
    scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) return savedPosition
        else if (to.hash) return {selector: to.hash}
        else return {x: 0, y: 0}
    }
})

export default router
