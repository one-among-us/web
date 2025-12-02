<template>
    <a class="backup button anim" :href="computedUrl">
        <i class="icon" :class="icon ? icon : `fab fa-${platform}`"></i>
        <span class="text">{{ computedText }}</span>
    </a>
</template>

<script lang="ts">
import {getLang, t} from '@/logic/config';
import urljoin from "url-join";
import {Component, Prop, Vue} from 'vue-facing-decorator';

const kvs = {
    zh_hans: { 'telegram': '电报', 'twitter': '推特' },
    zh_hant: { 'telegram': '電報', 'twitter': '推特' },
    en: { 'telegram': 'telegram', 'twitter': 'twitter' }
}

@Component({ components: {} })
export default class ChannelBackupButton extends Vue {
    @Prop({ default: "telegram" }) platform: string
    @Prop() icon: string
    @Prop() url: string
    @Prop() text: string

    kvs = kvs[getLang()]

    get computedUrl() {
        if (this.url) return this.url
        return urljoin(window.location.href, `backup/${this.platform}`)
    }

    get computedText() {
        if (this.text) return this.text
        return t.backup.view.replace('{0}', this.kvs[this.platform] ?? ` ${this.platform} `)
    }
}
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
