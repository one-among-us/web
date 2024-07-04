<template>
    <transition-group class="lang-btns" tag="div" name="list">
        <div class="func-buttons">
            <ScrollButton :title="t.button.top"/>
            <ThemeButton/>
        </div>
        <div class="clickable hy-button switch-langs" v-on:click="() => {isShowLang = !isShowLang}"
             :title="t.button.language"
        >
            <Icon class="icon" icon="fluent-mdl2:locale-language"/>
        </div>
        <div class="lang-buttons" v-show="isShowLang" :key="+isShowLang"
             v-on:mouseleave="unshowLang()"
             v-on:mouseover="hovering = true"
        >
            <div class="clickable hy-button"
                 @click="() => click(l)" v-for="l in targets" :key="l">
                {{ supportedLang[l] }}
            </div>
        </div>
    </transition-group>
</template>

<script lang="ts">
import ScrollButton from "@/components/buttons/ScrollButton.vue";
import ThemeButton from "@/components/buttons/ThemeButton.vue";
import {getLang, Lang, setLang, supportedLang, t} from "@/logic/config";
import {scheduledTask} from "@/logic/helper";
import {info} from "@/logic/utils";
import {Icon} from "@iconify/vue";
import {Component, Vue} from 'vue-facing-decorator';


@Component({ components: { Icon, ThemeButton, ScrollButton } })
export default class LangButton extends Vue {
    lang = getLang()
    supportedLang = supportedLang
    showBtn = localStorage.getItem('showBtn')
    isShowLang = false;
    t = t
    hovering = false;

    get targets(): Lang[] {
        const lang = getLang()
        return Object.keys(supportedLang).filter(l => l !== lang) as Lang[]
    }

    click(id: Lang) {
        info(`Switching to ${id}`)
        setLang(id)
        location.reload()
    }

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
@import "../../css/colors"
@import "../../css/animations"

.lang-btns
    // Fixed positioning
    position: fixed
    right: 20px
    bottom: 20px
    z-index: 50
    display: flex
    flex-direction: column
    transition: all 0.5s ease

    .lang-buttons
        display: flex
        flex-direction: column
        justify-items: end
        justify-content: end

        div
            // Make it a circle
            padding: 10px
            width: 25px
            height: 25px
            border-radius: 56562px
            border: 1px solid $color-text-main

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
    transition: all .5s cubic-bezier(0.68, -0.60, 0.32, 1.60)

.list-leave-active
    transition: all .5s cubic-bezier(0.68, -0.60, 0.32, 1.60)
    position: absolute

.list-enter-from, .list-leave-to
    transition: all .25s cubic-bezier(0.68, -0.60, 0.32, 1.60)
    transform: translateX(269px)
</style>
