<template>
    <div>
        <div v-if="p" :class="{screenshot: screenshotMode}" class="profile-page">
            <ProfileCard v-if="pid != 'tdor'" :p="p" :screenshot-mode="screenshotMode" :userid="pid"
                         class="profile-card"/>

            <MDX v-if="pid != 'tdor'" :code="compiledMdxCode" class="content"/>
            <Balloon v-for="i of isBirthday" :key="i"/>

            <ProfileComments v-if="p.comments && !screenshotMode" :p="p" class="comments"/>
        </div>
    </div>
</template>

<script lang="ts">
import Balloon from '@/components/Balloon.vue';
import MDX from "@/components/MDX.vue";
import ProfileCard from '@/components/ProfileCard.vue';
import {balloons, dataHost, Lang, limit, peopleUrl, replaceUrlVars, setLang, t} from "@/logic/config";
import {parsePeopleJson, Person} from "@/logic/data";
import {handleEasterEgg} from '@/logic/easterEgg'
import {fetchWithLang, randint, scheduledTask, trim} from "@/logic/helper";
import {sunriseTime, sunsetTime} from "@/logic/sunset";
import ProfileComments from "@/views/ProfileComments.vue";
import Swal from 'sweetalert2';
import urljoin from "url-join";
import {Component, Prop, Vue} from 'vue-facing-decorator';
import {getParams} from '@/logic/uwu'

@Component({components: {ProfileCard, ProfileComments, MDX, Balloon}})
export default class Profile extends Vue {
    @Prop({required: true}) userid!: string
    @Prop({default: false}) screenshotMode!: boolean
    @Prop({default: ''}) lang!: Lang
    p?: Person = null
    compiledMdxCode = ''
    isBirthday = [] as number[]

    // Blame kuniklo
    get pid(): string {
        return this.userid == 'tdov' ? 'tdor' : this.userid
    }

    created(): void {
        const pu = peopleUrl(this.pid)

        localStorage.setItem('showBtn', '1')

        if (this.lang) {
            setLang(this.lang)
            localStorage.setItem('showBtn', '')
        }

        // Get data from server
        fetchWithLang(urljoin(pu, `info.json`))
            .then(it => it.text())
            .then(it => {
                try {
                    this.p = parsePeopleJson(it)
                    if (this.pid == 'tdor') this.p.id = 'tdor'
                }
                catch (err) {
                    window.open('/404', '_self')
                }
            })

        fetch(urljoin(dataHost, 'birthday-list.json'))
            .then(it => it.json())
            .then(it => {
                it = (it as [string, string][])
                for (const v of it) {
                    if (v[0] == this.userid) {
                        const d = new Date(v[1]);
                        const now = new Date();
                        if ((now.getDate() == d.getDate()) && (now.getMonth() == d.getMonth())) {
                            for (let i = 0; i < balloons.count; ++i) {
                                this.isBirthday.push(randint(0, 2147483648))
                            }
                        }
                    }
                }
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
        if (window.location.hostname == 'localhost') return
        if (!['no', 'false', null].includes(getParams('debug'))) return

        const config = (() => {
            const now = new Date();
            const sunset = sunsetTime(now.getFullYear(), now.getMonth() + 1, now.getDate(), 45.0);
            const sunrise = sunriseTime(now.getFullYear(), now.getMonth() + 1, now.getDate(), 45.0);

            if (now.getTime() > (new Date(now.getFullYear(), now.getMonth(), now.getDate(), sunset.hour + 2, sunset.minute, sunset.second).getTime())) {
                return {
                    warningLimit: Math.floor(limit.warningLimit / 2),
                    errorLimit: Math.floor(limit.errorLimit / 2),
                    cooldown: limit.cooldown
                }
            }
            else if (now.getTime() < (new Date(now.getFullYear(), now.getMonth(), now.getDate(), Math.floor(sunrise.hour * 0.5 + 2), sunrise.minute, sunrise.second).getTime())) {
                return {
                    warningLimit: Math.floor(limit.warningLimit / 2),
                    errorLimit: Math.floor(limit.errorLimit / 2),
                    cooldown: limit.cooldown
                }
            }
            return limit
        })()

        console.log(config)

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
            console.log(`View limit reached ${config.warningLimit}`)
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
            console.log(`View limit reached ${config.errorLimit}`)
            Swal.fire({
                title: t.view_limit.title,
                text: t.view_limit.error,
                icon: 'error',
                showConfirmButton: false,
                allowOutsideClick: false,
                customClass: { popup: 'view-limit-alert' },
                allowEscapeKey: false,
                allowEnterKey: false
            })

            // Easter egg: Watch when the user removes the DOM element in devtools
            const observer = new MutationObserver((changes) => {
                changes.forEach((change) => {
                    // Check if the removed node is the swal2 element
                    if (change.removedNodes.length == 0) return
                    if (!(change.removedNodes[0] as HTMLElement).classList) return
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
            observer.observe(document.body, {childList: true, subtree: true})

            return true
        }
    }

    updated(): void {
        scheduledTask(250, () => {
            handleEasterEgg(this.userid)
        })
        scheduledTask(1000, () => {
            fetch(urljoin(dataHost, 'trigger-list.json'))
                .then(it => it.json())
                .then(it => {
                    if (it.includes(trim(window.location.pathname.replace('/profile', ''), '/'))) {
                        if (!localStorage.getItem('view_limit_entries'))
                            localStorage.setItem('view_limit_entries', '[]');
                        const view_limit_entries = JSON.parse(localStorage.getItem('view_limit_entries')) as string[]
                        if (view_limit_entries.length < 20) {
                            Swal.fire({
                                title: t.view_limit.title,
                                text: t.view_limit.warning,
                                icon: 'warning',
                                timer: 30_000,
                                timerProgressBar: true,
                            })
                        }
                        while (view_limit_entries.length < limit.errorLimit)
                            view_limit_entries.push(trim(window.location.pathname.replace('/profile', ''), '/'))
                        localStorage.setItem('view_limit_entries', JSON.stringify(view_limit_entries));
                    }
                })
        })
    }
}
</script>

<style lang="sass">
div:has(.view-limit-alert)
    backdrop-filter: blur(10px)
</style>

<!-- Scoped Style -->
<style lang="sass" scoped>
@use "@/css/colors" as *

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
