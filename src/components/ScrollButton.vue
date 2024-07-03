<script lang="ts">
import {Vue, Component} from 'vue-facing-decorator';
import {Icon} from '@iconify/vue';

@Component({components: {Icon}})
export default class ScrollButton extends Vue {
    scroll() {
        window.scrollTo(0, 0);
    }
}
</script>

<template>
    <div class="clickable hy-button scrollButton" v-on:click="scroll()">
        <Icon class="icon" icon="ion:arrow-up-outline" />
    </div>
</template>

<style lang="scss">
@import "../css/colors";
@import "../css/global";

.scrollButton {
    padding: 10px;
    width: 25px;
    height: 25px;
    border-radius: 9008px;
    border-color: $color-text-main;
    border-width: 1px;
    border-style: solid;

    .icon {
        width: 20px;
        height: 20px;
        color: $color-text-main;
    }
}

[data-theme="dark"] .icon {
    color: $color-text-dark-main;
}
</style>