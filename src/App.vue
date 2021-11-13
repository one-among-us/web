<template>
    <Divider height="5px"/>
    <div id="title" class="fbox-vcenter unselectable" v-if="['Home', 'About'].includes($route.name)">
        <div id="title-txt">一个标题</div>
        <div id="title-sub">这是一些副标题</div>
    </div>

    <div id="nav" class="fbox-vcenter unselectable">
        <div>
            <router-link to="/">首页</router-link>
            <router-link to="/about">关于</router-link>
        </div>
    </div>

    <router-view id="router"/>
    <Divider height="5px"/>
</template>

<script>
import {Options, Vue} from 'vue-class-component';
import Divider from "@/components/divider";

@Options({components: {Divider}})
export default class App extends Vue
{
}
</script>

<!-- Global Style -->
<style lang="sass">
@import "css/animations"
@import "css/global"
@import "css/font"
@import "css/colors"

#app
    font-family: Avenir, Helvetica, Arial, sans-serif
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
    min-height: 200px
    flex: 1

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
    padding-top: 20px
    background-color: $color-bg-4
</style>
