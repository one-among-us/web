<template>
    <div>
        <div id="home" :class="clicked ? 'clicked' : ''">

            <!-- If needed, delete 3 lines below. -->

            <div class="introduction markdown-content" v-html="tdorCommentView" v-if="isShowCommentsEntry()"/>

            <div class="introduction markdown-content" v-html="tdorTop" v-if="!isDeadlinePassed()"/>

            <TdorComments v-if="!isDeadlinePassed()"/>

            <img src="/kawaii.oau.png" class="kawaii" v-show="uwu"/>

            <div class="introduction markdown-content" v-html="htmlTop"/>

            <div class=randomButtons>
                <RandomPerson class="randomP"/>
                <BirthdayButton class="randomP" v-for="i of birthdayList" :key="i[0]" :id="i[0]" :name="i[1]"/>
            </div>
            <Loading v-if="isLoading"/>

            <transition-group id="profiles" class="unselectable" v-if="people" name="profiles" tag="div">
                <div class="profile" v-for="p in people" :key="p.id">
                    <div class="back"/>
                    <a :href="`/profile/${p.id}`" @click.exact.prevent.stop="() => false">
                        <transition name="fade" @after-leave="() => switchPage(p)">
                            <img :src="profileUrl(p)" draggable="false" alt="profile" class="front clickable"
                                 @click.exact="() => { if (!clicked) { clicked = p.name; } return false }"
                                 v-if="clicked !== p.name"
                                 v-on:load="isLoading = false">
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
    gaussian, gaussian_shuffle,
    getResponseSync,
    handleIconFromString,
    scheduledLoopTask,
    shuffle,
} from "@/logic/helper";
import {info} from '@/logic/utils';
import {isUwU, UwU} from "@/logic/uwu";
import {viaBalloon} from "@/logic/viaFetch";
import router from "@/router";
import TdorComments from "@/views/TdorComments.vue";
import urljoin from "url-join";
import {Component, Ref, Vue} from 'vue-facing-decorator';

@Component({ components: { TdorComments, Loading, RandomPerson, BirthdayButton } })
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

    birthdayList = [] as [string, string][]

    @Ref() bookmarkTexts: HTMLDivElement[]
    @Ref() bookmark: HTMLDivElement[]

    uwu = isUwU() && getLang() === 'en'

    isDeadlinePassed(): boolean {
        // const deadlineDate = new Date(2024, 2, 27, 16, 0); // March 27, 2024, 16:00 (UTC); Wrong! not UTC!
        // const now = new Date();
        // return now > deadlineDate;
        return true;
    }

    isShowCommentsEntry(): boolean {
        // const startTime = new Date(2024, 2, 31, 12, 0); // March 31, 2024, 20:00 (CST) Wrong! not UTC!
        // const endTime = new Date(2024, 3, 6, 12, 0); // April 6, 2024, 20:00 (CST) Wrong! not UTC!
        // const now = new Date();
        // return (now > startTime) && (now < endTime);
        return false;
    }

    updated() {
        if (this.bookmark != undefined) {
            const width = this.bookmark[0].offsetWidth - 10
            for (const b of this.bookmarkTexts) fitText(b, { width })
        }
    }

    created(): void {
        info(`Language: ${this.lang}`)
        fetchWithLang(urljoin(dataHost, 'people-home-list.json'))
            .then(it => it.text())
            .then(it => {
                this.people = (isEaster() && (gaussian() < 0.35)) ? shuffle(JSON.parse(it)) : JSON.parse(it)
                const now = new Date();
                const pros = ((now.getDate() == 1) && (now.getMonth() + 1 == 4)) ? 0.5 : 0.05;
                if (isEaster() && (gaussian() < pros)) scheduledLoopTask(1500, () => {
                    this.people = gaussian_shuffle(this.people)
                })
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

    profileUrl(p: PersonMeta): string {
        return replaceUrlVars(p.profileUrl, p.id)
    }
}
</script>

<style lang="sass" scoped>
@import "../css/colors"
@import "../css/motion"

.introduction
    text-align: justify
    text-justify: inter-word
    margin: 10px min(5vw, 40px)

.kawaii
    width: 50%
    height: fit-content
    margin: 30px auto

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

@media screen and (max-width: 440px)
    .profile
        .front, .back
            border: 5px solid white
            $len: 30vw
            height: $len
            width: $len

[data-theme="dark"]
    .back, .front
        border: 10px solid rgba(27, 27, 32, 0.8964) !important
        outline: 2px solid $color-text-dark-main !important

    .bookmark
        border: 40px solid rgba(255, 189, 202, 0.25) !important
        border-bottom: 10px solid transparent !important
</style>
