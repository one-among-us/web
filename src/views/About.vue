<template>
    <div id="About">
        <div class="markdown-content" style="margin: 10px min(4vw, 40px)" v-html="html" />
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import aboutMarkdownHtml from "@/assets/about.md";

@Options({})
export default class About extends Vue
{
    html = aboutMarkdownHtml;
}
</script>
