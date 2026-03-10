<script lang="ts">
import {scheduledTask} from "@/logic/helper";
import {Vue, Component, toNative} from 'vue-facing-decorator';
import {Icon} from '@iconify/vue';

@Component({components: {Icon}})
class ScrollButton extends Vue {
    scroll() {
        document.documentElement.style.scrollBehavior = 'smooth';
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        scheduledTask(50, () => document.documentElement.style.scrollBehavior = null);
    }
}
export default toNative(ScrollButton)
</script>

<template>
    <button type="button" class="clickable hy-button round-button scrollButton" v-on:click="scroll()">
        <Icon class="icon" icon="mynaui:arrow-up" />
    </button>
</template>

<style lang="scss">
@use "@/css/global" as *;

.scrollButton {
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
