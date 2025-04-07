<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import {randint} from "@/logic/helper";
@Component({})
export default class RandomSpan extends Vue {
    @Prop({ required: true }) messages: string[]
    @Prop canRoll: boolean
    m = "";
    created() {
        this.roll();
    }
    tryRoll() {
        if (this.canRoll) 
        {
            this.roll()
        }
    }
    roll() {
        this.m = this.messages[randint(0, this.messages.length - 1)];
    }
}
</script>

<template>
    <span class="markdown-content random-span" v-html="m" @click="tryRoll()"></span>
</template>

<style lang="scss">
@import "@/css/markdown";
.random-span {
    display: inline;
    cursor: pointer;
    user-select: none;
}
</style>
