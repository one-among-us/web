<template>
    <button type="button" class="clickable hy-button round-button theme-button" :key="theme" v-on:click="changeTheme()" :title="t.button[getTheme()]">
        <Icon class="iconR" icon="mynaui:sun" v-if="theme != 'dark'"/>
        <Icon class="iconR" icon="mynaui:moon" v-else/>
    </button>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {applyTheme, getTheme, setTheme} from "@/logic/theme";
import {t} from "@/logic/config";
import {Icon} from '@iconify/vue';

const theme = ref(getTheme())

function changeTheme(): void {
    if (theme.value == 'dark') {
        setTheme('light')
    } else {
        setTheme('dark')
    }
    applyTheme()
    theme.value = getTheme()
}

</script>

<style lang="sass">
@use "@/css/global" as *

.theme-button
    .iconR
        width: 20px
        height: 20px
        color: $color-text-main

[data-theme="dark"]
    .iconR
        color: $color-text-dark-main
</style>
