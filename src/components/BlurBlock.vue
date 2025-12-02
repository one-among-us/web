<script lang="ts">
import {Vue, Component, Prop} from 'vue-facing-decorator';

@Component({})
export default class BlurBlock extends Vue {
    @Prop({required: false}) hover: boolean;

    blur = ""
    isblur = false

    mounted() {
        this.blur = 'filter: blur(5px);';
        this.isblur = true;
    }

    click() {
        if (this.hover) return;
        if (this.isblur) {
            this.blur = 'filter: none;';
        }
        else {
            this.blur = 'filter: blur(5px);';
        }
        this.isblur = !this.isblur;
    }

    hovering() {
        if (!this.hover) return;
        if (!this.isblur) return;
        this.isblur = !this.isblur;
        this.blur = 'filter: none;';
    }

    leave() {
        if (!this.hover) return;
        if (this.isblur) return;
        this.isblur = !this.isblur;
        this.blur = 'filter: blur(5px);';
    }
}
</script>

<template>
    <div class="blur" v-bind:style="blur" v-on:click="click()" v-on:mouseover="hovering()" v-on:mouseleave="leave()">
        <slot />
    </div>
</template>

<style lang="scss">
@use "@/css/global.sass" as *;
@use "@/css/markdown.sass";

.blur {
    @extend .markdown-content;
    transition: all 1s $ease-out-cric;
}
</style>