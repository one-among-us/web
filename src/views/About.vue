<template>
    <div id="About">
        <Markdown :markdown="markdown" margins="yes"/>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {aboutMarkdown} from "@/logic/data";
import Markdown from "@/components/Markdown.vue";

@Options({components: {Markdown}})
export default class About extends Vue
{
    markdown = aboutMarkdown
}
</script>
