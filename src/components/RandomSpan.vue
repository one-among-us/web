<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import {randint} from "@/logic/helper";

@Component({})
export default class RandomSpan extends Vue {
    @Prop({required: true}) messages: string[]
    @Prop({required: false, default: false}) noClick: boolean
    m = "";

    created() {
        this.roll();
    }

    roll() {
        if (this.noClick) return;
        this.m = this.messages[randint(0, this.messages.length - 1)];
    }
}
</script>

<template>
    <span class="markdown-content random-span" v-text="m" @click="roll()"></span>
</template>

<style lang="scss">
@import "@/css/markdown";

.random-span {
    display: inline;
    cursor: pointer;
    user-select: none;
}
</style>
