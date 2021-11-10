<template>
    <div id="title">
        <div id="title-container" class="fbox-vcenter">
            <div id="title-txt">一个标题</div>
            <div id="title-sub">这是一些副标题</div>
        </div>

        <div id="nav" class="fbox-vcenter">
            <div>
                <router-link to="/">首页</router-link>
                <router-link to="/about">关于</router-link>
            </div>
        </div>
    </div>

    <Divider height="5px"/>

    <router-view id="router"/>
</template>

<script>
import {Options, Vue} from 'vue-class-component';
import Divider from "@/components/divider";

@Options({components: {Divider}})
export default class App extends Vue
{
}
</script>

<style lang="sass">
@import "css/animations"
@import "css/global"

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

#title-container
    background-color: #fff4eb
    height: 200px

    #title-txt
        font-size: x-large

    #title-sub
        color: rgba(44, 62, 80, 0.68)

#nav
    background-color: #ffeedb
    height: 40px
    a
        text-decoration: none
        margin: 15px
        font-size: 15px


        &.router-link-exact-active
            color: #ff8373

#router
    flex: 1
</style>
