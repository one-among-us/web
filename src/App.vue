<template>
    <div id="title" class="fbox-vcenter">
        <div id="title-txt">一个标题</div>
        <div id="title-sub">这是一些副标题</div>
    </div>

    <Divider height="5px"/>

    <div id="nav">
        <router-link to="/">Home</router-link>
        |
        <router-link to="/about">About</router-link>
    </div>

    <router-view/>
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

#title
    background-color: #ffeddb
    height: 200px

    #title-txt
        font-size: x-large

    #title-sub
        color: rgba(44, 62, 80, 0.68)

#nav
    a
        font-weight: bold
        color: #2c3e50

        &.router-link-exact-active
            color: #42b983
</style>
