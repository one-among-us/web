<script lang="ts">
import {Vue, Component} from 'vue-facing-decorator';
import {getLang, Lang, setLang, supportedLang} from "@/logic/config";
import {info} from "@/logic/utils";

@Component({})
export default class LangButton extends Vue {
    lang = getLang()
    supportedLang = supportedLang

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

<template>
    <div class="lang-buttons">
        <div class="clickable hy-button"
             @click="() => click(l)" v-for="l in targets" :key="l">
            {{ supportedLang[l] }}
        </div>
    </div>
</template>

<style lang="sass">
@use "@/css/global" as *

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
</style>