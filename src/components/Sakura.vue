<script lang="ts">
import {Vue, Component, Prop} from 'vue-facing-decorator';

@Component({})
export default class Sakura extends Vue {
    @Prop({required: true}) count: number | string;

    spans = ""

    mounted() {
        for (let i = 0; i < parseInt(this.count.toString()); i++) {
            this.spans += `<span style="left: ${(i / parseFloat(this.count.toString())) * 100}%"></span>`;
        }
    }
}
</script>

<template>
    <div class="sakura-container">
        <div class="sakura" v-html="spans"/>
    </div>
</template>

<style lang="scss">
.sakura-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    pointer-events: none;

    .sakura {
        position: absolute;
        width: 100%;
        height: 100%;

        span {
            position: absolute;
            top: -10%;
            left: 0;
            width: 0.8vw;
            height: 0.4vw;
            border-radius: 5% 80% 10% 80%;
            background-color: #ffb6c1;

            &:nth-child(6n+1) {
                animation: sakura-anim-1 10s 0s linear infinite;
            }

            &:nth-child(6n+2) {
                animation: sakura-anim-2 10s 0s linear infinite;
            }

            &:nth-child(6n+3) {
                animation: sakura-anim-3 10s 0s linear infinite;
            }

            &:nth-child(6n+4) {
                animation: sakura-anim-4 10s 0s linear infinite;
            }

            &:nth-child(6n+5) {
                animation: sakura-anim-5 10s 0s linear infinite;
            }

            &:nth-child(6n+6) {
                animation: sakura-anim-6 10s 0s linear infinite;
            }

            &:nth-child(3n+1) {
                width: 1vw;
                height: 0.5vw;
            }

            &:nth-child(3n+2) {
                width: 0.8vw;
                height: 0.4vw;
            }

            &:nth-child(3n) {
                width: 0.6vw;
                height: 0.3vw;
            }

            &:nth-child(4n+1) {
                animation-duration: 5s;
            }

            &:nth-child(4n+2) {
                animation-duration: 12s;
            }

            &:nth-child(4n+3) {
                animation-duration: 8s;
            }

            &:nth-child(4n) {
                animation-duration: 6s;
            }

            &:nth-child(11n+1) {
                animation-delay: 0s;
            }

            &:nth-child(11n+2) {
                animation-delay: 9s;
            }

            &:nth-child(11n+3) {
                animation-delay: 2s;
            }

            &:nth-child(11n+4) {
                animation-delay: 5s;
            }

            &:nth-child(11n+5) {
                animation-delay: 6s;
            }

            &:nth-child(11n+6) {
                animation-delay: 7s;
            }

            &:nth-child(11n+7) {
                animation-delay: 3s;
            }

            &:nth-child(11n+8) {
                animation-delay: 1s;
            }

            &:nth-child(11n+9) {
                animation-delay: 2s;
            }

            &:nth-child(11n+10) {
                animation-delay: 11s;
            }

            &:nth-child(11n) {
                animation-delay: 10s;
            }
        }
    }
}

@keyframes sakura-anim-1 {
    0% {
        top: -10%;
        transform: translateX(0) rotateX(0) rotateY(0);
    }

    100% {
        top: 100%;
        transform: translateX(15vw) rotateX(180deg) rotateY(360deg);
    }
}

@keyframes sakura-anim-2 {
    0% {
        top: -10%;
        transform: translateX(0);
    }

    100% {
        top: 100%;
        transform: translateX(-15vw) rotateX(180deg) rotateY(360deg);
    }
}

@keyframes sakura-anim-3 {
    0% {
        top: -10%;
        transform: translateX(0);
    }

    100% {
        top: 100%;
        transform: translateX(25vw) rotateX(180deg) rotateY(360deg);
    }
}

@keyframes sakura-anim-4 {
    0% {
        top: -10%;
        transform: translateX(0);
    }

    100% {
        top: 100%;
        transform: translateX(-20vw) rotateX(360deg) rotateY(180deg);
    }
}

@keyframes sakura-anim-5 {
    0% {
        top: -10%;
        transform: translateX(0);
    }

    100% {
        top: 100%;
        transform: translateX(-25vw) rotateX(180deg) rotateY(360deg);
    }
}

@keyframes sakura-anim-6 {
    0% {
        top: -10%;
        transform: translateX(0);
    }

    100% {
        top: 100%;
        transform: translateX(21vw) rotateX(360deg) rotateY(180deg);
    }
}
</style>