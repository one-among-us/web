<template>
    <div id="title">
    </div>

    <div id="nav">
        <router-link to="/">Home</router-link>
        |
        <router-link to="/about">About</router-link>
    </div>
    <router-view/>
</template>

<style lang="sass">
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
    height: 100px

#nav
    a
        font-weight: bold
        color: #2c3e50

        &.router-link-exact-active
            color: #42b983
</style>
