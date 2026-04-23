<script setup lang="ts">
import {ref} from 'vue'
import {randint, scheduledTask} from "@/logic/helper";

const props = withDefaults(defineProps<{
    messages: string[]
    noClick?: boolean
}>(), {
    noClick: false
})

const m = ref("")
const animating = ref(false)

if (props.messages.length > 0) m.value = props.messages[randint(0, props.messages.length - 1)];

function roll() {
    if (props.noClick) return;
    if (animating.value) return;
    animating.value = true;
    mil();
}

function mil() {
    if (m.value.length < 1) scheduledTask(200, () => {
        pls((props.messages.length > 0) ? props.messages[randint(0, props.messages.length - 1)] : "")
    })
    else {
        m.value = m.value.substring(0, m.value.length - 1);
        scheduledTask(delayTime(m.value.length), () => {
            mil()
        })
    }
}

function pls(s: string) {
    if (s.length < 1) {
        animating.value = false;
        return;
    }
    m.value += s[0];
    scheduledTask(delayTime(m.value.length), () => {
        pls(s.substring(1));
    })
}

function delayTime(n: number): number {
    return Math.floor(-100 * Math.atan(0.1 * n - 4) / Math.PI) + 60;
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
