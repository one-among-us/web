<template>
    <button class="random shadow" v-on:click="rand">
        <div class="iconR">🔀</div>
        <div class="textR">{{ i18n.random }}</div>
    </button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { getLang, i18n, dataHost } from '../logic/config';
import { PersonMeta } from '../logic/data';
import urljoin from 'url-join';
import { info } from '../logic/utils';
import { fetchWithLang } from '../logic/helper';

@Options({ components: {} })
export default class RandomPerson extends Vue {
    lang = getLang();
    i18n = i18n[getLang()];
    people: PersonMeta[] = null as never as PersonMeta[];

    created(): void {
        info(`Language: ${this.lang}`);
        fetchWithLang(urljoin(dataHost, 'people-list.json'))
            .then((it) => it.text())
            .then((it) => {
                this.people = JSON.parse(it);
                // console.log(it)
                // console.log(this.people)
            });
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

.random
    display: flexbox
    background: $color-bg-6
    border-radius: 20px
    border-style: solid
    border-width: 1px
    border-color: $color-text-light
    padding: 10px
    width: fit-content
    gap: 8px
    align-items: center
    color: $color-text-main

    filter: drop-shadow(0 2px 3px rgba(188 140 68 / 0.2))

    .iconR
        font-size: 2em
        color: rgba(188 140 60 / 0.5)
        background: transparent
        font-family: 'Hua', '851', 'STXINGKA', Avenir, Helvetica, Arial, sans-serif
        display: inline-block

    .textR
        font-size: 1.65em
        margin-left: 10px
        font-family: '851'
        vertical-align: middle
        display: inline-block
        padding-bottom: 0.6rem

.shadow:hover
    box-shadow: 15px 15px 15px -5px rgba(166 134 89 / 0.3)
    border-color: $color-text-special
</style>
