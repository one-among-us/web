<script lang="ts">
import {scheduledTask} from "@/logic/helper";
import {Vue, Component} from 'vue-facing-decorator';
import {Icon} from '@iconify/vue';

@Component({components: {Icon}})
export default class ScrollButton extends Vue {
    scroll() {
        document.documentElement.style.scrollBehavior = 'smooth';
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        scheduledTask(50, () => document.documentElement.style.scrollBehavior = null);
    }
}
</script>

<template>
    <div class="clickable hy-button scrollButton" v-on:click="scroll()">
        <Icon class="icon" icon="mynaui:arrow-up" />
    </div>
</template>

<style lang="scss">
@use "@/css/global" as *;

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