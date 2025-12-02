<template>
    <transition-group class="lang-btns" tag="div" name="list">
        <div key="func-buttons" class="func-buttons">
            <ScrollButton :title="t.button.top"/>
            <ThemeButton/>
        </div>
        <div key="switch-langs" class="clickable hy-button switch-langs" v-on:click="() => {isShowLang = !isShowLang}"
             :title="t.button.language"
        >
            <Icon class="icon" icon="fluent-mdl2:locale-language"/>
        </div>
        <LangButton key="lang-button" v-if="isShowLang" v-on:mouseover="() => {hovering = true}" v-on:mouseleave="unshowLang()" />
    </transition-group>
</template>

<script lang="ts">
import ScrollButton from "@/components/buttons/ScrollButton.vue";
import ThemeButton from "@/components/buttons/ThemeButton.vue";
import LangButton from "@/components/buttons/LangButton.vue";
import {getLang, t} from "@/logic/config";
import {scheduledTask} from "@/logic/helper";
import {Icon} from "@iconify/vue";
import {Component, Vue} from 'vue-facing-decorator';


@Component({ components: { Icon, ThemeButton, ScrollButton, LangButton } })
export default class GlobalButton extends Vue {
    lang = getLang()
    showBtn = localStorage.getItem('showBtn')
    isShowLang = false;
    t = t
    hovering = false;

    unshowLang() {
        this.hovering = false;
        scheduledTask(1000, () => {
            if (this.hovering) return;
            this.isShowLang = false;
        })
    }
}
</script>

<style lang="sass">
@use "@/css/colors" as *
@use "@/css/animations"
@use "@/css/motion" as *

.lang-btns
    // Fixed positioning
    position: fixed
    right: 20px
    bottom: 20px
    z-index: 50
    display: flex
    flex-direction: column
    transition: all 0.5s ease


    .switch-langs
        padding: 10px
        width: 25px
        height: 25px
        border-radius: 56562px
        border: 1px solid $color-text-main

        .icon
            width: 20px
            height: 20px


    .func-buttons
        display: flex
        flex-direction: column-reverse

        div
            padding: 10px
            width: 25px
            height: 25px
            border-radius: 56562px
            border: 1px solid $color-text-main

.list-enter-active
    transition: all .5s $ease-in-out-back

.list-leave-active
    transition: all .5s $ease-in-out-back
    position: absolute

.list-enter-from, .list-leave-to
    transition: all .25s $ease-in-out-back
    transform: translateX(269px)
</style>
