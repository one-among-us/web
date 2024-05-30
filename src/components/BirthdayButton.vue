<template>
    <button class="random clickable hy-button" v-on:click="goBirth" v-if="shown">
        <Icon class="iconR" icon="tabler:candy"/>
        <span class="textR">{{ t.birthday.replace('{0}', name) }}</span>
    </button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { dataHost, t, peopleUrl, getLang } from '@/logic/config';
import { Person } from '@/logic/data';
import urljoin from 'url-join';
import { fetchWithLang, getResponseSync } from '@/logic/helper';
import { Icon } from "@iconify/vue";
import router from "@/router";

@Component({ components: { Icon } })
export default class RandomPerson extends Vue {
    t = t;
    birth: [string, string][] = null as never as [string, string][]
    shown = false
    id = ''
    name = ''

    created(): void {
        fetchWithLang(urljoin(dataHost, 'birthday-list.json'))
            .then(it => it.json())
            .then(it => {
                this.birth = it
                for (const v of it) {
                    const d = new Date(v[1]);
                    const now = new Date();
                    if ((d.getDate() == now.getDate()) && (d.getMonth() == now.getMonth())) {
                        this.shown = true
                        this.id = v[0];
                        const p = JSON.parse(getResponseSync(urljoin(peopleUrl(this.id), (getLang() == 'zh_hans' ? 'info.json' : `info.${getLang()}.json`)))) as Person
                        this.name = p.name
                    }
                }
            });
    }

    goBirth() {
        router.push(`/profile/${this.id}`)
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
