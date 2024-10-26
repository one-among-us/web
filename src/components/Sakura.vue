<script lang="ts">
import {Vue, Component, Prop} from 'vue-facing-decorator';

@Component({})
export default class Sakura extends Vue {
    @Prop({required: true}) count: number | string;

    spans = ""

    mounted() {
        for (let i = 0; i < parseInt(this.count.toString()); i++) {
            this.spans += "<span></span>";
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


            &:nth-child(2n+1) {
                animation: sakura-anim-1 10s 0s linear infinite;
            }

            &:nth-child(2n+2) {
                animation: sakura-anim-2 10s 0s linear infinite;
            }

            &:nth-child(1) {
                left: 0;
            }

            &:nth-child(2) {
                left: 2%;
            }

            &:nth-child(3) {
                left: 4%;
            }

            &:nth-child(4) {
                left: 6%;
            }

            &:nth-child(5) {
                left: 8%;
            }

            &:nth-child(6) {
                left: 10%;
            }

            &:nth-child(7) {
                left: 12%;
            }

            &:nth-child(8) {
                left: 14%;
            }

            &:nth-child(9) {
                left: 16%;
            }

            &:nth-child(10) {
                left: 18%;
            }

            &:nth-child(11) {
                left: 20%;
            }

            &:nth-child(12) {
                left: 22%;
            }

            &:nth-child(13) {
                left: 24%;
            }

            &:nth-child(14) {
                left: 26%;
            }

            &:nth-child(15) {
                left: 28%;
            }

            &:nth-child(16) {
                left: 30%;
            }

            &:nth-child(17) {
                left: 32%;
            }

            &:nth-child(18) {
                left: 34%;
            }

            &:nth-child(19) {
                left: 36%;
            }

            &:nth-child(20) {
                left: 38%;
            }

            &:nth-child(21) {
                left: 40%;
            }

            &:nth-child(22) {
                left: 42%;
            }

            &:nth-child(23) {
                left: 44%;
            }

            &:nth-child(24) {
                left: 46%;
            }

            &:nth-child(25) {
                left: 48%;
            }

            &:nth-child(26) {
                left: 50%;
            }

            &:nth-child(27) {
                left: 52%;
            }

            &:nth-child(28) {
                left: 54%;
            }

            &:nth-child(29) {
                left: 56%;
            }

            &:nth-child(30) {
                left: 58%;
            }

            &:nth-child(31) {
                left: 60%;
            }

            &:nth-child(32) {
                left: 62%;
            }

            &:nth-child(33) {
                left: 64%;
            }

            &:nth-child(34) {
                left: 66%;
            }

            &:nth-child(35) {
                left: 68%;
            }

            &:nth-child(36) {
                left: 70%;
            }

            &:nth-child(37) {
                left: 72%;
            }

            &:nth-child(38) {
                left: 74%;
            }

            &:nth-child(39) {
                left: 76%;
            }

            &:nth-child(40) {
                left: 78%;
            }

            &:nth-child(41) {
                left: 80%;
            }

            &:nth-child(42) {
                left: 82%;
            }

            &:nth-child(43) {
                left: 84%;
            }

            &:nth-child(44) {
                left: 86%;
            }

            &:nth-child(45) {
                left: 88%;
            }

            &:nth-child(46) {
                left: 90%;
            }

            &:nth-child(47) {
                left: 92%;
            }

            &:nth-child(48) {
                left: 94%;
            }

            &:nth-child(49) {
                left: 96%;
            }

            &:nth-child(50) {
                left: 98%;
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
</style>