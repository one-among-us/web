<template>
    <div id="About">
        <div class="markdown-content" style="margin: 10px min(4vw, 40px)" v-html="html" />
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import aboutHtml from "@/assets/about.md";
import aboutHtmlHant from "@/assets/about.zh_hant.md";
import aboutHtmlEn from "@/assets/about.en.md";
import {getLang} from "@/logic/config";

@Options({})
export default class About extends Vue
{
    lang = getLang();
    html = this.lang === 'zh_hans' ? aboutHtml : (this.lang === 'zh_hant' ? aboutHtmlHant : aboutHtmlEn);
}
</script>
