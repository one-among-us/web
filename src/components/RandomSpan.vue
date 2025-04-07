<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';

@Component({})
export default class RandomQuote extends Vue {
    @Prop({ required: true }) messages: string[]
}
</script>

<template>
    <p v-html="this.messages[Math.floor(this.messages.length * Math.random())]"> </p>
</template>