<template>
    <Divider height="5px"/>
    <div id="title" class="fbox-vcenter unselectable" v-if="['Home', 'About'].includes(String($route.name))">
        <div id="title-txt" v-if="!uwu">那些秋叶</div>
        <div id="title-sub" v-if="!uwu">One Among Us</div>
        <img src="/kawaii.oau.png" class="kawaii" v-if="uwu"/>
    </div>

    <div id="nav" class="fbox-vcenter unselectable">
        <div>
            <router-link class="router-link" to="/">{{ t.nav_home }}</router-link>
            <router-link class="router-link" to="/about">{{ t.nav_contact }}</router-link>
        </div>
    </div>

    <router-view id="router"/>

    <Divider height="5px"/>

    <GlobalButton/>
    <Sakura :count="50" v-if="(isEaster() && (gaussian() < 0.36)) || isTdorPeriod()"/>
    <Fireworks :count="6" v-if="isEaster() && isTd() && (getTheme() == 'dark')"/>
</template>

<script lang="ts">
import GlobalButton from "@/components/buttons/GlobalButton.vue";
import Divider from "@/components/divider.vue";
import Sakura from "@/components/Sakura.vue";
import Fireworks from "@/components/Fireworks.vue";
import {transColors} from "@/logic/constants";
import {isEaster} from "@/logic/easterEgg";
import {gaussian, isTd, isTdorPeriod} from "@/logic/helper";
import {applyTheme, getTheme} from "@/logic/theme";
import {info, logPrefixCss} from "@/logic/utils";
import {isUwU} from "@/logic/uwu";
import {Component, Vue} from 'vue-facing-decorator';
import {getLang, t} from './logic/config';

@Component({
    components: { GlobalButton, Divider, Sakura, Fireworks }
})
export default class App extends Vue {
    $route: any
    t = t

    uwu = isUwU()

    isEaster = isEaster
    gaussian = gaussian
    getTheme = getTheme
    isTd = isTd
    isTdorPeriod = isTdorPeriod

    created(): void {
        if (!localStorage.getItem('showBtn'))
            localStorage.setItem('showBtn', '1')
    }

    mounted() {
        info(`One Among Us - Web Frontend loaded`)
        console.log(`%c %c %c %c %c `,
            ...transColors.map(c => `background: ${c}; padding: 40px 20px;`)
        )
        console.log(`%c🐱%c 请不要用调试器做奇怪的事情 qwq\n%c(^ 这里有猫猫看着你哦)`,
            'font-size: 1.5em; background: #fdf6ec; color: #E6A23C;' + logPrefixCss,
            'font-size: 1.5em; color: #ff8373',
            'color: pink; line-height: 1.5em'
        )

        document.getElementById("app").dataset.lang = getLang()
        applyTheme()
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            applyTheme();
        })
    }

    updated() {
        if (this.uwu) document.getElementById("title").style.minHeight = "300px"
    }
}
</script>

<!-- Global Style -->
<style lang="sass">
@use "@/css/animations"
@use "@/css/global" as *
@use "@/css/fonts/BackIcon.css"
@use "@/css/markdown"

*
    transition: all 0.25s cubic-bezier(0.35, 0, 0.72, 0.22)

#app
    font-family: $font
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    text-align: center
    color: $color-text-main

    // Max width and center
    max-width: 900px
    margin: auto

    // Vertical flex box
    display: flex
    flex-flow: column
    height: 100vh

    &[data-lang="en"]
        font-family: $font-en

[data-theme="dark"]
    body
        background: #181825

    #app
        color: $color-text-dark-main
</style>

<!-- Scoped Style -->
<style lang="sass" scoped>
@use "@/css/colors" as *

// Title
#title
    background-color: $color-bg-5
    min-height: 250px
    height: fit-content

    #title-txt
        font-size: x-large

    #title-sub
        color: $color-text-light

// Navigation bar
#nav
    background-color: $color-bg-6
    min-height: 40px

    a
        text-decoration: none
        margin: 15px
        font-size: 15px
        color: $color-text-main

        &.router-link-exact-active
            color: $color-text-special

.kawaii
    width: 100%
    height: 300px
    margin: auto
    object-fit: contain

// Content
#router
    flex: 3
    padding: 20px 0 350px
    background-color: $color-bg-4

.router-link
    position: relative
    z-index: 100

[data-theme="dark"]
    #title
        background-color: $color-bg-dark-5

        #title-sub
            color: $color-text-dark-light

    #nav
        background-color: $color-bg-dark-6

        a
            color: $color-text-dark-main

            &.router-link-exact-active
                color: $color-text-dark-special

    #router
        background-color: $color-bg-dark-4
</style>
