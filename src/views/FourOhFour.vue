<template>
    <div class="four-oh-four unselectable">
        <div class="top"></div>
        <div class="title">404</div>
        <div class="sub">这个页面不见了</div>
        <div class="click"><a href="javascript:history.back()">返回</a></div>
        <div class="bottom"></div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';

@Component({ components: {} })
export default class FourOhFour extends Vue {
    mounted() {
        if (window.gtag) {
            console.log("Reporting error...")
            window.gtag('event', 'exception', {
                'description': `404 Not Found: ${window.location.href}`
            });
        }
    }
}
</script>

<style lang="sass" scoped>
@use "@/css/colors" as *

.four-oh-four
    display: flex
    flex-direction: column
    gap: 5px

    .top
        flex-grow: 1

    .title
        font-size: min(15em, 40vw)
        color: transparent
        background-color: rgb(188 140 68 / 50%)
        -webkit-background-clip: text
        text-shadow: rgba(255, 255, 255, 0.5) 0 5px 6px

    .sub, .click
        color: $color-text-light
        font-size: 1.2em

        a
            color: $color-text-special
            text-decoration: none

    .bottom
        flex-grow: 2

</style>
