<template>
    <div>
        <div id="profile-page">
            <table id="info">
                <tbody>
                    <tr><td colspan="2">{{p.name}}</td></tr>
                    <tr>
                        <td colspan="2"><img :src="p.profileUrl" alt="profile" draggable="false"></td>
                    </tr>
                    <tr v-for="[key, value] of Object.entries(p.info)" :key="key">
                        <td>{{key}}</td>
                        <td>{{value}}</td>
                    </tr>
                </tbody>
            </table>

            <div id="content" v-html="markdownToHtml"></div>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import {exampleData, Person} from "@/logic/data";
import { marked } from 'marked';

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
    width: 280px
    float: right
    background-color: white
    border: 1px solid $color-text-special
    margin-left: 15px

    img
        width: 280px
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
