<script setup lang="ts">
import {computed} from 'vue'

const props = withDefaults(defineProps<{
    text: string
    angle?: number
    fontSize?: string
}>(), {
    angle: 120,
    fontSize: '1rem'
})

const perAngle = computed(() => props.angle / props.text.length)
const inner = computed(() => {
    let u = `<span aria-hidden="true">`;
    let c = 0;
    for (const v of props.text) {
        u += `<span style="--index: ${c}; font-size: ${props.fontSize};">${v}</span>`;
        ++c;
    }
    u += `</span>`;
    return u;
})
</script>

<template>
    <div class="text-ring" :style="'font-size: ' + props.fontSize + '; --total: ' + props.text.length + '; --radius: ' + 1 / Math.sin(perAngle / 180 * Math.PI) + '; padding: ' + 0.35 / Math.sin(perAngle / 180 * Math.PI) + 'rem; --tas: ' + props.angle + 'deg;'" v-html="inner"></div>
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
