<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import {randint, scheduledTask} from "@/logic/helper";

@Component({})
export default class RandomSpan extends Vue {
    @Prop({required: true}) messages: string[]
    @Prop({required: false, default: false}) noClick: boolean
    m = "";

    animating = false;

    created() {
        if (this.messages.length > 0) this.m = this.messages[randint(0, this.messages.length - 1)];
    }

    roll() {
        if (this.noClick) return;
        if (this.animating) return;
        this.animating = true;
        this.mil();
    }

    mil() {
        if (this.m.length < 1) scheduledTask(200, () => {
            this.pls((this.messages.length > 0) ? this.messages[randint(0, this.messages.length - 1)] : "")
        })
        else {
            this.m = this.m.substring(0, this.m.length - 1);
            scheduledTask(this.delayTime(this.m.length), () => {
                this.mil()
            })
        }
    }

    pls(s: string) {
        if (s.length < 1) {
            this.animating = false;
            return;
        }
        this.m += s[0];
        scheduledTask(this.delayTime(this.m.length), () => {
            this.pls(s.substring(1));
        })
    }

    delayTime(n: number): number {
        return Math.floor(-100 * Math.atan(0.1 * n - 4) / Math.PI) + 60;
    }
}
</script>

<template>
    <span class="markdown-content random-span" @click="roll()">
        <transition-group name="rspan" tag="span" class="rspan-group">
            <span
                class="markdown-content"
                v-for="i of [...m.split('').keys()]"
                :key="m[i] + i"
                :style="m[i] == '\n' ? 'display:block;width:0;height:0;overflow:hidden;' : ''"
            >
                {{ m[i] }}
            </span>
        </transition-group>
    </span>
</template>

<style lang="scss">
@use "@/css/markdown";

.random-span {
    display: inline;
    cursor: pointer;
    user-select: none;
}

.rspan-group {
    display: inline;
    height: min-content;
    width: min-content;
    overflow: hidden;
}

.rspan-enter-active, .rspan-leave-active {
    transition: opacity 0.3s ease;
}

.rspan-enter-from, .rspan-leave-to {
    opacity: 0;
}
</style>
