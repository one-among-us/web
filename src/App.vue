<template>
    <Divider height="5px"/>
    <div id="title" class="fbox-vcenter unselectable" v-if="$route.name !== 'Profile'">
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

<!-- Scoped Style -->
<style lang="sass" scoped>
// Title
#title
    background-color: #fff4eb
    min-height: 200px
    flex: 1

    #title-txt
        font-size: x-large

    #title-sub
        color: rgba(44, 62, 80, 0.68)

// Navigation bar
#nav
    background-color: #ffeedb
    min-height: 40px
    a
        text-decoration: none
        margin: 15px
        font-size: 15px
        color: #2c3e50

        &.router-link-exact-active
            color: #ff8373

// Content
#router
    flex: 3
    padding: 20px 20px 0
    background-color: #fffcf9
</style>

<!-- Global Style -->
<style lang="sass">
@import "css/animations"
@import "css/global"
@import "css/font"

#app
    font-family: Avenir, Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    text-align: center
    color: #2c3e50

    // Max width and center
    max-width: 900px
    margin: auto

    // Vertical flex box
    display: flex
    flex-flow: column
    height: 100vh
</style>
