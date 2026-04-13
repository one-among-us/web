<script setup lang="ts">
import {computed} from 'vue'

const props = withDefaults(defineProps<{
    text: string
    fontSize?: string
}>(), {
    fontSize: '1rem'
})

const angle = computed(() => 360 / props.text.length)
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
    <div class="text-ring" :style="'font-size: ' + props.fontSize + '; --total: ' + props.text.length + '; --radius: ' + 1 / Math.sin(angle / 180 * Math.PI) + '; padding: ' + 0.71 / Math.sin(angle / 180 * Math.PI) + 'rem;'" v-html="inner"></div>
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
