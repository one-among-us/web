<script lang="ts">
import {Vue, Component, Prop} from 'vue-facing-decorator';

@Component({})
export default class TextRing extends Vue {
    @Prop({required: true}) text!: string;
    @Prop({default: '1rem'}) fontSize: string;

    inner = ''
    angle = 0;

    created() {
        this.angle = 360 / this.text.length;
        let u = `<span aria-hidden="true">`;
        let c = 0;
        for (const v of this.text) {
            u += `<span style="--index: ${c}; font-size: ${this.fontSize};">${v}</span>`;
            ++c;
        }
        u += `</span>`;
        this.inner = u;
    }
}
</script>

<template>
    <div class="text-ring" :style="'font-size: ' + fontSize + '; --total: ' + text.length + '; --radius: ' + 1 / Math.sin(angle / 180 * Math.PI) + '; padding: ' + 0.71 / Math.sin(angle / 180 * Math.PI) + 'rem;'" v-html="inner"></div>
</template>

<style lang="scss">
.text-ring {
    position: relative;
    display: block;
}
.text-ring [style*=--index] {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(calc(360deg / var(--total) * var(--index))) translateY(calc(var(--radius, 5) * -1ch));
}
</style>