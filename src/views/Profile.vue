<template>
    <main>
        <div v-if="p" :class="{screenshot: screenshotMode}" class="profile-page">
            <ProfileCard v-if="pid != 'tdor'" :p="p" :screenshot-mode="screenshotMode" :userid="pid"
                         class="profile-card"/>

            <MDX v-if="pid != 'tdor'" :code="compiledMdxCode" class="content"/>
            <Balloon v-for="i of isBirthday" :key="i"/>

            <ProfileComments v-if="p.comments && !screenshotMode" :p="p" class="comments"/>
        </div>
    </main>
</template>

<script setup lang="ts">
import {computed, onUpdated, ref} from 'vue'
import Balloon from '@/components/Balloon.vue';
import MDX from "@/components/MDX.vue";
import ProfileCard from '@/components/ProfileCard.vue';
import {balloons, dataHost, Lang, limit, peopleUrl, replaceUrlVars, setLang, t} from "@/logic/config";
import {parsePeopleJson, Person} from "@/logic/data";
import {handleEasterEgg} from '@/logic/easterEgg'
import {fetchWithLang, randint, scheduledTask, trim} from "@/logic/helper";
import {BirthdayEntry, getTodayContext, isTodayBirthday} from "@/logic/birthday";
import {sunriseTime, sunsetTime} from "@/logic/sunset";
import ProfileComments from "@/views/ProfileComments.vue";
import Swal from 'sweetalert2';
import {getSwalTheme} from "@/logic/theme";
import urljoin from "url-join";
import {getParams} from '@/logic/uwu'

defineOptions({
    name: 'ProfileView'
})

const props = withDefaults(defineProps<{
    userid: string
    screenshotMode?: boolean
    lang?: Lang | ''
}>(), {
    screenshotMode: false,
    lang: ''
})

const p = ref<Person | null>(null)
const compiledMdxCode = ref('')
const isBirthday = ref<number[]>([])

const pid = computed(() => props.userid == 'tdov' ? 'tdor' : props.userid)

function checkViewLimit(): boolean | void {
    if (props.screenshotMode) return
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
    if (!_time || !_entries) {
        localStorage.setItem("view_limit_time", new Date().toUTCString())
        localStorage.setItem("view_limit_entries", JSON.stringify([props.userid]))
        return
    }
    const [time, entries] = [new Date(_time), JSON.parse(_entries)]
    const elapsedMin = (now.getTime() - time.getTime()) / 60000
    if (elapsedMin > config.cooldown) {
        localStorage.setItem("view_limit_time", new Date().toUTCString())
        localStorage.setItem("view_limit_entries", JSON.stringify([props.userid]))
        return
    }

    if (!entries.includes(props.userid)) {
        entries.push(props.userid)
        localStorage.setItem("view_limit_entries", JSON.stringify(entries))

        if (entries.length == config.errorLimit) localStorage.setItem("view_limit_time", new Date().toUTCString())
    }

    if (entries.length >= config.warningLimit) {
        console.log(`View limit reached ${config.warningLimit}`)
        Swal.fire({
            title: t.view_limit.title,
            text: t.view_limit.warning,
            icon: 'warning',
            timer: 30_000,
            timerProgressBar: true,
            theme: getSwalTheme()
        })
    }

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
            allowEnterKey: false,
            theme: getSwalTheme()
        })

        const observer = new MutationObserver((changes) => {
            changes.forEach((change) => {
                if (change.removedNodes.length == 0) return
                if (!(change.removedNodes[0] as HTMLElement).classList) return
                if (!(change.removedNodes[0] as HTMLElement).classList.contains("swal2-container")) return

                observer.disconnect()
                setTimeout(() => {
                    Swal.fire({
                        title: t.view_limit.dom_removed_title,
                        text: t.view_limit.dom_removed,
                        icon: 'info',
                        theme: getSwalTheme()
                    })

                    localStorage.removeItem("view_limit_time")
                }, 100)
            })
        })
        observer.observe(document.body, {childList: true, subtree: true})

        return true
    }
}

function createdLogic(): void {
    const pu = peopleUrl(pid.value)

    localStorage.setItem('showBtn', '1')

    if (props.lang) {
        setLang(props.lang)
        localStorage.setItem('showBtn', '')
    }

    fetchWithLang(urljoin(pu, `info.json`))
        .then(it => it.text())
        .then(it => {
            try {
                p.value = parsePeopleJson(it)
                if (pid.value == 'tdor' && p.value) p.value.id = 'tdor'
            }
            catch (err) {
                window.open('/404', '_self')
            }
        })

    fetch(urljoin(dataHost, 'birthday-list.json'))
        .then(it => it.json())
        .then(it => {
            const today = getTodayContext()
            for (const v of (it as BirthdayEntry[])) {
                if (v[0] == props.userid) {
                    if (isTodayBirthday(v, today)) {
                        for (let i = 0; i < balloons.count; ++i) {
                            isBirthday.value.push(randint(0, 2147483648))
                        }
                    }
                }
            }
        })

    if (pid.value == 'tdor') return

    if (!props.screenshotMode) fetchWithLang(urljoin(pu, `page.json`))
        .then(it => it.json())
        .then(it => compiledMdxCode.value = replaceUrlVars(it, pid.value))

    checkViewLimit()
}

createdLogic()

onUpdated((): void => {
    scheduledTask(250, () => {
        handleEasterEgg(props.userid)
    })
    scheduledTask(1000, () => {
        fetch(urljoin(dataHost, 'trigger-list.json'))
            .then(it => it.json())
            .then(it => {
                if (it.includes(trim(window.location.pathname.replace('/profile', ''), '/'))) {
                    if (!localStorage.getItem('view_limit_entries'))
                        localStorage.setItem('view_limit_entries', '[]');
                    const storedEntries = localStorage.getItem('view_limit_entries')
                    const view_limit_entries = JSON.parse(storedEntries ?? '[]') as string[]
                    if (view_limit_entries.length < 20) {
                        Swal.fire({
                            title: t.view_limit.title,
                            text: t.view_limit.warning,
                            icon: 'warning',
                            timer: 30_000,
                            timerProgressBar: true,
                            theme: getSwalTheme()
                        })
                    }
                    while (view_limit_entries.length < limit.errorLimit)
                        view_limit_entries.push(trim(window.location.pathname.replace('/profile', ''), '/'))
                    localStorage.setItem('view_limit_entries', JSON.stringify(view_limit_entries));
                }
            })
    })
})
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
