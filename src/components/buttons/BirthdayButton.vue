<template>
    <button class="random clickable hy-button" v-on:click="goBirth">
        <Icon class="iconR" icon="tabler:candy"/>
        <span class="textR">{{ t.birthday.birthday.replace('{0}', name) }}</span>
    </button>
</template>

<script lang="ts">
import {t} from '@/logic/config';
import router from '@/router';
import {Icon} from '@iconify/vue';
import {Component, Prop, Vue} from 'vue-facing-decorator';

@Component({ components: { Icon } })
export default class BirthdayButton extends Vue {
    t = t;
    birth: [string, string][] = null as never as [string, string][];
    @Prop({ required: true }) id: string;
    @Prop({ required: true }) name: string;

    goBirth() {
        router.push(`/profile/${this.id}`);
    }
}
</script>

<style lang="sass" scoped>
@use "@/css/global" as *

.random
    // Outer alignment
    margin: auto

    // Inner alignment
    display: flex
    align-items: center
    gap: 10px
    padding: 12px 18px

    // Button style
    border-radius: 15px
    color: $color-text-main

    font-size: 1rem
    font-family: 'Hua', $font

[data-theme="dark"]
    .random
        color: $color-text-dark-main
        background-color: $color-bg-dark-6
</style>
