<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        style="margin: auto; background: transparent; display: block"
        width="150px"
        height="150px"
        viewBox="0 0 66 66"
        preserveAspectRatio="xMidYMid"
        class="rotating"
        aria-hidden="true"
    >
        <circle
            class="path"
            cx="33"
            cy="33"
            r="30"
            stroke-width="4"
            stroke="#70512a"
            stroke-dasharray="50.26548245743669 50.26548245743669"
            fill="none"
            stroke-linecap="round"
        ></circle>
    </svg>
    <div v-text="getText()" class="loadingMessage"/>
</template>

<script lang="ts">
import {t} from '@/logic/config';
import {Component, Vue} from 'vue-facing-decorator';

@Component({})
export default class Loading extends Vue {
    getText() {
        if (!localStorage.getItem('easterEggMode')) return t.loading.loading;
        if (parseInt(localStorage.getItem('easterEggMode')) == 0) return t.loading.loading;
        return t.loading.easter[(Math.random() * t.loading.easter.length) | 0]
    }
}
</script>

<style lang="scss">
@-webkit-keyframes rotating /* Safari and Chrome */
{
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
    -webkit-animation: rotating 1.2s linear infinite;
    -moz-animation: rotating 1.2s linear infinite;
    -ms-animation: rotating 1.2s linear infinite;
    -o-animation: rotating 1.2s linear infinite;
    animation: rotating 1.2s linear infinite;
    padding: 20px;
}

@-webkit-keyframes dash {
    0% {
        stroke-dashoffset: 187;
    }
    50% {
        stroke-dashoffset: 46.75;
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        stroke-dashoffset: 187;
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@keyframes dash {
    0% {
        stroke-dashoffset: 187;
    }
    50% {
        stroke-dashoffset: 46.75;
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        stroke-dashoffset: 187;
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

.path {
    stroke-dasharray: 187;
    stroke-dashoffset: 0;
    -webkit-transform-origin: center;
    -ms-transform-origin: center;
    transform-origin: center;
    -webkit-animation: dash 1.4s ease-in-out infinite;
    animation: dash 1.4s ease-in-out infinite;
}

.loadingMessage {
    font-size: 1.5em;
    margin-top: 1em;
    text-align: center;
    color: rgba(166, 134, 89, 0.84);
}

[data-theme="dark"] {
    .loadingMessage {
        color: rgba(255, 235, 194, 0.84)
    }

    .path {
        color: hsl(20, 71%, 80%);
        stroke: hsl(20, 71%, 80%)
    }
}
</style>
