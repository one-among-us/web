<template>
    <div id="Markdown" class="markdown-content">
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

    get html(): string
    {
        return marked(this.markdown)
    }
}
</script>

<style lang="sass" scoped>

</style>
