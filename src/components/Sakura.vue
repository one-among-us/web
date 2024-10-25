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
}

.sakura {
    position: absolute;
    width: 100%;
    height: 100%;
}

.sakura span {
    position: absolute;
    top: -10%;
    left: 0;
    width: 0.8vw;
    height: 0.4vw;
    border-radius: 5% 80% 10% 80%;
    background-color: #ffb6c1;
}

/* add animation */
.sakura span:nth-child(2n+1) {
    animation: sakura-anim-1 10s 0s linear infinite;
}

.sakura span:nth-child(2n+2) {
    animation: sakura-anim-2 10s 0s linear infinite;
}

/* side position */
.sakura span:nth-child(1) {
    left: 0%;
}

.sakura span:nth-child(2) {
    left: 2%;
}

.sakura span:nth-child(3) {
    left: 4%;
}

.sakura span:nth-child(4) {
    left: 6%;
}

.sakura span:nth-child(5) {
    left: 8%;
}

.sakura span:nth-child(6) {
    left: 10%;
}

.sakura span:nth-child(7) {
    left: 12%;
}

.sakura span:nth-child(8) {
    left: 14%;
}

.sakura span:nth-child(9) {
    left: 16%;
}

.sakura span:nth-child(10) {
    left: 18%;
}

.sakura span:nth-child(11) {
    left: 20%;
}

.sakura span:nth-child(12) {
    left: 22%;
}

.sakura span:nth-child(13) {
    left: 24%;
}

.sakura span:nth-child(14) {
    left: 26%;
}

.sakura span:nth-child(15) {
    left: 28%;
}

.sakura span:nth-child(16) {
    left: 30%;
}

.sakura span:nth-child(17) {
    left: 32%;
}

.sakura span:nth-child(18) {
    left: 34%;
}

.sakura span:nth-child(19) {
    left: 36%;
}

.sakura span:nth-child(20) {
    left: 38%;
}

.sakura span:nth-child(21) {
    left: 40%;
}

.sakura span:nth-child(22) {
    left: 42%;
}

.sakura span:nth-child(23) {
    left: 44%;
}

.sakura span:nth-child(24) {
    left: 46%;
}

.sakura span:nth-child(25) {
    left: 48%;
}

.sakura span:nth-child(26) {
    left: 50%;
}

.sakura span:nth-child(27) {
    left: 52%;
}

.sakura span:nth-child(28) {
    left: 54%;
}

.sakura span:nth-child(29) {
    left: 56%;
}

.sakura span:nth-child(30) {
    left: 58%;
}

.sakura span:nth-child(31) {
    left: 60%;
}

.sakura span:nth-child(32) {
    left: 62%;
}

.sakura span:nth-child(33) {
    left: 64%;
}

.sakura span:nth-child(34) {
    left: 66%;
}

.sakura span:nth-child(35) {
    left: 68%;
}

.sakura span:nth-child(36) {
    left: 70%;
}

.sakura span:nth-child(37) {
    left: 72%;
}

.sakura span:nth-child(38) {
    left: 74%;
}

.sakura span:nth-child(39) {
    left: 76%;
}

.sakura span:nth-child(40) {
    left: 78%;
}

.sakura span:nth-child(41) {
    left: 80%;
}

.sakura span:nth-child(42) {
    left: 82%;
}

.sakura span:nth-child(43) {
    left: 84%;
}

.sakura span:nth-child(44) {
    left: 86%;
}

.sakura span:nth-child(45) {
    left: 88%;
}

.sakura span:nth-child(46) {
    left: 90%;
}

.sakura span:nth-child(47) {
    left: 92%;
}

.sakura span:nth-child(48) {
    left: 94%;
}

.sakura span:nth-child(49) {
    left: 96%;
}

.sakura span:nth-child(50) {
    left: 98%;
}

/* size */
.sakura span:nth-child(3n+1) {
    width: 1vw;
    height: 0.5vw;
}

.sakura span:nth-child(3n+2) {
    width: 0.8vw;
    height: 0.4vw;
}

.sakura span:nth-child(3n+3) {
    width: 0.6vw;
    height: 0.3vw;
}

/* animation-duration */
.sakura span:nth-child(4n+1) {
    animation-duration: 5s;
}

.sakura span:nth-child(4n+2) {
    animation-duration: 12s;
}

.sakura span:nth-child(4n+3) {
    animation-duration: 8s;
}

.sakura span:nth-child(4n+4) {
    animation-duration: 6s;
}


/* animation-delay */
.sakura span:nth-child(11n+1) {
    animation-delay: 0s;
}

.sakura span:nth-child(11n+2) {
    animation-delay: 9s;
}

.sakura span:nth-child(11n+3) {
    animation-delay: 2s;
}

.sakura span:nth-child(11n+4) {
    animation-delay: 5s;
}

.sakura span:nth-child(11n+5) {
    animation-delay: 6s;
}

.sakura span:nth-child(11n+6) {
    animation-delay: 7s;
}

.sakura span:nth-child(11n+7) {
    animation-delay: 3s;
}

.sakura span:nth-child(11n+8) {
    animation-delay: 1s;
}

.sakura span:nth-child(11n+9) {
    animation-delay: 2s;
}

.sakura span:nth-child(11n+10) {
    animation-delay: 11s;
}

.sakura span:nth-child(11n+11) {
    animation-delay: 10s;
}

/* animation */
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