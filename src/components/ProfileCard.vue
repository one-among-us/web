<template>
    <div id="info" class="font-custom fbox-h" v-if="p">
        <!-- Horizontal Alignment of profile pic and the rest -->
        <div id="left" class="fbox-v">
            <img :src="profileUrl" draggable="false" :alt="p.name">
            <div class="spacer"/>
            <div id="buttons" v-if="!screenshotMode">
                <div class="button-container">
                    <el-tooltip content="献花" :show-after="1000" :disabled="flowersGiven || loading.has('flower')">
                        <button type="button" class="button anim fbox-vcenter" @click="flower"
                             :class="(flowersGiven || loading.has('flower')) ? 'disabled' : ''" aria-label="献花">
                            <IEpCheck v-if="flowersGiven"/>
                            <Icon class="iconR" icon="line-md:cake" v-else-if="isBirthday && !loading.has('flower')"/>
                            <IEpLollipop v-else-if="!loading.has('flower')"/>
                            <IEpLoading v-else/>
                        </button>
                    </el-tooltip>
                    <div class="text-under-button">{{ flowerText }}</div>
                </div>
                <div class="button-container edit">
                    <button class="button anim fbox-vcenter" @click="edit" aria-label="Edit">
                        <IEpEdit/>
                    </button>
                    <div class="text-under-button" aria-hidden="true">Edit</div>
                </div>
            </div>
            <div class="spacer-bottom f-grow1"/>
        </div>
        <!-- Vertical Alignment of info section -->
        <div id="right">
            <div id="name-box">
                <span id="name-text">{{ p.name }}</span>
                <span id="id">@{{ p.id }}</span>
            </div>
            <div id="hr"/>
            <ul id="fields" class="f-grow1">
                <li v-for="info of p.info" :key="info[0]">
                    <span class="key">{{ info[0] }}：</span>
                    <button v-if="isBornField(info[0]) && p.solarBorn"
                            type="button"
                            class="value born-toggle"
                            @click="toggleBornDisplay"
                            :title="showSolarBorn ? '' : p.solarBorn"
                            :aria-label="showSolarBorn ? 'Show lunar date' : 'Show solar date'">
                        <transition name="born-fade" mode="out-in">
                            <span :key="showSolarBorn ? 'solar' : 'lunar'">{{ showSolarBorn ? p.solarBorn : info[1] }}</span>
                        </transition>
                    </button>
                    <span v-else class="value">{{ info[1] }}</span>
                </li>
            </ul>
            <div id="websites" v-if="p.websites?.length">
                <span id="websites-text">{{ t.nav_website }}</span>
                <span id="websites-container">
                    <!-- XXX: data does not provide a user-readable string for icon name -->
                    <a v-for="web of p.websites" :key="web[0]" :href="web[1]" target="_blank" :aria-label="web[0]">
                        <DynamicIcon :icon="web[0]"/>
                    </a>
                </span>
            </div>
        </div>

        <a class="switchButton" v-if="canSwitch" v-bind:href="target" v-on:click="switchWarn()" draggable="false">
            <SwitchButton/>
        </a>

        <img class="watermark unselectable" draggable="false" src="/favicon-large.png" alt=""/>
    </div>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {backendHost, dataHost, replaceUrlVars, t} from "@/logic/config";
import {Person} from "@/logic/data";
import {handleBirthdayToast, handleFlowerToast} from '@/logic/easterEgg';
import {abbreviateNumber, getResponseSync, getTodayDate} from "@/logic/helper";
import {BirthdayEntry, getTodayContext, isTodayBirthday} from "@/logic/birthday";
import {info} from '@/logic/utils';
import router from "@/router";
import {Icon} from '@iconify/vue';
import Swal from 'sweetalert2';
import {getSwalTheme} from "@/logic/theme";
import urljoin from 'url-join';

const props = withDefaults(defineProps<{
    userid: string
    p: Person
    screenshotMode?: boolean
}>(), {
    screenshotMode: false
})
const INITIAL_TARGET = '.'

const flowers = ref(0)
const flowersGiven = ref(false)
const isBirthday = ref(false)
const canSwitch = ref(false)
const target = ref<string | null>(INITIAL_TARGET)
const sourceTarget = ref(INITIAL_TARGET)
const inWarning = ref(false)
const showSolarBorn = ref(false)
const loading = ref(new Set<string>())

const flowerText = computed((): string => abbreviateNumber(flowers.value))
const profileUrl = computed((): string => replaceUrlVars(props.p.profileUrl, props.userid))

