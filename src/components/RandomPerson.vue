<template>
    <button class="random clickable hy-button" v-on:click="rand">
        <Icon class="iconR" icon="lets-icons:sort-random-light"/>
        <span class="textR">{{ i18n.random }}</span>
    </button>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {dataHost, t} from '@/logic/config';
import {PersonMeta} from '@/logic/data';
import {fetchWithLang} from '@/logic/helper';
import router from "@/router";
import {Icon} from "@iconify/vue";
import urljoin from 'url-join';

const i18n = t
const people = ref<PersonMeta[] | null>(null)

onMounted(() => {
    fetchWithLang(urljoin(dataHost, 'people-list.json'))
        .then(it => it.json())
        .then(it => people.value = it);
})

function rand() {
    if (!people.value) return;
    const p = people.value[Math.floor(people.value.length * Math.random())];
    router.push(`/profile/${p.id}`);
}
</script>

<style lang="sass" scoped>
@use "@/css/global" as *

.random
    // Outer alignment
    margin: auto

    // Inner alignment
    display: flex
    align-items: center
    gap: 10px
    padding: 12px 18px

    // Button style
    border-radius: 15px
    color: $color-text-main

    font-size: 1rem
    font-family: 'Hua', $font

[data-theme="dark"]
    .random
        color: $color-text-dark-main
        background-color: $color-bg-dark-6
</style>
