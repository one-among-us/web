<template>
    <div class="func-buttons" v-if="showBtn" >
        <ScrollButton />
        <ThemeButton/>
    </div>
    <div class="lang-btns" v-if="showBtn">
        <div class="clickable hy-button"
             @click="() => click(l)" v-for="l in targets" :key="l">
            {{ supportedLang[l] }}
        </div>
    </div>
</template>

<script lang="ts">
import ScrollButton from "@/components/ScrollButton.vue";
import ThemeButton from "@/components/ThemeButton.vue";
import {getLang, Lang, setLang, supportedLang} from "@/logic/config";
import {info} from "@/logic/utils";
import {Component, Vue} from 'vue-facing-decorator';


@Component({ components: { ThemeButton, ScrollButton } })
export default class LangButton extends Vue {
    lang = getLang()
    supportedLang = supportedLang
    showBtn = localStorage.getItem('showBtn')

    get targets(): Lang[] {
        const lang = getLang()
        return Object.keys(supportedLang).filter(l => l !== lang) as Lang[]
    }

    click(id: Lang) {
        info(`Switching to ${id}`)
        setLang(id)
        location.reload()
    }
}
</script>

<style lang="sass" scoped>
@import "../css/colors"

.lang-btns
    // Fixed positioning
    position: fixed
    right: 20px
    bottom: 20px
    z-index: 50
    display: flex
    flex-direction: column

    div
        // Make it a circle
        padding: 10px
        width: 25px
        height: 25px
        border-radius: 56562px
        border: 1px solid $color-text-main

.func-buttons
    position: fixed
    left: 20px
    bottom: 20px
    z-index: 50
    display: flex
    flex-direction: column

    div
        padding: 10px
        width: 25px
        height: 25px
        border-radius: 56562px
        border: 1px solid $color-text-main
</style>
