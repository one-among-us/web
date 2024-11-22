<template>
    <div>
        <div id="home" :class="clicked ? 'clicked' : ''">

            <!-- If needed, delete 3 lines below. -->

            <div class="introduction markdown-content" v-html="tdorCommentView" v-if="isShowCommentsEntry()"/>

            <div class="introduction markdown-content" v-html="tdorTop" v-if="!isDeadlinePassed()"/>

            <TdorComments v-if="!isDeadlinePassed()"/>

            <div class="introduction markdown-content" v-html="htmlTop"/>

            <div class=randomButtons>
                <RandomPerson class="randomP"/>
                <BirthdayButton class="randomP" v-for="i of birthdayList" :key="i[0]" :id="i[0]" :name="i[1]"/>
            </div>

            <div class="search-bar">
                <Icon class="search-icon" icon="mynaui:search-hexagon" v-on:click="updateSearch"/>
                <input class="search-input" v-model="searchKey" v-on:input="updateSearch" placeholder="Search for..."/>
                <VueDatePicker range light model-auto class="search-date" placeholder="Select a range"
                               v-model="dateRange" @update:model-value="updateSearch"/>
            </div>

            <Loading v-if="isLoading"/>

            <transition-group id="profiles" class="unselectable" v-if="people" name="profiles" tag="div">
                <div class="profile" v-for="p in people" :key="p.id">
                    <div class="back"/>
                    <a :href="`/profile/${p.id}`" @click.exact.prevent.stop="() => false">
                        <transition name="fade" @after-leave="() => switchPage(p)">
                            <div class="front" v-if="clicked !== p.name">
                                <canvas v-bind:id="p.id + '-canvas'" class="blur clickable"></canvas>
                                <img :src="profileUrl(p)" draggable="false" alt="" class="profile-image clickable"
                                     @click.exact="() => { if (!clicked) { clicked = p.name; } return false }"
                                     v-on:load="isLoading = false">
                            </div>
                        </transition>
                    </a>
                    <div class="name font-custom" ref="bookmarkTexts">{{ p.name }}</div>
                    <div class="bookmark" ref="bookmark"/>
                </div>
                <div class="profile" v-if="showAdd">
                    <div class="back add fbox-vcenter">+</div>
                </div>
            </transition-group>

            <div class="introduction markdown-content bottom" v-html="htmlBottom"/>
        </div>
    </div>
</template>

<script lang="ts">
import htmlBottomEn from "@/assets/home-bottom.en.md";
import htmlBottom from "@/assets/home-bottom.md";
import htmlBottomHant from "@/assets/home-bottom.zh_hant.md";
import htmlTopEn from "@/assets/home-top.en.md";
import htmlTop from "@/assets/home-top.md";
import htmlTopHant from "@/assets/home-top.zh_hant.md";
import tdorCommentViewEn from "@/assets/tdor-comments-head-en.md";
import tdorCommentViewHant from "@/assets/tdor-comments-head-zh_hant.md";
import tdorCommentView from "@/assets/tdor-comments-head.md";
import tdorTopEn from "@/assets/tdor-top.en.md";
import tdorTop from "@/assets/tdor-top.md";
import tdorTopHant from "@/assets/tdor-top.zh_hant.md";
import BirthdayButton from '@/components/buttons/BirthdayButton.vue'
import Loading from '@/components/Loading.vue';
import RandomPerson from '@/components/RandomPerson.vue';
import {dataHost, getLang, peopleUrl, replaceUrlVars} from "@/logic/config";
import {Person, PersonMeta} from "@/logic/data";
import {fitText} from "@/logic/dom_utils";
import {isEaster} from "@/logic/easterEgg";
import {
    fetchWithLang,
    gaussian,
    gaussian_shuffle,
    getResponseSync,
    handleIconFromString,
    insert,
    randint,
    scheduledLoopTask,
    shuffle,
} from "@/logic/helper";
import {info} from '@/logic/utils';
import {isUwU, UwU} from "@/logic/uwu";
import {viaBalloon} from "@/logic/viaFetch";
import router from "@/router";
import TdorComments from "@/views/TdorComments.vue";
import {Icon} from "@iconify/vue";
import VueDatePicker from '@vuepic/vue-datepicker'
import {decode} from 'blurhash'
import urljoin from "url-join";
import {Component, Ref, Vue} from 'vue-facing-decorator';

@Component({ components: { TdorComments, Loading, RandomPerson, BirthdayButton, Icon, VueDatePicker } })
export default class Home extends Vue {
    clicked = ''
    showAdd = false
    isLoading = true

