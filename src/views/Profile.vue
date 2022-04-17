<template>
    <div>
        <div id="profile-page">
            <div id="info" class="font-custom fbox-h" v-if="p">
                <!-- Horizontal Alignment of profile pic and the rest -->
                <div id="left" class="fbox-v">
                    <img :src="profileUrl" draggable="false" alt="profile">
                    <div class="spacer"/>
                    <div id="buttons">
                        <div class="button-container">
                            <div class="button anim fbox-vcenter" @click="flower"
                                 :class="(flowersGiven || loading.has('flower')) ? 'disabled' : ''">
                                <check v-if="flowersGiven" />
                                <lollipop v-else-if="!loading.has('flower')" />
                                <loading v-else />
                            </div>
                            <div class="text-under-button">{{flowerText}}</div>
                        </div>
                        <div class="button-container edit">
                            <div class="button anim fbox-vcenter" @click="edit"><edit/></div>
                            <div class="text-under-button">Edit</div>
                        </div>
                    </div>
                    <div class="spacer-bottom f-grow1"/>
                </div>
                <!-- Vertical Alignment of info section -->
                <div id="right" class="fbox-v">
                    <div id="name-box">
                        <span id="name-text">{{p.name}}</span>
                        <span id="id">@{{p.id}}</span>
                    </div>
                    <ul id="fields" class="f-grow1">
                        <li v-for="info of p.info" :key="info[0]">
                            <span class="key">{{info[0]}}：</span>
                            <span class="value">{{info[1]}}</span>
                        </li>
                    </ul>
                    <div id="websites" v-if="p.websites">
                        <span id="websites-text">网站：</span>
                        <a v-for="web of p.websites" :key="web[0]" :href="web[1]">
                            <i :class="getIcon(web[0])"></i>
                        </a>
                    </div>
                </div>
            </div>

            <MDX id="content" :code="compiledMdxCode"/>

            <ProfileComments id="comments" :p="p" v-if="p"/>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import {parsePeopleJson, Person} from "@/logic/data";
import {ElMessageBox} from 'element-plus';
import {abbreviateNumber, getTodayDate} from "@/logic/helper"
import {backendHost, peopleUrl, replaceUrlVars} from "@/logic/config";
import PhotoScroll from "@/components/PhotoScroll.vue";
import MDX from "@/components/MDX.vue";
import urljoin from "url-join";
import {Lollipop, Loading, Check, Edit} from "@element-plus/icons-vue";
import ProfileComments from "@/views/ProfileComments.vue";

const icons: {[id: string]: string} = {
    twitter: 'fab fa-twitter',
    telegram: 'fab fa-telegram',
    default: 'fas fa-link',
}

@Options({components: {ProfileComments, Lollipop, Loading, Check, Edit, MDX, PhotoScroll}})
export default class Profile extends Vue
{
    @Prop() userid!: string

    p: Person = null as never as Person
    compiledMdxCode = ''
    flowers = 0
    flowersGiven = false

    loading = new Set<string>()

    created(): void
    {
        this.flowersGiven = localStorage.getItem(`last_flower_given@${this.userid}`) === getTodayDate()

        const pu = peopleUrl(this.userid)

        // TODO: Handle errors
        // Get data from server
        fetch(urljoin(pu, `info.json`))
            .then(it => it.text())
            .then(it => {
                this.p = parsePeopleJson(it)
            })

        // TODO: Handle errors
        // Load compile MDX code from server
        fetch(urljoin(pu, `page.js`))
            .then(it => it.text())
            .then(it => this.compiledMdxCode = replaceUrlVars(it, this.userid))

        // TODO: Handle errors
        fetch(backendHost + `/flowers/get?id=${this.userid}`)
            .then(it => it.text())
            .then(it => {
                console.log(it)
                this.flowers = parseInt(it)
            })
    }

    getIcon(platform: string): string
    {
        if (platform in icons) return icons[platform]
        if (platform.startsWith('custom-icon:')) return platform.replace('custom-icon:', '')
        return icons.default
    }

    flower(): void
    {
        if (this.flowersGiven || this.loading.has('flower')) return

        // TODO: Handle errors
        // TODO: Better user interaction (probably like +1 animation or something)
        this.loading.add('flower')
        fetch(backendHost + `/flowers/give?id=${this.userid}`)
            .then(() =>
            {
                this.flowers += 1

                // Set flowers given
                this.flowersGiven = true
                localStorage.setItem(`last_flower_given@${this.userid}`, getTodayDate())
            })
            .finally(() => this.loading.delete('flower'))
    }

