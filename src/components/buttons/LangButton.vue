<script setup lang="ts">
import {computed} from 'vue'
import {getLang, Lang, setLang, supportedLang} from "@/logic/config";
import {info} from "@/logic/utils";

const targets = computed(() => {
    const lang = getLang()
    return Object.keys(supportedLang).filter(l => l !== lang) as Lang[]
})

function click(id: Lang) {
    info(`Switching to ${id}`)
    setLang(id)
    location.reload()
}
</script>

<template>
    <div class="lang-buttons">
        <button type="button" class="clickable hy-button round-button"
             @click="() => click(l)" v-for="l in targets" :key="l">
            {{ supportedLang[l] }}
        </button>
    </div>
</template>

<style lang="sass">
@use "@/css/global" as *

.lang-buttons
    display: flex
    flex-direction: column
    justify-items: end
    justify-content: end
    align-items: stretch
</style>
