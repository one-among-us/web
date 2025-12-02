<script lang="ts">
import {Vue, Component, Prop} from 'vue-facing-decorator';

@Component({})
export default class DottedNumber extends Vue {
    @Prop({required: true}) n: number | string;
    @Prop({default: false}) dash: boolean;

    style = '--dot: "·";';

    created() {
        if (this.dash) {
            this.style = '--dot: "·\t·\t·";'
        }
    }
}
</script>

<template>
    <p class="num-v" v-bind:style="style">· {{ n }} ·</p>
</template>

<style lang="scss">
@use "@/css/global" as *;

.num-v {
    display: block;
    position: relative;
    color: $color-text-special;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    line-height: 1.3;

    &::before {
        position: absolute;
        content: var(--dot);
        display: inline-block;
        bottom: -0.75em;
        left: 0;
        text-align: center;
        width: 100%;
    }

    &::after {
        position: absolute;
        content: var(--dot);
        display: inline-block;
        bottom: 0.75em;
        left: 0;
        text-align: center;
        width: 100%;
    }
}

[data-theme="dark"] {
    .num-v {
        color: $color-text-dark-special;
    }
}
</style>