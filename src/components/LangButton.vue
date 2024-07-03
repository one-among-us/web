<template>
    <div class="lang-btns" v-if="showBtn">
        <transition-group tag="div" name="list">
            <div class="func-buttons" v-bind:id="funcId">
                <ScrollButton/>
                <ThemeButton/>
            </div>
            <div class="clickable hy-button switch-langs" v-on:click="showLang()" v-if="!isShowLang" :key="+isShowLang">
                <Icon class="icon" icon="fluent-mdl2:locale-language"/>
            </div>
            <div class="lang-buttons" v-show="isShowLang" :key="+isShowLang"
                 v-on:mouseleave="unshowLang()"
            >
                <div class="clickable hy-button"
                     @click="() => click(l)" v-for="l in targets" :key="l">
                    {{ supportedLang[l] }}
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script lang="ts">
import ScrollButton from "@/components/ScrollButton.vue";
import ThemeButton from "@/components/ThemeButton.vue";
import {getLang, Lang, setLang, supportedLang} from "@/logic/config";
import {randint, scheduledTask} from "@/logic/helper";
import {info} from "@/logic/utils";
import {Icon} from "@iconify/vue";
import {Component, Vue} from 'vue-facing-decorator';


@Component({ components: { Icon, ThemeButton, ScrollButton } })
export default class LangButton extends Vue {
    lang = getLang()
    supportedLang = supportedLang
    showBtn = localStorage.getItem('showBtn')
    isShowLang: boolean;
    funcId = 'func-lang-button-' + randint(0, 2147483647);

    created() {
        this.isShowLang = false;
    }

    get targets(): Lang[] {
        const lang = getLang()
        return Object.keys(supportedLang).filter(l => l !== lang) as Lang[]
    }

    click(id: Lang) {
        info(`Switching to ${id}`)
        setLang(id)
        location.reload()
    }

    showLang() {
        this.isShowLang = !this.isShowLang;
    }

    unshowLang() {
        scheduledTask(1000, () => {
            this.isShowLang = false;
        })
    }
}
</script>

<style lang="sass">
@import "../css/colors"
@import "../css/animations"

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

.list-enter-active, .list-leave-active
    transition: all 0.5s ease-in-out

.list-enter-from, .list-leave-to
    transition: all .25s cubic-bezier(0.45, 0.65, 0.875, 0.80)
    transform: translateY(269px)
    opacity: 0.65
</style>
