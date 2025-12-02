<script lang="ts">
import {Vue, Component} from 'vue-facing-decorator';

@Component({})
export default class Hexagon extends Vue {

}
</script>

<template>
    <div class="hexagon-outer">
        <div class="hexagon-inner">
            <div class="content markdown-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@use "@/css/global" as *;
@use "@/css/markdown";

.hexagon-outer {
    width: 150px;
    height: calc(150px * 1.1547);
    background: $color-text-main;
    display: flex;
    clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);
    flex-direction: row;
    align-content: center;
    align-items: center;
    justify-items: center;
    justify-content: center;
    margin: 0 auto;

    .hexagon-inner {
        width: 142px;
        height: calc(142px * 1.1547);
        background: $color-bg-4;
        clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        justify-items: center;
        justify-content: center;

        .content {
            width: 142px;
            height: calc(142px * 1.1547);
            display: flex;
            flex-direction: column;
            align-content: center;
            align-items: center;
            justify-items: center;
            justify-content: center;
            background: transparent;

            * {
                margin: 7.5px auto;
            }
        }
    }
}

[data-theme="dark"] {
    .hexagon-outer {
        background: $color-text-dark-main;

        .hexagon-inner {
            background: $color-bg-dark-4;
        }
    }
}
</style>