flowersGiven.value = localStorage.getItem(`last_flower_given@${props.userid}`) === getTodayDate()

fetch(urljoin(dataHost, 'birthday-list.json'))
    .then(it => it.json())
    .then(it => {
        const today = getTodayContext()
        for (const v of (it as BirthdayEntry[])) {
            if (v[0] == props.userid) {
                if (isTodayBirthday(v, today)) {
                    isBirthday.value = true
                }
            }
        }
    })

fetch(backendHost + `/flowers/get?id=${props.userid}`)
    .then(it => it.text())
    .then(it => {
        info(`Flowers: ${it}`)
        flowers.value = parseInt(it)
    })

fetch(urljoin(dataHost, 'switch-pair.json'))
    .then(it => it.json())
    .then(it => {
        const pairs = it as [string, string][]
        for (const v of pairs) {
            if (v[0] == props.userid) {
                canSwitch.value = true
                target.value = `/profile/${v[1]}`
                sourceTarget.value = target.value
                const r = getResponseSync(urljoin(dataHost, 'trigger-list.json'));
                const l = JSON.parse(r) as string[];
                if (l.includes(v[1])) {
                    target.value = null;
                    inWarning.value = true;
                }
            }
        }
    })

function flower(): void {
    if (flowersGiven.value || loading.value.has('flower')) return

    loading.value.add('flower')
    fetch(backendHost + `/flowers/give?id=${props.userid}`)
        .then(() => {
            flowers.value += 1
            flowersGiven.value = true
            localStorage.setItem(`last_flower_given@${props.userid}`, getTodayDate())
        })
        .finally(() => loading.value.delete('flower'))

    handleFlowerToast(props.p.name)
    if (isBirthday.value) handleBirthdayToast(props.p.name)
}

function switchWarn() {
    if (!inWarning.value) return;
    Swal.fire({
        title: t.switch_warning.title,
        text: t.switch_warning.text,
        icon: 'warning',
        showCancelButton: false,
        showCloseButton: false,
        showConfirmButton: true,
        allowOutsideClick: false,
        timer: 300000,
        timerProgressBar: true,
        iconColor: '#d20f39',
        allowEscapeKey: false,
        allowEnterKey: false,
        customClass: { popup: 'view-limit-alert' },
        theme: getSwalTheme()
    }).then((result) => {
        if (result.isConfirmed) {
            target.value = sourceTarget.value;
            inWarning.value = false;
        }
    })
}

function edit(): void {
    Swal.fire({
        title: t.nav_what_to_edit,
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: t.nav_profile_card,
        cancelButtonText: t.nav_introduction,
        theme: getSwalTheme()
    }).then((result) => {
        if (result.isConfirmed)
            router.push(`/edit-info/${props.p.id}`);
        else if (result.dismiss === Swal.DismissReason.cancel)
            open(`https://github.com/one-among-us/data/tree/main/people/${props.userid}/page.md`)
    })
}

watch(() => props.userid, () => {
    showSolarBorn.value = false
})

function isBornField(key: string): boolean {
    return !!props.p.bornKey && key === props.p.bornKey
}

function toggleBornDisplay(): void {
    showSolarBorn.value = !showSolarBorn.value
}
</script>

<style lang="sass" scoped>
@use "@/css/global" as *

div:has(.view-limit-alert)
    backdrop-filter: blur(10px)

// Screenshot mode
.screenshot #info
    border-radius: 0
    width: 600px
    height: 314px
    animation: none

    justify-content: center
    align-items: center

    font-size: 1.1em
    filter: none

    #left img
        height: 150px
        width: auto

    img.watermark
        height: 250px

.switchButton
    position: absolute
    width: 24px
    height: 24px
    bottom: 20px
    right: 20px

.switchButton:hover
    transform: translate(-1px -1px)
    filter: drop-shadow(2px 2px 0.75px rgba(166, 134, 89, 0.32))

#info
    width: 100%
    background-color: $color-bg-6
    filter: drop-shadow(0 2px 5px rgba(166, 134, 89, 0.42))
    border-radius: 24px
    animation: fade-in-top 1s 0s ease

    .button svg
        width: 20px
        height: 20px

    // Watermark
    position: relative

    img.watermark
        position: absolute
        z-index: 1
        opacity: 0.08
        height: 90%
        right: 20px
        bottom: 20px
        transform: rotate(13deg)
        pointer-events: none