    lang = getLang()
    tdorTop = handleIconFromString(this.lang === 'zh_hans' ? tdorTop : (this.lang === 'zh_hant' ? tdorTopHant : tdorTopEn));
    tdorCommentView = handleIconFromString(this.lang === 'zh_hans' ? tdorCommentView : (this.lang === 'zh_hant' ? tdorCommentViewHant : tdorCommentViewEn));
    htmlTop = handleIconFromString(this.lang === 'zh_hans' ? htmlTop : (this.lang === 'zh_hant' ? htmlTopHant : htmlTopEn));
    htmlBottom = handleIconFromString(this.lang === 'zh_hans' ? htmlBottom : (this.lang === 'zh_hant' ? htmlBottomHant : htmlBottomEn));

    people: PersonMeta[] = null as never as PersonMeta[]
    fullPeople = [] as PersonMeta[]
    searchKey = ''
    dateRange = []
    isShuffle = false

    birthdayList = [] as [string, string][]

    @Ref() bookmarkTexts: HTMLDivElement[]
    @Ref() bookmark: HTMLDivElement[]

    isDeadlinePassed(): boolean {
        return true;
    }

    isShowCommentsEntry(): boolean {
        return true;
    }

    updated() {
        if ((this.bookmark != undefined) && (this.bookmark.length > 0)) {
            const width = this.bookmark[0].offsetWidth - 10
            for (const b of this.bookmarkTexts) fitText(b, { width })
        }
    }

    created(): void {
        info(`Language: ${this.lang}`)
        fetchWithLang(urljoin(dataHost, 'people-home-list.json'))
            .then(it => it.text())
            .then(it => {
                this.isShuffle = isEaster() && (gaussian() < 0.35)
                this.people = this.isShuffle ? shuffle(JSON.parse(it)) : JSON.parse(it)
                this.fullPeople = JSON.parse(it)
                const now = new Date();
                const pros = ((now.getDate() == 1) && (now.getMonth() + 1 == 4)) ? 0.5 : 0.05;
                if (isEaster() && (gaussian() < pros)) scheduledLoopTask(1500, () => {
                    this.people = gaussian_shuffle(this.people)
                })

                //blur canvas for loading images
                fetch(urljoin(dataHost, 'blur-code.json'))
                    .then(it => it.json())
                    .then(it => {
                        for (const p of this.people) {
                            if (typeof (it[p.id]) !== "string") continue;
                            const pixels = decode(it[p.id], 150, 150)
                            const canvas = document.getElementById(p.id + '-canvas') as HTMLCanvasElement;
                            const ctx = canvas.getContext("2d");
                            const imageData = ctx.createImageData(150, 150);
                            imageData.data.set(pixels);
                            ctx.putImageData(imageData, 0, 0);
                        }
                    })

                // insert entry with unknown date of pass away to random position
                if (!this.isShuffle) {
                    const u = this.people
                    this.people = []

                    for (const v of u) {
                        if (v.sortKey != 0) this.people.push(v);
                        else this.people = insert(this.people, v, randint(0, this.people.length - 1));
                    }
                }
            })

        fetch(urljoin(dataHost, 'birthday-list.json'))
            .then(it => it.json())
            .then(it => {
                for (const v of it) {
                    const d = new Date(v[1]);
                    const now = new Date();
                    if (d.getDate() == now.getDate() && d.getMonth() == now.getMonth()) {
                        const p = JSON.parse(getResponseSync(urljoin(peopleUrl(v[0]), getLang() == 'zh_hans' ? 'info.json' : `info.${getLang()}.json`))) as Person;
                        this.birthdayList.push([v[0], p.name])
                    }
                }
                console.log(this.birthdayList)
                if (this.birthdayList.length) viaBalloon()
            });
    }

    mounted() {
        if (isUwU()) {
            UwU()
        }
    }

    switchPage(p: PersonMeta): void {
        info(`switchPage(${p.id})`)
        router.push(`/profile/${p.id}`)
    }

    updateSearch() {
        this.people = [];
        for (const p of this.fullPeople) {
            if (p.id.trim().toLowerCase().includes(this.searchKey.trim().toLowerCase()) ||
                p.name.trim().toLowerCase().includes(this.searchKey.trim().toLowerCase())) {
                if (!this.dateRange) this.people.push(p);
                else if ((this.dateRange.length < 2)) this.people.push(p);
                else {
                    const sortDate = new Date(p.sortKey)
                    if ((this.dateRange[0].getTime() < sortDate.getTime()) &&
                        (this.dateRange[1].getTime() > sortDate.getTime())) {
                        this.people.push(p);
                    }
                }
            }
        }
    }

