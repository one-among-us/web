<script lang="ts">
import {Vue, Component} from 'vue-facing-decorator';

@Component({})
export default class BlurBlock extends Vue {
    blur = ""
    isblur = false

    mounted() {
        this.blur = 'filter: blur(5px);';
        this.isblur = true;
    }

    change() {
        if (this.isblur) {
            this.blur = 'filter: none;';
        }
        else {
            this.blur = 'filter: blur(5px);';
        }
        this.isblur = !this.isblur;
    }
}
</script>

<template>
    <div class="blur" v-bind:style="blur" v-on:click="change()">
        <slot />
    </div>
</template>

<style lang="scss">
@import '../css/colors.sass';
@import '../css/markdown.sass';
@import '../css/global.sass';
@import '../css/motion.scss';

.blur {
    @extend .markdown-content;
    transition: all 1s $ease-in-out-cric;
}
</style>