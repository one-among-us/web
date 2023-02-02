<template>
    <div id="About">
        <div class="markdown-content" style="margin: 10px min(4vw, 40px)" v-html="html" />
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import aboutHtml from "@/assets/about.md";
import aboutHtmlHant from "@/assets/about.zh_hant.md";
import {getLang} from "@/logic/config";

@Options({})
export default class About extends Vue
{
    html = getLang() == 'zh_hans' ? aboutHtml : aboutHtmlHant;
}
</script>
