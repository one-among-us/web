<template>
    <div id="info" class="font-custom fbox-h" v-if="p">
        <!-- Horizontal Alignment of profile pic and the rest -->
        <div id="left" class="fbox-v">
            <img :src="profileUrl" draggable="false" alt="profile">
            <div class="spacer"/>
            <div id="buttons" v-if="!screenshotMode">
                <div class="button-container">
                    <el-tooltip content="献花" :show-after="1000" :disabled="flowersGiven || loading.has('flower')">
                        <div class="button anim fbox-vcenter" @click="flower"
                             :class="(flowersGiven || loading.has('flower')) ? 'disabled' : ''">
                            <IEpCheck v-if="flowersGiven"/>
                            <Icon class="iconR" icon="line-md:cake" v-else-if="isBirthday && !loading.has('flower')"/>
                            <IEpLollipop v-else-if="!loading.has('flower')"/>
                            <IEpLoading v-else/>
                        </div>
                    </el-tooltip>
                    <div class="text-under-button">{{ flowerText }}</div>
                </div>
                <div class="button-container edit">
                    <div class="button anim fbox-vcenter" @click="edit">
                        <IEpEdit/>
                    </div>
                    <div class="text-under-button">Edit</div>
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
                    <span class="value">{{ info[1] }}</span>
                </li>
            </ul>
            <div id="websites" v-if="p.websites?.length">
                <span id="websites-text">{{ t.nav_website }}</span>
                <span id="websites-container">
                    <a v-for="web of p.websites" :key="web[0]" :href="web[1]" target="_blank">
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

<script lang="ts">
import {backendHost, dataHost, replaceUrlVars, t} from "@/logic/config";
import {Person} from "@/logic/data";
import {handleBirthdayToast, handleFlowerToast} from '@/logic/easterEgg';
import {abbreviateNumber, getResponseSync, getTodayDate} from "@/logic/helper";
import {info} from '@/logic/utils';
import router from "@/router";
import {Icon} from '@iconify/vue';
import Swal from 'sweetalert2';
import urljoin from 'url-join';
import {Component, Prop, Vue} from 'vue-facing-decorator';

@Component({ components: { Icon } })
export default class ProfileCard extends Vue {
    @Prop({ required: true }) userid!: string
    @Prop({ required: true }) p!: Person
    @Prop({ default: false }) screenshotMode!: boolean

    flowers = 0
    flowersGiven = false
    isBirthday = false
    canSwitch = false
    target = '.'
    sourceTarget = '.'
    inWarning = false

    loading = new Set<string>()

    t = t;

    created() {
        this.flowersGiven = localStorage.getItem(`last_flower_given@${this.userid}`) === getTodayDate()

        fetch(urljoin(dataHost, 'birthday-list.json'))
            .then(it => it.json())
            .then(it => {
                it = (it as [string, string][])
                for (const v of it) {
                    if (v[0] == this.userid) {
                        const d = new Date(v[1]);
                        const now = new Date();
                        if ((now.getDate() == d.getDate()) && (now.getMonth() == d.getMonth())) {
                            this.isBirthday = true
                        }
                    }
                }
            })

        // TODO: Handle errors
        fetch(backendHost + `/flowers/get?id=${this.userid}`)
            .then(it => it.text())
            .then(it => {
                info(`Flowers: ${it}`)
                this.flowers = parseInt(it)
            })

        fetch(urljoin(dataHost, 'switch-pair.json'))
            .then(it => it.json())
            .then(it => {
                const pairs = it as [string, string][]
                for (const v of pairs) {
                    if (v[0] == this.userid) {
                        this.canSwitch = true
                        this.target = `/profile/${v[1]}`
                        this.sourceTarget = this.target
                        const r = getResponseSync(urljoin(dataHost, 'trigger-list.json'));
                        const l = JSON.parse(r) as string[];
                        if (l.includes(v[1])) {
                            this.target = null;
                            this.inWarning = true;
                        }
                    }
                }
            })
    }

    flower(): void {
        if (this.flowersGiven || this.loading.has('flower')) return

        // TODO: Handle errors
        // TODO: Better user interaction (probably like +1 animation or something)
        this.loading.add('flower')
        fetch(backendHost + `/flowers/give?id=${this.userid}`)
            .then(() => {
                this.flowers += 1

                // Set flowers given
                this.flowersGiven = true
                localStorage.setItem(`last_flower_given@${this.userid}`, getTodayDate())
            })
            .finally(() => this.loading.delete('flower'))

        handleFlowerToast(this.p.name)
        if (this.isBirthday) handleBirthdayToast(this.p.name)
    }

    get flowerText(): string {
        return abbreviateNumber(this.flowers)
    }

    switchWarn() {
        if (!this.inWarning) return;
        Swal.fire({
            title: this.t.switch_warning.title,
            text: this.t.switch_warning.text,
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
            customClass: { popup: 'view-limit-alert' }
        }).then((result) => {
            if (result.isConfirmed) {
                this.target = this.sourceTarget;
                this.inWarning = false;
            }
        })
    }

    edit(): void {
        Swal.fire({
            title: t.nav_what_to_edit,
            icon: "question",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: t.nav_profile_card,
            cancelButtonText: t.nav_introduction
        }).then((result) => {
            if (result.isConfirmed)
                router.push(`/edit-info/${this.p.id}`);
            else if (result.dismiss === Swal.DismissReason.cancel)
                open(`https://github.com/one-among-us/data/tree/main/people/${this.userid}/page.md`)
        })
    }

    get profileUrl(): string {
        return replaceUrlVars(this.p.profileUrl, this.userid)
    }
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
            display: inline-flex
            align-items: center
            font-size: 20px
            width: 40px
            height: 40px
            border: 2px solid $color-text-main
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
</style>
