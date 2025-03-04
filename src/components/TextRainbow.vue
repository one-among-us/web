<script lang="ts">
import {Vue, Component, Prop} from 'vue-facing-decorator';

@Component({})
export default class TextRainbow extends Vue {
    @Prop({required: true}) text!: string;
    @Prop({default: 120}) angle: number;
    @Prop({default: '1rem'}) fontSize: string;

    inner = ''
    perAngle = 0;

    created() {
        this.perAngle = this.angle / this.text.length;
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
    <div class="text-ring" :style="'font-size: ' + fontSize + '; --total: ' + text.length + '; --radius: ' + 1 / Math.sin(perAngle / 180 * Math.PI) + '; padding: ' + 0.35 / Math.sin(perAngle / 180 * Math.PI) + 'rem; --tas: ' + angle + 'deg;'" v-html="inner"></div>
</template>

<style lang="scss">
.text-ring {
    position: relative;
    display: block;
    transform: translateY(50%);
}
.text-ring [style*=--index] {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(calc(var(--tas) / var(--total) * var(--index) - (var(--tas) / 2) + 1deg)) translateY(calc(var(--radius, 5) * -1ch));
}
</style>