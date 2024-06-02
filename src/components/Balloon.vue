<template>
    <div class="balloon fly-to-top" v-bind:id="db">
        <img v-bind:src="sourceImg" class="balloonImg" v-bind:style="styles" />
    </div>
</template>

<script lang="ts">
import { randint, scheduledTask } from '@/logic/helper';
import { Component, Vue } from 'vue-facing-decorator';
import { balloons } from '@/logic/config';

@Component({ components: {} })
export default class Balloon extends Vue {
    db = 'ballon-qwq';
    sourceImg = 'https://one-among.us/favicon-large.png';
    styles = '';

    created() {
        this.db = 'balloon-' + randint(0, 2147483648).toString();
        this.sourceImg = `/img/balloons/balloon-${randint(0, 6)}.png`;
    }

    mounted() {
        let left = Math.random() * (window.innerWidth - 100);
        if (window.innerWidth > balloons.width)
            left = Math.random() * (balloons.width - 100) + (window.innerWidth - balloons.width) / 2;
        document.getElementById(this.db).style.left = left.toString() + 'px';
        document.getElementById(this.db).style.bottom = randint(balloons.min, balloons.max).toString() + 'px';

        document.getElementById(this.db).addEventListener('mouseover', (e) => {
            document.getElementById(this.db).remove()
        })

        scheduledTask(10000, () => {
            document.getElementById(this.db)?.remove()
        })
    }
}
</script>

<style lang="sass">
@import '@/css/animations'

.balloon
    position: fixed
    left: 0
    bottom: -100px
    width: 100px
    height: 100px
    overflow: hidden

.balloonImg
    width: 100px
    height: 100px
</style>
