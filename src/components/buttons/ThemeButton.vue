<template>
    <button type="button" class="clickable hy-button round-button theme-button" :key="theme" v-on:click="changeTheme()" :title="t.button[getTheme()]">
        <Icon class="iconR" icon="mynaui:sun" v-if="theme != 'dark'"/>
        <Icon class="iconR" icon="mynaui:moon" v-else/>
    </button>
</template>

<script lang="ts">
import {applyTheme, getTheme, setTheme} from "@/logic/theme";
import {t} from "@/logic/config";
import {Icon} from '@iconify/vue';
import {Component, Vue} from 'vue-facing-decorator';

@Component({ components: { Icon } })
export default class ThemeButton extends Vue {
    getTheme = getTheme

    t = t
    theme = getTheme()

    changeTheme(): void {
        if (this.theme == 'dark') {
            setTheme('light')
        } else {
            setTheme('dark')
        }
        applyTheme()
        this.theme = getTheme()
    }
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
