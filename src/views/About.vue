<template>
    <main id="About">
        <div class="markdown-content" style="margin: 10px min(4vw, 40px)" v-html="html"/>
    </main>
</template>

<script setup lang="ts">
import aboutHtmlEn from "@/assets/about.en.md";
import aboutHtml from "@/assets/about.md";
import aboutHtmlHant from "@/assets/about.zh_hant.md";
import {getLang} from "@/logic/config";
import {handleIconFromString} from '@/logic/helper';

defineOptions({
    name: 'AboutView'
})

const lang = getLang();
const html = handleIconFromString(lang === 'zh_hans' ? aboutHtml : (lang === 'zh_hant' ? aboutHtmlHant : aboutHtmlEn));
</script>