#right
    display: flex
    flex-direction: column

    flex-grow: 1
    text-align: left
    margin-top: 20px
    margin-right: min(5vw, 50px)
    margin-bottom: 20px
    min-height: 200px
    overflow: hidden

    #name-box
        line-height: normal
        display: flex
        align-items: flex-start
        flex-wrap: wrap-reverse
        white-space: nowrap
        text-overflow: ellipsis

        #name-text
            font-size: 1.7em
            font-weight: bold
            margin-right: 8px

    #hr
        width: 100%
        height: 2px
        background-color: $color-text-main
        border-radius: 1px

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

            .born-toggle
                cursor: pointer
                background: none
                border: none
                padding: 0
                margin: 0
                font: inherit
                color: inherit
                text-align: left
                display: inline

                &:hover
                    opacity: 0.7

                &:focus-visible
                    outline: 2px solid currentColor
                    outline-offset: 2px
                    border-radius: 2px

// Born date toggle animation
.born-fade-enter-active, .born-fade-leave-active
    transition: opacity 0.2s ease, transform 0.2s ease

.born-fade-enter-from
    opacity: 0
    transform: translateY(-4px)

.born-fade-leave-to
    opacity: 0
    transform: translateY(4px)

#right
    #websites
        display: flex
        gap: 10px

        #websites-text
            font-weight: bold
            min-width: 40px

        #websites-container
            display: flex
            gap: 10px
            flex-direction: row
            align-items: flex-start
            align-content: flex-start
            flex-wrap: wrap

            a
                color: $color-text-main
                text-decoration: none
                display: inline-flex
                align-items: center

#left
    margin-left: min(5vw, 60px)
    margin-right: min(5vw, 50px)
    height: unset

    img
        border: 9px solid #ffffffdd
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

        .button-container
            display: inline-flex
            flex-direction: column

        .button-container + .button-container
            margin-left: 20px

        .button
            box-sizing: content-box
            display: inline-flex
            align-items: center
            font-size: 20px
            width: 40px
            height: 40px
            padding: 0
            border: 2px solid $color-text-main
            color: $color-text-main
            border-radius: 15px
            background: $color-bg-5

        .button.disabled
            cursor: not-allowed

        .button.disabled:hover
            transform: none
            box-shadow: none

// Phone layout: left becomes top and right becomes bottom
@media screen and (max-width: 570px)
    #info
        flex-direction: column

        // Leave space for the profile pic
        #name-box, #fields > li:first-child
            max-width: calc(100% - 100px)
            overflow: hidden
            text-justify: inter-word

        // Hide li dots
        #fields li
            list-style-type: none
            margin-left: 0
            overflow: hidden
            text-justify: inter-word

            // Wrap text
            .value
                //word-break: break-all
                text-justify: inter-word

        #fields
            max-width: calc(100% - 15px)
            text-indent: 3.25em hanging

    #left
        flex-direction: row

        #buttons
            display: flex
            position: absolute
            bottom: 0
            right: 20px

        img
            transform: rotate(15deg)
            position: absolute
            top: 0
            right: -5px

        .spacer-bottom
            flex-grow: 0

        .spacer
            display: none


    #right
        margin-left: 32px
        margin-right: 32px

        #websites
            max-width: calc(100% - 100px)

            #websites-container
                max-width: calc(100% - 1em)

    .switchButton
        position: absolute
        left: 5px
        top: 32px

// Even smaller screen
@media screen and (max-width: 400px)
    #profile-page
        // overflow hack
        // https://stackoverflow.com/questions/6421966/css-overflow-x-visible-and-overflow-y-hidden-causing-scrollbar-issue
        overflow: hidden
        margin: -50px 0 0
        padding: 50px 0 0

        #content, #comments
            margin: 10px

    #info
        margin-right: 0
        margin-left: 0
        border-radius: 0

        // Leave space for the profile pic
        #name-box, #fields > li:first-child
            max-width: calc(90% - 50px)
            overflow: hidden
            text-justify: inter-word

    #left
        img
            height: 90px
            width: 90px
            border: 5px solid white
            outline: 2px solid $color-text-main

        .button-container.edit
            display: none !important

        #buttons
            bottom: 0.5em

            .button-container
                flex-direction: row
                align-items: center
                gap: 5px

            .button
                font-size: 15px
                width: 30px
                height: 30px

[data-theme="dark"]
    #info
        background-color: $color-bg-dark-6

    #right
        #hr
            color: $color-text-dark-main

        #websites
            #websites-container
                a
                    color: $color-text-dark-main

    #left
        img
            border: 9px solid #f5e0dc45
            outline: 2px solid $color-text-dark-main
        #buttons
            .button
                background: $color-bg-dark-5
                border: 2px solid $color-text-dark-main
                color: $color-text-dark-main
</style>
