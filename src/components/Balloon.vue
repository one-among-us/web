<template>
    <div class="balloon fly-to-top" v-bind:id="db" v-on:mouseover="mouseover()">
        <img v-bind:src="sourceImg" class="balloonImg" v-bind:style="styles"/>
    </div>
</template>

<script lang="ts">
import {balloons} from '@/logic/config';
import {isEaster} from '@/logic/easterEgg'
import {randint, scheduledTask} from '@/logic/helper';
import {Component, Vue} from 'vue-facing-decorator';

@Component({ components: {} })
export default class Balloon extends Vue {
    db = 'balloon-qwq';
    sourceImg = 'https://one-among.us/favicon-large.png';
    styles = '';

    created() {
        this.db = 'balloon-' + randint(0, 2147483648).toString();
        this.sourceImg = (isEaster() && (Math.random() < 0.65)) ? '/img/balloons/balloon-p.png' : `/img/balloons/balloon-${randint(0, 6)}.png`;
    }

    mounted() {
        let left = Math.random() * (window.innerWidth - 100);
        if (window.innerWidth > balloons.width)
            left = Math.random() * (balloons.width - 100) + (window.innerWidth - balloons.width) / 2;
        document.getElementById(this.db).style.left = left.toString() + 'px';
        document.getElementById(this.db).style.bottom = randint(balloons.min, balloons.max).toString() + 'px';

        scheduledTask(10000, () => {
            document.getElementById(this.db)?.remove()
        })
    }

    mouseover() {
        document.getElementById(this.db).remove()
    }
}
</script>

<style lang="sass">
@use '@/css/animations'

.balloon
    position: fixed
    left: 0
    bottom: -100px
    width: 100px
    height: 100px
    overflow: hidden
    opacity: 0.75

.balloonImg
    width: 100px
    height: 100px
</style>
