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

    updated(): void {
        if (localStorage.getItem('lang') === 'en') return;
        if (this.userid == "MeowBot233") {
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
            const now = new Date()
            if ((now.getDate() == 15) && (now.getMonth() == 3)) {
                if (!localStorage.getItem("birthdayMeowBot233"))
                    localStorage.setItem("birthdayMeowBot233", (now.getFullYear() - 1).toString())
                if (parseInt(localStorage.getItem("birthdayMeowBot233")) != now.getFullYear()) {
                    Swal.fire({
                        icon: null,
                        position: "center",
                        toast: false,
                        title: null,
                        html: "<p style=\"text-align: left\">我依然无数次想起你，生活在充满你的世界里，和你一起找寻生活的希望。</p><p style=\"text-align: left\">我依然无数次想起你的声音和笑容。</p><p style=\"text-align: left\">我依然无数次想着你，想起那时，还有那时，还有努力留住你的温度的那时。</p><p style=\"text-align: left\">我依然深爱着你，如同以前和未来，你爱我那般。</p><p style=\"text-align: left\">我的坊洛猫猫，晚安好梦，明天见。</p><p style=\"text-align: left\">以及，生日快乐，亲爱的，我们一起许个愿吧。</p><p style=\"text-align: right\">——雪絵 澪奈</p>",
                        timer: 30000,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timerProgressBar: true,
                    })
                }
            }
        }
        if ((this.userid == "Anilovr") || (this.userid == "noname3031") || (this.userid == "dogesir_")) {
            if (!localStorage.getItem("Betelgeuse"))
                localStorage.setItem("Betelgeuse", `["${this.userid}"]`)
            else {
                const betelgeuse = JSON.parse(localStorage.getItem("Betelgeuse")) as string[]
                if (!betelgeuse.includes(this.userid)) {
                    betelgeuse.push(this.userid)
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
        if ((this.userid == "xuewulihuameng") || (this.userid == "Futajuhuacha") || (this.userid == "Xu_Yushu") || (this.userid == "Dethelly")) {
            if (!localStorage.getItem("ChongQing"))
                localStorage.setItem("ChongQing", `["${this.userid}"]`)
            else {
                const ch = JSON.parse(localStorage.getItem("ChongQing")) as string[]
                if (!ch.includes(this.userid)) {
                    ch.push(this.userid)
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
        if ((this.userid == "yumao") || (this.userid == "Uekawakuyuurei") || (this.userid == "MizuharaNagisa")) {
            if (!localStorage.getItem("Boat"))
                localStorage.setItem("Boat", `["${this.userid}"]`)
            else {
                const boat = JSON.parse(localStorage.getItem("Boat")) as string[]
                if (!boat.includes(this.userid)) {
                    boat.push(this.userid)
                    localStorage.setItem("Boat", JSON.stringify(boat))
                }
                if (boat.includes("yumao") && boat.includes("Uekawakuyuurei") && boat.includes("MizuharaNagisa") && (!localStorage.getItem("Sea"))) {
                    localStorage.setItem("Sea", "with you")
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        title: "船与海",
                        text: "妳把船往哪开呢?!",
                        timer: 5000,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timerProgressBar: true,
                        iconHtml: `<img style="width: 64px;height: 64px;border: none" src="/ship.png"></img>`,
                        iconColor: "#00000000",
                        background: "#0b2058ff",
                        color: "#f0f8feff"
                    })
                }
            }
        }
        if ((this.userid == "yumao")) {
            const summaries = document.getElementsByTagName("summary")
            for (const v of summaries) {
                console.log(v)
                v.addEventListener('click', (e) => {
                    console.log("summary" + e)
                    if (!localStorage.getItem('detailsByYumao')) {
                        localStorage.setItem('detainsByYumao', 'forever.')
                        Swal.fire({
                            toast: true,
                            position: "top-end",
                            title: "过往苦难",
                            text: "呐喊却无人知晓",
                            timer: 5000,
                            showConfirmButton: false,
                            showCancelButton: false,
                            timerProgressBar: true,
                            iconHtml: `<img style="width: 64px;height: 64px;border: none" src="/lifeline.png"></img>`,
                            iconColor: "#00000000",
                            background: "#DDDDDDFF"
                        })
                    }
                }, false)
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
