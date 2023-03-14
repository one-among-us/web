<template>
    <div id="LangButton" class="clickable hy-button" @click="click">
        {{ supportedLang[lang] }}
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { getLang, setLang, Lang } from "@/logic/config";
import { info } from "@/logic/utils";


@Options({ components: {} })
export default class LangButton extends Vue {
    lang = getLang()
    supportedLang = {
        'zh_hans': '简',
        'zh_hant': '繁',
        'en': '英'
    }

    click() {
        const langList = Object.keys(this.supportedLang)
        const currentIndex = langList.indexOf(this.lang);
        const nextIndex = (currentIndex + 1) % langList.length;
        const newLang = langList[nextIndex];
        info(`Switching to ${newLang}`)
        setLang(newLang as Lang)
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
    z-index: 50

    // Make it a circle
    padding: 10px
    width: 25px
    height: 25px
    border-radius: 56562px
</style>
