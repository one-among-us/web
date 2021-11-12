<template>
    <div>
        <div id="profile-page">
            <div id="info" class="font-custom fbox-h" v-if="p">
                <!-- Horizontal Alignment of profile pic and the rest -->
                <div id="left" class="fbox-v">
                    <img :src="p.profileUrl" draggable="false" alt="profile" class="button anim front"
                         @click="image">
                    <div class="spacer"/>
                    <div id="buttons">
                        <div class="button anim fbox-vcenter" @click="flower"><i class="el-icon-lollipop"></i></div>
                        <div class="button anim fbox-vcenter" @click="edit"><i class="el-icon-edit"></i></div>
                    </div>
                    <div class="f-grow1"/>
                </div>
                <!-- Vertical Alignment of info section -->
                <div id="right" class="fbox-v">
                    <div id="name-box">
                        <span id="name-text">{{p.name}}</span>
                        <span id="id">@{{p.id}}</span>
                    </div>
                    <ul id="fields" class="f-grow1">
                        <li v-for="[key, value] of Object.entries(p.info)" :key="key">
                            <span class="key">{{key}}：</span>
                            <span class="value">{{value}}</span>
                        </li>
                    </ul>
                    <div id="websites" v-if="p.websites !== undefined &&
                                             Object.keys(p.websites).length !== 0">
                        <span id="websites-text">网站：</span>
                        <a v-for="[key, value] of Object.entries(p.websites)" :key="key"
                           :href="value">
                            <i :class="getIcon(key)"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div id="content" v-html="markdownToHtml"></div>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import {Person} from "@/logic/data";
import { marked } from 'marked';
import { ElMessage } from 'element-plus';
import {download} from "@/logic/html-helper"
import {dataHost} from "@/logic/config.";
import json5 from "json5";

const icons: {[id: string]: string} = {
    twitter: 'fab fa-twitter',
    default: 'fas fa-link'
}

@Options({components: {}})
export default class Profile extends Vue
{
    @Prop() userid!: string

    p: Person = null as never as Person
    markdown = ''

    created(): void
    {
        // Get data from server
        fetch(`${dataHost}/people/${this.userid.toLowerCase()}/info.json5`)
            .then(it => it.text())
            .then(it => {
                this.p = json5.parse(it)
                if (!this.p.info) this.p.info = {}
                if (!this.p.websites) this.p.websites = {}
            })

        // Load markdown from server
        fetch(dataHost + `/people/${this.userid.toLowerCase()}/page.md`)
            .then(it => it.text())
            .then(it => this.markdown = it)
    }

    get markdownToHtml(): string
    {
        return marked(this.markdown)
    }

    getIcon(platform: string): string
    {
        if (platform in icons) return icons[platform]
        if (platform.startsWith('custom-icon:')) return platform.replace('custom-icon:', '')
        return icons.default
    }

    image(): void
    {
        ElMessage.error('TODO: 实现它')
    }

    flower(): void
    {
        ElMessage.error('TODO: 实现它')
    }

    edit(): void
    {
        download('page.md', this.markdown)
    }
}
</script>

<!-- Scoped Style -->
<style lang="sass" scoped>
@import "../css/colors"

#profile-page
    margin-left: 50px
    margin-right: 50px

#content
    text-align: justify
    animation: fade-in-top 1s .5s ease forwards
    opacity: 0

#info
    font-size: 0.9em
    width: 100%
    background-color: $color-bg-6
    //border: 4px solid $color-text-main
    filter: drop-shadow(0 2px 5px rgba(166, 134, 89, 0.42))
    border-radius: 40px
    animation: fade-in-top 1s 0s ease forwards

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

        .button
            display: inline-flex
            font-size: 20px
            width: 40px
            height: 40px
            border: 2px solid $color-text-main
            border-radius: 15px
            background: $color-bg-5

        .button:first-child
            margin-right: 20px
</style>

<!-- Global Style -->
<style lang="sass">
@import "../css/colors"

#content
    a
        color: $color-text-special
        text-decoration: none

    h2
        border-bottom: 1px solid $color-text-special
        font-size: 1.5em
        margin-top: 1em

    h1, h2
        line-height: 1.3
        margin-bottom: 0.25em
        padding: 0

    p
        font-size: 0.875em
        margin: 0.5em 0
        line-height: 1.6
</style>
