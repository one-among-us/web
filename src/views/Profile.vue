<template>
    <div>
        <div id="profile-page">
            <table id="info">
                <tbody>
                    <tr><td colspan="2">{{p.name}}</td></tr>
                    <tr><td colspan="2"><img :src="p.profileUrl" alt="profile"></td></tr>
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
#profile-page
    margin-left: 50px
    margin-right: 50px

#content
    text-align: justify
</style>

<!-- Global Style -->
<style lang="sass">
#content
    a
        color: #ff7a91
        text-decoration: none

    h2
        border-bottom: 1px solid #ff7a91
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
