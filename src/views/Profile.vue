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
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { parsePeopleJson, Person } from "@/logic/data";
import { fetchWithLang } from "@/logic/helper"
import { Lang, peopleUrl, replaceUrlVars, setLang, t } from "@/logic/config";
import MDX from "@/components/MDX.vue";
import urljoin from "url-join";
import ProfileComments from "@/views/ProfileComments.vue";
import ProfileCard from '@/components/ProfileCard.vue';
import Swal from 'sweetalert2';

@Component({components: {ProfileCard, ProfileComments, MDX}})
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

        this.checkViewLimit()
    }

    checkViewLimit(): boolean | void {
        if (this.screenshotMode) return

        const config = { warningLimit: 10, errorLimit: 20, cooldown: 30 }

        const now = new Date()
        const [_time, _entries] = [localStorage.getItem("view_limit_time"), localStorage.getItem("view_limit_entries")]
        const [time, entries] = [new Date(_time), JSON.parse(_entries ?? "[]")]
        const elapsedMin = (now.getTime() - time.getTime()) / 60000

        // Initialize
        if (!_time || !_entries || elapsedMin > config.cooldown) {
            localStorage.setItem("view_limit_time", new Date().toUTCString())
            localStorage.setItem("view_limit_entries", JSON.stringify([this.userid]))
            return
        }

        // Check if user has viewed this page before
        if (!entries.includes(this.userid)) {
            entries.push(this.userid)
            localStorage.setItem("view_limit_entries", JSON.stringify(entries))

            // When it reaches 20 for the first time, reset timer
            if (entries.length == config.errorLimit) localStorage.setItem("view_limit_time", new Date().toUTCString())
        }

        // Warn when the view count reaches 10
        if (entries.length >= config.warningLimit) {
            console.log("View limit reached 10")
            Swal.fire({
                title: t.view_limit.title,
                text: t.view_limit.warning,
                icon: 'warning',
                timer: 30_000,
                timerProgressBar: true,
            })
        }

        // Hard limit at 20
        if (entries.length >= config.errorLimit) {
            console.log("View limit reached 20")
            Swal.fire({
                title: t.view_limit.title,
                text: t.view_limit.error,
                icon: 'error',
                showConfirmButton: false,
                allowOutsideClick() { return false },
                customClass: 'view-limit-alert'
            })

            // Easter egg: Watch when the user removes the DOM element in devtools
            const observer = new MutationObserver((changes) => {
                changes.forEach((change) => {
                    // Check if the removed node is the swal2 element
                    if (change.removedNodes.length == 0) return
                    if (!(change.removedNodes[0] as HTMLElement).classList.contains("swal2-container")) return

                    observer.disconnect()
                    setTimeout(() => {
                        Swal.fire({
                            title: t.view_limit.dom_removed_title,
                            text: t.view_limit.dom_removed,
                            icon: 'info',
                        })

                        // Reset the view limit
                        localStorage.removeItem("view_limit_time")
                    }, 100)
                })
            })
            observer.observe(document.body, { childList: true, subtree: true })

            return true
        }
    }

    mounted(): void {
        const path = this.$route.path.replace('/profile/', '')
        if (path == "MeowBot233") {
            if (this.lang != "en") {
                if (!localStorage.getItem("isSeenMeowBot233")) {
                    localStorage.setItem("isSeenMeowBot233", "找到了喵~")
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        title: "找到了喵~",
                        timer: 5000,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timerProgressBar: true,
                        iconHtml: `<img style="width: 64px;height: 57px;border: none" src="/cat-face-emoji-2048x1828.png"></img>`,
                        iconColor: "#00000000"
                    })
                }
            }
        }
        if ((path == "Anilovr") || (path == "noname3031") || (path == "dogesir_")) {
            if (!localStorage.getItem("Betelgeuse"))
                localStorage.setItem("Betelgeuse", `["${path}"]`)
            else {
                const betelgeuse = JSON.parse(localStorage.getItem("Betelgeuse")) as string[]
                if (!betelgeuse.includes(path)) {
                    betelgeuse.push(path)
                    localStorage.setItem("Betelgeuse", JSON.stringify(betelgeuse))
                }
                if (betelgeuse.includes("Anilovr") && betelgeuse.includes("noname3031") && betelgeuse.includes("dogesir_") && (!localStorage.getItem("BetelgeuseShown"))) {
                    localStorage.setItem("BetelgeuseShown", "R.I.P.")
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        title: "参宿四 ~Betelgeuse~",
                        text: "R.I.P  - Be resilient -",
                        timer: 5000,
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
        if ((path == "xuewulihuameng") || (path == "Futajuhuacha") || (path == "Xu_Yushu") || (path == "Dethelly")) {
            if (!localStorage.getItem("ChongQing"))
                localStorage.setItem("ChongQing", `["${path}"]`)
            else {
                const ch = JSON.parse(localStorage.getItem("ChongQing")) as string[]
                if (!ch.includes(path)) {
                    ch.push(path)
                    localStorage.setItem("ChongQing", JSON.stringify(ch))
                }
                if (ch.includes("xuewulihuameng") && ch.includes("Futajuhuacha") && ch.includes("Xu_Yushu") && ch.includes("Dethelly") && (!localStorage.getItem("ChongQingShown"))) {
                    localStorage.setItem("ChongQingShown", "Fog")
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        title: "嘉陵雾稠",
                        text: "雾, 与投江",
                        timer: 5000,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timerProgressBar: true,
                        iconHtml: `<img style="width: 64px;height: 47px;border: none" src="/bridge.png"></img>`,
                        iconColor: "#00000000",
                        background: "url(/fog.jpg)"
                    })
                }
            }
        }
    }
}
</script>

<style lang="sass">
div:has(.view-limit-alert)
    backdrop-filter: blur(10px)
</style>

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