    get flowerText(): string
    {
        return abbreviateNumber(this.flowers)
    }

    edit(): void
    {
        ElMessageBox.confirm('要编辑什么呢？',
            {
                distinguishCancelAndClose: true,
                confirmButtonText: '信息卡片',
                cancelButtonText: '简介条目',
            })
            .then(() => {
                this.$router.push(`/edit-info/${this.p.id}`)
            })
            .catch((action) => {
                if (action === 'cancel') open(`https://github.com/hykilpikonna/our-data/tree/main/people/${this.userid}/page.md`)
            })
    }

    get profileUrl(): string
    {
        return replaceUrlVars(this.p.profileUrl, this.userid)
    }
}
</script>

<!-- Scoped Style -->
<style lang="sass" scoped>
@import "../css/colors"

svg
  width: 20px
  height: 20px

#profile-page
    padding: 0 20px
    margin-left: min(4vw, 40px)
    margin-right: min(4vw, 40px)

#content
    text-align: justify
    animation: fade-in-top-delayed 1.5s 0s ease

#comments
    text-align: justify
    animation: fade-in-top-delayed 2s 0s ease

#info
    font-size: 0.9em
    width: 100%
    background-color: $color-bg-6
    //border: 4px solid $color-text-main
    filter: drop-shadow(0 2px 5px rgba(166, 134, 89, 0.42))
    border-radius: 40px
    animation: fade-in-top 1s 0s ease

#right
    flex-grow: 1
    text-align: left
    margin-top: 20px
    margin-right: min(5vw, 50px)
    margin-bottom: 20px
    min-height: 200px
    overflow: hidden

    #name-box
        border-bottom: 2px solid $color-text-main

        #name-text
            font-size: 1.7em
            font-weight: bold
            margin-right: 8px

    #fields
        font-size: 1.1em
        padding: 0
        display: flex
        flex-direction: column
        flex-wrap: wrap
        margin: 10px 0

        white-space: nowrap

        li
            margin-left: 20px

            .key
                font-weight: bold

    #websites
        #websites-text
            font-weight: bold
        a
            color: $color-text-main
            text-decoration: none
            margin-right: 10px

#left
    margin-left: min(5vw, 60px)
    margin-right: min(5vw, 50px)
    height: unset

    img
        border: 10px solid white
        outline: 2px solid $color-text-main
        $length: max(110px, min(15vw, 150px))
        height: $length
        width: $length
        transition: all .25s ease
        transform: rotate(-15deg)

    .spacer
        min-height: 30px
        flex-grow: 2

    #buttons
        margin-bottom: 10px

        .button-container
            display: inline-flex
            flex-direction: column

        .button-container:first-child
            margin-right: 20px

        .button
            display: inline-flex
            align-items: center
            font-size: 20px
            width: 40px
            height: 40px
            border: 2px solid $color-text-main
            border-radius: 15px
            background: $color-bg-5

        .button.disabled
            cursor: not-allowed

        .button.disabled:hover
            transform: none
            box-shadow: none


// Phone layout: left becomes top and right becomes bottom
@media screen and (max-width: 570px)
    #info
        flex-direction: column

    #left
        flex-direction: row
        margin-bottom: -40px

        #buttons
            display: flex
            margin-top: 20px
            margin-right: 10px
            order: 1

            //.button-container:first-child
            //    margin-right: 0

        img
            order: 3
            transform: rotate(15deg)
            margin-right: -20px

        .spacer-bottom
            flex-grow: 0

        .spacer
            order: 2

    #right
        margin-left: 5vw
        margin-right: 5vw
        margin-top: 0

    #profile-page
        margin: 0 10px

// Even smaller screen
@media screen and (max-width: 400px)
    #profile-page
        margin: 0
        padding: 0

        // overflow hack
        // https://stackoverflow.com/questions/6421966/css-overflow-x-visible-and-overflow-y-hidden-causing-scrollbar-issue
        overflow-x: hidden
        margin-top: -50px
        padding-top: 50px

        #content
            margin: 10px

    #info
        margin-right: 0
        margin-left: 0
        border-radius: 0

    #left
        img
            height: 90px
            width: 90px
            border: 5px solid white
            outline: 2px solid $color-text-main

        .button-container.edit
            display: none !important

        #buttons
            .button-container
                flex-direction: row

            .text-under-button
                margin-left: 5px
                margin-top: 8px


            .button
                font-size: 15px
                width: 30px
                height: 30px

</style>
