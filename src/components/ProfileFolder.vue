<script lang="ts">
import {replaceUrlVars} from "@/logic/config";
import {PersonMeta} from "@/logic/data";
import {Vue, Component, Prop} from 'vue-facing-decorator';

@Component({})
export default class ProfileFolder extends Vue {
    @Prop({required: true}) people: PersonMeta[]
    @Prop({required: true}) name: string

    show = [] as PersonMeta[]
    page = 0
    maxPage = 0;

    mounted() {
        this.maxPage = this.people.length / 9;
        for (let i = 0; i < this.people.length && i < 9; i++) {
            this.show.push(this.people[i]);
        }
    }

    pushing(id: string): void {
        window.open(`/profile/${id}`, '_self');
    }

    doNext() {

    }

    doPrev() {

    }

    profileUrl(p: PersonMeta): string {
        return replaceUrlVars(p.profileUrl, p.id)
    }
}
</script>

<template>
    <div class="drop-panel">
        <div class="folder">
            <h1 class="header">{{ name }}</h1>
            <div class="items">
                <transition-group name="tac" tag="div">
                    <div class="item" v-for="p of show" :key="p.id" v-on:click="pushing(p.id)">
                        <img class="avatar" :src="profileUrl(p)" :alt="'Avatar for ' + p.id" />
                    </div>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import "@/css/global";
@import "@/css/colors";
@import "@/css/motion";

.drop-panel {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(76, 79, 105, 0.25);

    .folder {
        position: fixed;
        max-width: 600px;
        max-height: 800px;
        width: 100%;
        height: 100%;
        top: calc(50vh - 400px);
        left: calc(50vw - 300px);
        transition: all 0.5s $ease-in-out-cric;

        @screen and (max-width: 620px) {
            $w: calc(100vw - 20px);
            $h: calc($w * 1.33);
            width: $w;
            height: $h;
            left: 10px;
            top: calc(50vh - $h);
        }

        h1 {
            color: $color-text-main;
            text-align: center;
            display: block;
            font-size: 3rem;
        }
    }
}
</style>