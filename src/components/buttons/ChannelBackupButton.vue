<template>
    <a class="backup button anim" :href="computedUrl">
        <i class="icon" :class="props.icon ? props.icon : `fab fa-${props.platform}`"></i>
        <span class="text">{{ computedText }}</span>
    </a>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {getLang, Lang, t} from '@/logic/config';
import urljoin from "url-join";

const kvs = {
    zh_hans: { 'telegram': '电报', 'twitter': '推特' },
    zh_hant: { 'telegram': '電報', 'twitter': '推特' },
    en: { 'telegram': 'telegram', 'twitter': 'twitter' }
}

const props = withDefaults(defineProps<{
    platform?: string
    icon?: string
    url?: string
    text?: string
}>(), {
    platform: 'telegram'
})

const curKvs = kvs[getLang() as Lang]

const computedUrl = computed(() => {
    if (props.url) return props.url
    return urljoin(window.location.href, `backup/${props.platform}`)
})

const computedText = computed(() => {
    if (props.text) return props.text
    return t.backup.view.replace('{0}', curKvs[props.platform] ?? ` ${props.platform} `)
})
</script>

<style lang="sass" scoped>
@use "@/css/colors" as *

.backup
    padding: 10px
    background: $color-bg-6
    border-radius: 10px
    width: fit-content

    display: flex
    gap: 8px
    align-items: center

    text-decoration: none
    color: $color-text-main

    filter: drop-shadow(0 2px 3px rgba(188 140 68 / 20%))

    .icon
        font-size: 2em
        color: transparent
        background-color: rgb(188 140 68 / 50%)
        -webkit-background-clip: text
        background-clip: text
        text-shadow: rgba(255, 255, 255, 0.5) 0 5px 6px

.button.anim:hover
    box-shadow: 0 10px 10px -5px rgba(166, 134, 89, 0.3)

[data-theme="dark"]
    .backup
        background: $color-bg-dark-6
        color: $color-text-dark-main

        .icon
            background-color: rgb(89 64 20)
            text-shadow: rgba(255, 255, 255, 0.125) 0 5px 6px
</style>
