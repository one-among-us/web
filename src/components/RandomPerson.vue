<template>
    <button class="random clickable hy-button" v-on:click="rand">
        <Icon class="iconR" icon="lets-icons:sort-random-light"/>
        <span class="textR">{{ i18n.random }}</span>
    </button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { dataHost, getLang, i18n } from '@/logic/config';
import { PersonMeta } from '@/logic/data';
import urljoin from 'url-join';
import { info } from '@/logic/utils';
import { fetchWithLang } from '@/logic/helper';
import { Icon } from "@iconify/vue";

@Options({ components: { Icon } })
export default class RandomPerson extends Vue {
    lang = getLang();
    i18n = i18n[getLang()];
    people: PersonMeta[] = null as never as PersonMeta[];

    created(): void {
        info(`Language: ${this.lang}`);
        fetchWithLang(urljoin(dataHost, 'people-list.json'))
            .then(it => it.json())
            .then(it => this.people = it);
    }

    rand() {
        if (!this.people) return;
        const p = this.people[Math.floor(this.people.length * Math.random())];
        this.$router.push(`/profile/${p.id}`);
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
