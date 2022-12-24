<template>
    <div>
        <div id="profile-page">
            <ProfileCard :userid="userid" :p="p" v-if="p" />

            <MDX id="content" :code="compiledMdxCode"/>

            <ProfileComments id="comments" :p="p" v-if="p"/>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import {parsePeopleJson, Person} from "@/logic/data";
import {fetchWithLang} from "@/logic/helper"
import {peopleUrl, replaceUrlVars} from "@/logic/config";
import MDX from "@/components/MDX.vue";
import urljoin from "url-join";
import pangu from "pangu";
import ProfileComments from "@/views/ProfileComments.vue";
import ChannelBackupButton from "@/components/ChannelBackupButton.vue";
import ProfileCard from '@/components/ProfileCard.vue';

@Options({components: {ProfileCard, ProfileComments, MDX, ChannelBackupButton}})
export default class Profile extends Vue
{
    @Prop({required: true}) userid!: string

    p?: Person = null
    compiledMdxCode = ''

    created(): void
    {
        const pu = peopleUrl(this.userid)

        // TODO: Handle errors
        // Get data from server
        fetchWithLang(urljoin(pu, `info.json`))
            .then(it => it.text())
            .then(it => {
                this.p = parsePeopleJson(it)
            })

        // TODO: Handle errors
        // Load compile MDX code from server
        fetchWithLang(urljoin(pu, `page.js`))
            .then(it => it.text())
            .then(it => this.compiledMdxCode = replaceUrlVars(it, this.userid))
    }

    updated()
    {
        // Fix spacing around alphabetical words placed in between chinese sentences.
        pangu.autoSpacingPage();
    }
}
</script>

<!-- Scoped Style -->
<style lang="sass" scoped>
@import "../css/colors"

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

// Phone layout: left becomes top and right becomes bottom
@media screen and (max-width: 570px)
    #profile-page
        margin: 0 10px

// Even smaller screen
@media screen and (max-width: 400px)
    #profile-page
        margin: 0
        padding: 0

        // overflow hack
        // https://stackoverflow.com/questions/6421966/css-overflow-x-visible-and-overflow-y-hidden-causing-scrollbar-issue
        overflow: hidden
        margin-top: -50px
        padding-top: 50px

        #content, #comments
            margin: 10px
</style>
