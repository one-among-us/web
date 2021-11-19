<template>
    <div id="Markdown" class="markdown-content" :style="margins ? {margin: '10px min(4vw, 40px)'} : {}">
        <Dynamic :template="html"></Dynamic>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import {marked} from "marked";

@Options({components: {}})
export default class Markdown extends Vue
{
    @Prop({required: true}) markdown!: string
    @Prop({default: false}) margins!: boolean

    get html(): string
    {
        return marked(this.markdown)
    }
}
</script>

<style lang="sass">
@import "../css/colors"

// Markdown style
.markdown-content
    text-align: justify
    text-justify: inter-word

    a
        color: $color-text-special
        text-decoration: none

    h1, h2
        border-bottom: 1px solid $color-text-special
        font-size: 1.5em
        margin-top: 1em

    h1, h2
        line-height: 1.3
        margin-bottom: 0.25em
        padding: 0

    p
        font-size: 0.875em
        margin: 0.5em 0
        line-height: 1.6

    li
        font-size: 0.875em
</style>
