<template>
    <a class="backup button anim" :href="url">
        <i class="icon" :class="icon ? icon : `fab fa-${platform}`"></i>
        <span class="text">{{text}}</span>
    </a>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";

@Options({components: {}})
export default class ChannelBackupButton extends Vue
{
    @Prop({default: "telegram"}) platform: string
    @Prop() icon: string
    @Prop({required: true}) url: string
    @Prop({default: "查看频道备份"}) text: string
}
</script>

<style lang="sass" scoped>
@import "../css/colors"

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
        text-shadow: rgba(255,255,255,0.5) 0 5px 6px

.button.anim:hover
    box-shadow: 0 10px 10px -5px rgba(166, 134, 89, 0.3)
</style>
