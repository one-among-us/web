<script lang="ts">
import {replaceUrlVars} from "@/logic/config";
import {PersonMeta} from "@/logic/data";
import {delay} from "@/logic/helper";
import {Icon} from "@iconify/vue";
import {Vue, Component, Prop} from 'vue-facing-decorator';

@Component({
    components: { Icon },
})
export default class ProfileFolder extends Vue {
    @Prop({ required: true }) people: PersonMeta[]
    @Prop({ required: true }) name: string

    show = [] as PersonMeta[]
    page = 0
    maxPage = 0;

    mounted() {
        this.model = true;
        this.maxPage = Math.floor(this.people.length / 9);
        for (let i = 0; i < this.people.length && i < 9; i++) {
            this.show.push(this.people[i]);
            delay(500).then()
        }
    }

    pushing(id: string): void {
        window.open(`/profile/${id}`, '_self');
    }

    doNext() {
        if (this.page < this.maxPage) {
            this.page += 1;
            this.show = [];
            for (let i = this.page * 9; (i < this.page * 9 + 9) && (i < this.people.length); ++i) {
                delay(500).then()
                this.show.push(this.people[i]);
            }
        }
    }

    doPrev() {
        if (this.page > 0) {
            this.page -= 1;
            this.show = [];
            for (let i = this.page * 9; i < this.page * 9 + 9; ++i) {
                delay(500).then()
                this.show.push(this.people[i]);
            }
        }
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
            <transition-group name="tac" tag="div" class="items">
                <div class="item" v-for="p of show" :key="p.id" v-on:click="pushing(p.id)">
                    <img class="avatar" :src="profileUrl(p)" :alt="'Avatar for ' + p.id"/>
                </div>
            </transition-group>
            <div class="page-container">
                <Icon class="button-icon" v-on:click="doPrev" icon="iconoir:nav-arrow-left"/>
                <span class="page-span">{{ page + 1 }} / {{ maxPage + 1 }}</span>
                <Icon class="button-icon" v-on:click="doNext" icon="iconoir:nav-arrow-right"/>
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
    background-color: rgba(76, 79, 105, 0.75);
    z-index: 16;

    .folder {
        position: fixed;
        max-width: 600px;
        max-height: 600px;
        width: 100%;
        height: 100%;
        top: calc(50vh - 400px);
        left: calc(50vw - 300px);
        transition: all 0.5s $ease-in-out-cric;
        background: $color-bg-6;
        border-radius: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        @media screen and (max-width: 620px) {
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
            font-size: 2rem;
        }

        .items {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;
            width: calc(100% - 100px);
            height: calc(100% - 100px);
            gap: 30px;
            overflow: hidden;

            .item {
                display: block;
                width: 25%;
                height: 25%;
                border-radius: 20px;
                border: 3px solid $color-text-light;
                overflow: hidden;

                &:hover {
                    cursor: pointer;
                    filter: drop-shadow(0px 0px 5px $color-text-dark-special);
                }

                .avatar {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }

        .page-container {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;
            width: calc(100% - 100px);
            height: 30px;
            gap: 20px;

            .page-span {
                font-size: 24px;
                color: $color-text-main;
            }

            .button-icon {
                width: 24px;
                height: 24px;
                color: $color-text-main;
            }
        }
    }
}

.tac-enter-active, .tac-leave-active {
    transition: all 1s $ease-in-out-cric;
}

.tac-enter-from {
    opacity: 0;
    transform: translateY(-50px);
}

.tac-leave-to {
    opacity: 0;
    transform: translateY(50px);
}
</style>