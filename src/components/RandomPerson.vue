<template>
    <button class="random clickable hy-button" v-on:click="rand">
        <Icon class="iconR" icon="lets-icons:sort-random-light"/>
        <span class="textR">{{ i18n.random }}</span>
    </button>
</template>

<script lang="ts">
import {dataHost, t} from '@/logic/config';
import {PersonMeta} from '@/logic/data';
import {fetchWithLang} from '@/logic/helper';
import router from "@/router";
import {Icon} from "@iconify/vue";
import urljoin from 'url-join';
import {Component, Vue} from 'vue-facing-decorator';

@Component({ components: { Icon } })
export default class RandomPerson extends Vue {
    i18n = t;
    people: PersonMeta[] = null as never as PersonMeta[];

    created(): void {
        fetchWithLang(urljoin(dataHost, 'people-list.json'))
            .then(it => it.json())
            .then(it => this.people = it);
    }

    rand() {
        if (!this.people) return;
        const p = this.people[Math.floor(this.people.length * Math.random())];
        router.push(`/profile/${p.id}`);
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
