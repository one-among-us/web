<script setup lang="ts">
import {onMounted, ref} from 'vue'

const props = defineProps<{
    hover?: boolean
}>()

const blur = ref("")
const isblur = ref(false)

onMounted(() => {
    blur.value = 'filter: blur(5px);';
    isblur.value = true;
})

function click() {
    if (props.hover) return;
    if (isblur.value) {
        blur.value = 'filter: none;';
    } else {
        blur.value = 'filter: blur(5px);';
    }
    isblur.value = !isblur.value;
}

function hovering() {
    if (!props.hover) return;
    if (!isblur.value) return;
    isblur.value = !isblur.value;
    blur.value = 'filter: none;';
}

function leave() {
    if (!props.hover) return;
    if (isblur.value) return;
    isblur.value = !isblur.value;
    blur.value = 'filter: blur(5px);';
}
</script>

<template>
    <div class="blur" v-bind:style="blur" v-on:click="click()" v-on:mouseover="hovering()" v-on:mouseleave="leave()">
        <slot />
    </div>
</template>

<style lang="scss">
@use "@/css/global.sass" as *;
@use "@/css/markdown.sass";

.blur {
    @extend .markdown-content;
    transition: all 1s $ease-out-cric;
}
</style>
