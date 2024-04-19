<template>
    <div>
        <div class="profile-page" :class="{screenshot: screenshotMode}" v-if="p">
            <ProfileCard class="profile-card" :userid="pid" :p="p" v-if="pid != 'tdor'" :screenshot-mode="screenshotMode" />

            <MDX class="content" :code="compiledMdxCode" v-if="pid != 'tdor'"/>

            <ProfileComments class="comments" :p="p" v-if="p.comments && !screenshotMode"/>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import {parsePeopleJson, Person} from "@/logic/data";
import {fetchWithLang} from "@/logic/helper"
import {peopleUrl, replaceUrlVars, setLang, Lang} from "@/logic/config";
import MDX from "@/components/MDX.vue";
import urljoin from "url-join";
import ProfileComments from "@/views/ProfileComments.vue";
import ProfileCard from '@/components/ProfileCard.vue';
import Swal from 'sweetalert2';

@Options({components: {ProfileCard, ProfileComments, MDX}})
export default class Profile extends Vue
{
    @Prop({required: true}) userid!: string
    @Prop({default: false}) screenshotMode!: boolean
    @Prop({default: ''}) lang!: Lang

    // Blame kuniklo
    get pid(): string { return this.userid == 'tdov' ? 'tdor' : this.userid }

    p?: Person = null
    compiledMdxCode = ''

    created(): void
    {
        const pu = peopleUrl(this.pid)

        localStorage.setItem('showBtn', '1')
        
        if (this.lang) {
            setLang(this.lang)
            localStorage.setItem('showBtn', '')
        }

        // TODO: Handle errors
        // Get data from server
        fetchWithLang(urljoin(pu, `info.json`))
            .then(it => it.text())
            .then(it => {
                this.p = parsePeopleJson(it)
                if (this.pid == 'tdor') this.p.id = 'tdor'
            })

        if (this.pid == 'tdor') return

        // TODO: Handle errors
        // Load compile MDX code from server
        if (!this.screenshotMode) fetchWithLang(urljoin(pu, `page.json`))
            .then(it => it.json())
            .then(it => this.compiledMdxCode = replaceUrlVars(it, this.pid))

    }

    mounted(): void {
        const path = this.$route.path
        if (path == "/profile/MeowBot233") {
            if (this.lang != "en") {
                if (!localStorage.getItem("isSeenMeowBot233")) {
                    localStorage.setItem("isSeenMeowBot233", "找到了喵~")
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        title: "找到了喵~",
                        timer: 2500,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timerProgressBar: true,
                        iconHtml: `<img style="width: 64px;height: 57px;border: none" src="/cat-face-emoji-2048x1828.png"></img>`,
                        iconColor: "#00000000"
                    })
                }
            }
        }
        if ((path == "/profile/Anilovr") || (path == "/profile/noname3031") || (path == "/profile/dogesir_")) {
            if (!localStorage.getItem("Betelgeuse"))
                localStorage.setItem("Betelgeuse", `["${path}"]`)
            else {
                const betelgeuse = JSON.parse(localStorage.getItem("Betelgeuse")) as string[]
                if (!betelgeuse.includes(path)) {
                    betelgeuse.push(path)
                    localStorage.setItem("Betelgeuse", JSON.stringify(betelgeuse))
                }
                if (betelgeuse.includes("/profile/Anilovr") && betelgeuse.includes("/profile/noname3031") && betelgeuse.includes("/profile/dogesir_") && (!localStorage.getItem("BetelgeuseShown"))) {
                    localStorage.setItem("BetelgeuseShown", "R.I.P.")
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        title: "参宿四 ~Betelgeuse~",
                        text: "R.I.P  - Be resilient -",
                        timer: 2500,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timerProgressBar: true,
                        iconHtml: `<img style="width: 64px;height: 64px;border: none" src="/betelgeuse.png"></img>`,
                        iconColor: "#00000000",
                        background: "url(/stardust.jpg)",
                        color: "#f0f8ff"
                    })
                }
            }
        }
    }
}
</script>

<!-- Scoped Style -->
<style lang="sass" scoped>
@import "../css/colors"

.profile-page
    padding: 0 20px
    margin-left: min(4vw, 40px)
    margin-right: min(4vw, 40px)

.content
    margin-top: 20px
    text-align: justify
    animation: fade-in-top-delayed 1.5s 0s ease

.comments
    text-align: justify
    animation: fade-in-top-delayed 2s 0s ease

// Phone layout: left becomes top and right becomes bottom
@media screen and (max-width: 570px)
    .profile-page
        margin: 0 10px

// Even smaller screen
@media screen and (max-width: 400px)
    .profile-page
        margin-left: 0
        margin-right: 0
        padding-left: 0
        padding-right: 0

        // overflow hack
        // https://stackoverflow.com/questions/6421966/css-overflow-x-visible-and-overflow-y-hidden-causing-scrollbar-issue
        overflow: hidden
        margin-top: -50px
        padding-top: 50px

        .content, .comments
            margin-left: 10px
            margin-right: 10px
</style>
