<template>
    <div id="LangButton" class="clickable" @click="click">
        {{ lang === 'zh_hans' ? '繁' : '简' }}
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {getLang, setLang} from "@/logic/config";
import {info} from "@/logic/utils";

@Options({components: {}})
export default class LangButton extends Vue
{
    lang = getLang()

    click()
    {
        const newLang = getLang() == 'zh_hans' ? 'zh_hant' : 'zh_hans'
        info(`Switching to ${newLang}`)
        setLang(newLang)
        location.reload()
    }
}
</script>

<style lang="sass" scoped>
@import "../css/colors"

#LangButton
    // Fixed positioning
    position: fixed
    right: 20px
    bottom: 20px

    background: $color-bg-6

    // Make it a circle
    padding: 10px
    width: 25px
    height: 25px
    border-radius: 56562px

    // Drop shadow
    box-shadow: 0 2px 5px 0 rgb(166 134 89 / 32%)

#LangButton:hover
    // Move up
    transform: translateY(-5px)

    // Heavier shadow
    box-shadow: 0 10px 10px -5px rgb(166 134 89 / 84%)
</style>
