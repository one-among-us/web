<template>
    <div>
        <div id="profile-page">
            <div id="info" class="font-custom fbox-h">
                <!-- Horizontal Alignment of profile pic and the rest -->
                <div id="left" class="fbox-v">
                    <img :src="p.profileUrl" draggable="false" alt="profile" class="front">
                    <div class="spacer f-grow1"/>
                    <div id="buttons">
                        <div class="button fbox-vcenter"><i class="el-icon-lollipop"></i></div>
                        <div class="button fbox-vcenter"><i class="el-icon-edit"></i></div>
                    </div>
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
import {exampleData, Person} from "@/logic/data";
import { marked } from 'marked';

const icons: {[id: string]: string} = {
    twitter: 'fab fa-twitter',
    default: 'fas fa-link'
}

@Options({components: {}})
export default class Profile extends Vue
{
    @Prop() name!: string

    markdown = ''

    p!: Person
    created(): void
    {
        // TODO: Get data from server
        this.p = exampleData.filter(it => it.name == this.name)[0]

        // TODO: Load markdown from server
        fetch(`/${this.p.id}.md`).then(it => it.text()).then(it => this.markdown = it)
    }

    get markdownToHtml(): string
    {
        return marked(this.markdown)
    }

    getIcon(platform: string): string
    {
        if (platform in icons) return icons[platform]
        return icons.default
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

#info
    font-size: 0.9em
    width: 100%
    background-color: $color-bg-6
    //border: 4px solid $color-text-main
    filter: drop-shadow(0 2px 5px rgba(166, 134, 89, 0.42))
    border-radius: 40px

#right
    flex-grow: 1
    text-align: left
    margin-top: 20px
    margin-right: 50px
    margin-bottom: 20px
    min-height: 200px

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
    margin-left: 50px
    margin-right: 50px
    // height: unset

    img
        border: 10px solid white
        outline: 2px solid $color-text-main
        height: 150px
        width: 150px
        transition: all .25s ease
        transform: rotate(-15deg)

    .spacer
        min-height: 30px

    #buttons
        margin-bottom: 10px

        .button
            display: inline-flex
            font-size: 20px
            width: 40px
            height: 40px
            border: 2px solid $color-text-main
            border-radius: 15px

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
