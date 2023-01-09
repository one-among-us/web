<template>
    <Divider height="5px"/>
    <div id="title" class="fbox-vcenter unselectable" v-if="['Home', 'About'].includes(String($route.name))">
        <div id="title-txt">那些秋叶</div>
        <div id="title-sub">One Among Us</div>
    </div>

    <div id="nav" class="fbox-vcenter unselectable">
        <div>
            <router-link class="router-link" to="/">首页</router-link>
            <router-link class="router-link" to="/about">联系</router-link>
        </div>
    </div>

    <router-view id="router"/>

    <Divider height="5px"/>

    <LangButton/>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import Divider from "@/components/divider.vue";
import LangButton from "@/components/LangButton.vue";
import {info, logPrefixCss} from "@/logic/utils";
import {transColors} from "@/logic/constants";

@Options({components: {LangButton, Divider}})
export default class App extends Vue
{
    mounted()
    {
        info(`One Among Us - Web Frontend loaded`)
        console.log(`%c %c %c %c %c `,
            ...transColors.map(c => `background: ${c}; padding: 40px 20px;`)
        )
        console.log(`%c🐱%c 请不要用调试器做奇怪的事情 qwq\n%c(^ 这里有猫猫看着你哦)`,
            'font-size: 1.5em; background: #fdf6ec; color: #E6A23C;' + logPrefixCss,
            'font-size: 1.5em; color: #ff8373',
            'color: pink; line-height: 1.5em'
        )
    }
}
</script>

<!-- Global Style -->
<style lang="sass">
@import "css/animations"
@import "css/global"
@import "css/font"
@import "css/colors"
@import "css/markdown"

#app
    font-family: "Microsoft YaHei UI", Avenir, Helvetica, Arial, sans-serif
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
</style>

<!-- Scoped Style -->
<style lang="sass" scoped>
@import "css/colors"

// Title
#title
    background-color: $color-bg-5
    min-height: 250px

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

// Content
#router
    flex: 3
    padding: 20px 0 100px
    background-color: $color-bg-4

.router-link
    position: relative
    z-index: 100
</style>