    profileUrl(p: PersonMeta): string {
        return replaceUrlVars(p.profileUrl, p.id)
    }
}
</script>

<style lang="sass" scoped>
@import "../css/colors"
@import "../css/motion"

@keyframes blink
    0%
        opacity: 1
    50%
        opacity: 0.75
    100%
        opacity: 1

.introduction
    text-align: justify
    text-justify: inter-word
    margin: 10px min(5vw, 40px)

.bottom
    padding-bottom: 250px

.randomButtons
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: center
    justify-items: center
    width: 90%
    gap: 20px
    margin: auto

.randomP
    margin: 10px 0px
    display: inline-flex

#profiles
    margin-top: 20px

.search-bar
    margin: 1rem auto
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    justify-content: space-around
    align-items: center
    padding: 0 2rem

    .search-icon
        width: 28px
        height: 28px
        color: $color-text-main
        cursor: pointer

    .search-input
        width: calc(50% - 48px)
        height: 26px
        color: $color-text-main
        background-color: rgba(0, 0, 0, 0.05)
        border-radius: 10px
        border: none
        outline: $color-text-main
        font-size: 16px
        text-indent: 5px
        padding: 6px 30px 6px 12px

        &:active
            outline: $color-text-main
            border: none

    .search-date
        width: calc(50% - 48px)
        height: 36px

// Profile picture alignment
.profile
    position: relative
    display: inline-block
    margin: 20px 20px 30px
    vertical-align: top
    text-align: left

    .fade-enter-active, .fade-leave-active
        transition: all .5s ease !important

    .fade-enter, .fade-leave-to
        opacity: 0

    .front, .back
        border: 10px solid white
        outline: 2px solid $color-text-main
        height: 150px
        width: 150px
        transition: all .25s ease
        overflow: hidden

    .blur
        z-index: 5
        position: absolute
        height: 150px
        top: 0
        left: 0
        animation: blink 2s ease infinite

    .profile-image
        width: 100%
        height: 100%
        z-index: 6
        position: absolute
        top: 0
        left: 0
        background: #00000000

    .back
        z-index: 2
        position: relative

    .front
        transform: rotate(10deg)
        position: absolute
        z-index: 4
        height: 150px
        top: 0
        left: 0

        background-blend-mode: screen
        background-color: #ffffff

    // Hover animation
    .front:hover
        transform: rotate(2deg)

    .name
        margin-top: 3px
        margin-left: 15px
        text-align: left
        position: relative
        z-index: 3
        display: inline-flex
        align-items: center
        font-weight: bold

    .back.add
        outline: 2px dashed $color-text-main
        font-size: 75px
        color: gray
        background-color: #f1f1f1

    .bookmark
        border: 40px solid rgba(255, 189, 202, 0.49)
        //$border: pink
        //filter: drop-shadow(0 2px 0 $border) drop-shadow(2px 0 0 $border) drop-shadow(-2px 0 0 $border)
        border-bottom: 10px solid transparent
        // width:        100px
        width: 0
        left: 10px
        height: 10px

        position: absolute
        bottom: -15px
        z-index: 2

.profiles-move
    transition: all 0.5s $ease-in-out-cric

.profiles-enter-active .profiles-leave-active
    transition: all .5s $ease-out-cric !important

.profiles-enter-from, .profiles-leave-to
    opacity: 0
    transform: translateY(50px)


@media screen and (max-width: 440px)
    .profile
        .front, .back
            border: 5px solid white
            $len: 30vw
            height: $len
            width: $len

        .blur
            height: 30vw

@media screen and (max-width: 700px)
    .search-bar
        display: flex
        flex-direction: column
        gap: 0.5rem

        .search-icon
            display: none

        .search-input
            width: calc(100% - 40px)

        .search-date
            width: 100%

[data-theme="dark"]
    .back, .front
        border: 10px solid rgba(27, 27, 32, 0.8964) !important
        outline: 2px solid $color-text-dark-main !important

    .bookmark
        border: 40px solid rgba(255, 189, 202, 0.25) !important
        border-bottom: 10px solid transparent !important

    .search-bar
        .search-icon
            color: $color-text-dark-main

        .search-input
            color: $color-text-dark-main
            outline: $color-text-dark-main
            background: rgba(255, 255, 255, 0.05)
</style>
