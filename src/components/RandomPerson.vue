<template>
    <button class="random clickable hy-button" v-on:click="rand">
        <Icon class="iconR" icon="lets-icons:sort-random-light"/>
        <span class="textR">{{ i18n.random }}</span>
    </button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { dataHost, t } from '@/logic/config';
import { PersonMeta } from '@/logic/data';
import urljoin from 'url-join';
import { fetchWithLang } from '@/logic/helper';
import { Icon } from "@iconify/vue";
import router from "@/router";

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
@import "../css/colors"
@import "../css/global"

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

</style>
