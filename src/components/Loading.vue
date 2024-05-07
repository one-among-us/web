<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        style="margin: auto; background: transparent; display: block"
        width="200px"
        height="200px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        class="rotating"
    >
        <circle
            cx="50"
            cy="50"
            r="32"
            stroke-width="8"
            stroke="#70512a"
            stroke-dasharray="50.26548245743669 50.26548245743669"
            fill="none"
            stroke-linecap="round"
        ></circle>
    </svg>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';

@Component({})
export default class Loading extends Vue {}
</script>

<style lang="scss">
@-webkit-keyframes rotating /* Safari and Chrome */ {
    from {
        -webkit-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    to {
        -webkit-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
@keyframes rotating {
    from {
        -ms-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    to {
        -ms-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
.rotating {
    -webkit-animation: rotating 1.5s linear infinite;
    -moz-animation: rotating 1.5s linear infinite;
    -ms-animation: rotating 1.5s linear infinite;
    -o-animation: rotating 1.5s linear infinite;
    animation: rotating 1.5s linear infinite;
}
</style>
