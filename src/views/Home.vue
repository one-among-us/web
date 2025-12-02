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
                <button class="layout-toggle" @click="toggleLayout" :title="isGridLayout ? 'Switch to List Layout' : 'Switch to Grid Layout'">
                    <Icon :icon="isGridLayout ? 'mynaui:list' : 'mynaui:grid'" />
                </button>
            </div>

            <Loading v-if="isLoading"/>

            <transition-group id="profiles" class="unselectable" :class="{ 'grid-layout': isGridLayout, 'list-layout': !isGridLayout }" v-if="people" name="profiles" tag="div">
                <div class="profile" v-for="p in people" :key="p.id">
                    <!-- Grid Layout -->
                    <template v-if="isGridLayout">
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
                    </template>

                    <!-- List Layout -->
                    <template v-else>
                        <a :href="`/profile/${p.id}`" @click.exact.prevent="() => switchPage(p)" class="profile-link-wrapper">
                            <div class="avatar-container">
                                 <div class="back"/>
                                 <transition name="fade" @after-leave="() => switchPage(p)">
                                     <div class="front" v-if="clicked !== p.name">
                                         <canvas v-bind:id="p.id + '-canvas'" class="blur clickable"></canvas>
                                         <img :src="profileUrl(p)" draggable="false" alt="" class="profile-image clickable"
                                              @click.exact.prevent.stop="() => { if (!clicked) { clicked = p.name; } return false }"
                                              v-on:load="isLoading = false">
                                     </div>
                                 </transition>
                            </div>
                            <div class="profile-info">
                                <div class="name font-custom">{{ p.name }}</div>
                                <div class="description" v-if="getPersonDesc(p)">{{ getPersonDesc(p) }}</div>
                            </div>
                        </a>
                    </template>
                </div>

                <!-- TODO: "Add" button -->
                <div class="profile add-profile" v-if="showAdd">
                    <template v-if="isGridLayout">
                        <div class="back add fbox-vcenter">+</div>
                    </template>
                    <template v-else>
                        <div class="avatar-container">
                            <div class="back add fbox-vcenter">+</div>
                        </div>
                        <div class="profile-info">
                            <div class="name">Add profile</div>
                        </div>
                    </template>
                </div>
            </transition-group>

            <div class="introduction markdown-content" v-html="htmlBottom"/>
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
import tdorCommentViewEn from "@/assets/tdor-comments-head.en.md";
import tdorCommentViewHant from "@/assets/tdor-comments-head.zh_hant.md";
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
import {handleEasterEgg, isEaster} from "@/logic/easterEgg";
import {
    fetchWithLang,
    gaussian,
    gaussian_shuffle,
    getResponseSync,
    handleIconFromString,
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

    people = [] as PersonMeta[]
    fullPeople = [] as PersonMeta[]
    searchKey = ''
    dateRange = []
    isShuffle = false
    probabilities: any
    groups: string[][] = []

    isGridLayout = true

    birthdayList = [] as [string, string][]

    @Ref() bookmarkTexts: HTMLDivElement[]
    @Ref() bookmark: HTMLDivElement[]

    isDeadlinePassed(): boolean {
        return true;
    }

    isShowCommentsEntry(): boolean {
        return false;
    }

    updated() {
        this.fitBookmarkTexts();
    }

    fitBookmarkTexts() {
        if (this.isGridLayout && this.bookmark?.length > 0) {
            if (this.bookmark[0]) {
                const width = this.bookmark[0].offsetWidth - 10
                for (const b of this.bookmarkTexts) fitText(b, { width })
            }
        }
    }

    createGroups(peopleList: PersonMeta[]): PersonMeta[][] {
        // No groups defined: each person becomes a single-person group
        if (!this.groups?.length) {
            return peopleList.map(person => [person]);
        }

        // Groups defined: create group mapping
        const personToGroup = new Map<string, number>();
        this.groups.forEach((group, index) => {
            group.forEach(personId => personToGroup.set(personId, index));
        });

        // Initialize group arrays
        const allGroups = Array.from({ length: this.groups.length }, () => [] as PersonMeta[]);

        // Assign people to groups (ungrouped people become single-person groups)
        peopleList.forEach(person => {
            const groupIndex = personToGroup.get(person.id);
            if (groupIndex !== undefined) {
                allGroups[groupIndex].push(person);
            } else {
                allGroups.push([person]);
            }
        });

        return allGroups;
    }

    sortPeople(peopleList: PersonMeta[]): PersonMeta[] {
        // Convert people to groups
        const allGroups = this.createGroups(peopleList)
            .filter(group => group.length > 0)
            .map(group => {
                // Sort people within each group by sortKey (descending)
                group.sort((a, b) => b.sortKey.localeCompare(a.sortKey));
                return group;
            });

        // Separate groups into normal groups and zero-sortKey groups
        const normalGroups: PersonMeta[][] = [];
        const zeroGroups: PersonMeta[][] = [];

        allGroups.forEach(group => {
            const latestSortKey = group[0].sortKey;

            if (latestSortKey === "0") {
                zeroGroups.push(group);
            } else {
                normalGroups.push(group);
            }
        });

        // Sort normal groups by their representative sortKey (descending)
        normalGroups.sort((a, b) => b[0].sortKey.localeCompare(a[0].sortKey));

        // Build result: first add all normal groups in sorted order
        const result = normalGroups.flat();

        // Randomly insert zero-sortKey groups
        zeroGroups.forEach(zeroGroup => {
            // Keep noname at the end
            const insertPos = randint(0, result.length - 1);
            result.splice(insertPos, 0, ...zeroGroup);
        });

        return result;
    }

    created(): void {
        const savedLayout = localStorage.getItem('isGridLayout');
        if (savedLayout !== null) {
            this.isGridLayout = JSON.parse(savedLayout);
        }

        info(`Language: ${this.lang}`)
        handleEasterEgg();
        this.probabilities = JSON.parse(getResponseSync(urljoin(dataHost, 'probabilities.json')))
        this.groups = JSON.parse(getResponseSync(urljoin(dataHost, 'groups.json')))
        fetchWithLang(urljoin(dataHost, 'people-home-list.json'))
            .then(it => it.text())
            .then(it => {
                this.isShuffle = isEaster() && (gaussian() < 0.35)
                this.fullPeople = JSON.parse(it)
                for (const v of this.fullPeople) {
                    if (Object.keys(this.probabilities).includes(v.id)) {
                        const p = parseFloat(this.probabilities[v.id].toString())
                        if (Math.random() < p) {
                            this.people.push(v)
                        }
                    }
                    else {
                        this.people.push(v)
                    }
                }
                this.people = this.isShuffle ? shuffle(this.people) : this.people
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

                if (!this.isShuffle) {
                    this.people = this.sortPeople(this.people);
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

        // Wait for fonts to load and then refresh text sizes
        document.fonts.ready.then(() => {
            this.fitBookmarkTexts();
        });
    }

    toggleLayout() {
        this.isGridLayout = !this.isGridLayout;
        localStorage.setItem('isGridLayout', JSON.stringify(this.isGridLayout));
    }

    getPersonDesc(p: PersonMeta): string {
        if (p.desc !== undefined && typeof p.desc === 'string') {
            return p.desc;
        }
        // fallback for unknown date of pass away
        if (p.sortKey === '0' || p.sortKey === '-1') {
            return '';
        }
        // fallback to sortKey or empty string
        return p.sortKey || '';
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
@use "@/css/colors" as *
@use "@/css/motion" as *

// --- Global Styles & Animations ---
@keyframes blink
    0%
        opacity: 1
    50%
        opacity: 0.75
    100%
        opacity: 1

.introduction
    text-align: justify
    margin: 10px min(5vw, 40px)

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
        width: calc(50% - 68px)
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
        width: calc(50% - 68px)
        height: 36px

    .layout-toggle
        background: transparent
        border: 1px solid rgba(128, 128, 128, 0.5)
        border-radius: 8px
        padding: 6px 10px
        color: $color-text-main
        cursor: pointer
        transition: all 0.2s ease
        font-size: 20px
        flex-shrink: 0
        display: flex
        align-items: center
        &:hover
            background: rgba(128, 128, 128, 0.1)

// --- Base styles shared by all profiles ---
.profile
    .fade-enter-active, .fade-leave-active
        transition: all .5s ease !important

    .fade-enter-from, .fade-leave-to
        opacity: 0

    .front:hover
        transform: rotate(2deg)

    .front, .back
        outline: 2px solid $color-text-main
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
        top: 0
        left: 0
        background-blend-mode: screen
        background-color: #ffffff

// --- 1. Grid Layout Styles ---
#profiles.grid-layout
    // Profile picture alignment
    .profile
        position: relative
        display: inline-block
        margin: 20px 20px 30px
        vertical-align: top
        text-align: left

    .front, .back
        border: 10px solid white
        height: 150px
        width: 150px

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

// --- 2. List Layout Styles ---
#profiles.list-layout
    display: grid
    grid-template-columns: repeat(3, 1fr)
    gap: 15px
    max-width: 1400px
    padding: 0 40px
    overflow: visible

    // Profile picture alignment
    .profile
        background: rgba(0, 0, 0, 0.03)
        border: 1px solid rgba(0, 0, 0, 0.06)
        height: 82px
        overflow: visible
        // Hover animation
        &:hover
            background: rgba(0, 0, 0, 0.05)
            transform: translateY(-2px)
            .front
                transform: rotate(2deg)

    .profile-link-wrapper
        display: flex
        align-items: center
        text-decoration: none
        color: inherit
        width: 100%
        height: 100%
        gap: 15px

    .avatar-container
        position: relative
        flex-shrink: 0
        height: 80px
        width: 80px
        overflow: visible
        z-index: 10

    .front, .back
        border: 5px solid white
        height: 100%
        width: 100%
        box-sizing: border-box
        position: absolute
        top: 0
        left: 0

    .profile-info
        flex: 1
        min-width: 0
        padding-right: 15px
        overflow-x: hidden

    .name
        font-size: 18px
        font-weight: bold
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis

    .description
        margin-top: 4px
        font-size: 13px
        color: rgba($color-text-main, 0.75)
        display: -webkit-box
        -webkit-line-clamp: 2
        -webkit-box-orient: vertical
        overflow: hidden
        text-overflow: ellipsis
        line-height: 1.3
        max-height: calc(1.3em * 2)
        word-wrap: break-word
        text-wrap: balance

    @media (max-width: 1200px)
        grid-template-columns: repeat(2, 1fr)
    @media (max-width: 768px)
        grid-template-columns: 1fr

// --- Global Transitions & Responsive ---
.profiles-move
    transition: all 0.5s $ease-in-out-cric

.profiles-enter-active .profiles-leave-active
    transition: all .5s $ease-out-cric !important

.profiles-enter-from, .profiles-leave-to
    opacity: 0
    transform: translateY(50px)


@media screen and (max-width: 440px)
    #profiles.grid-layout .profile
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

// --- Dark Theme ---
[data-theme="dark"]
    .layout-toggle
        color: $color-text-dark-main
        border-color: rgba(200, 200, 200, 0.3)
        &:hover
            background: rgba(255, 255, 255, 0.08)

    .back, .front
        border-color: rgba(27, 27, 32, 0.8964) !important
        outline-color: $color-text-dark-main !important

    #profiles.grid-layout
        .bookmark
            border-color: rgba(255, 189, 202, 0.25) !important
            border-bottom-color: transparent !important

    #profiles.list-layout
        .profile
            background: rgba(255, 255, 255, 0.03)
            border-color: rgba(255, 255, 255, 0.08)
            &:hover
                background: rgba(255, 255, 255, 0.06)
        .name
            color: $color-text-dark-main
        .description
            color: rgba($color-text-dark-main, 0.7)

    .search-bar
        .search-icon
            color: $color-text-dark-main

        .search-input
            color: $color-text-dark-main
            outline: $color-text-dark-main
            background: rgba(255, 255, 255, 0.05)
</style>
