<template>
    <div id="container" class="fbox-vcenter">
        <div class="spacer"/>
        <div id="EditInfo" v-if="p">
            <div class="head-text info">{{ t.nav_profile_card }}</div>
            <div id="id">@{{ userid }}</div>
            <div class="fields info">
                <div class="input-box" v-for="(info, i) in editInfo" :key="i">
                    <input class="key" v-model="info.k" @change="change"/>
                    <input class="value" v-model="info.v" @change="change"/>
                </div>
            </div>
            <div class="head-text websites">{{ t.nav_website }}</div>
            <div class="fields websites">
                <div class="input-box" v-for="(web, i) in editWebsites" :key="i">
                    <input class="key" v-model="web.k" @change="change"/>
                    <input class="value" v-model="web.v" @change="change"/>
                </div>
            </div>
            <div class="button submit" @click="submitBtn">{{ t.nav_submit }}</div>
        </div>
        <div class="spacer"/>

        <SubmitPrompt v-if="submitParams" @submit="submitRequest" @close="() => submitParams = null"/>
    </div>
</template>

<script lang="ts">
import SubmitPrompt, {CaptchaResponse} from "@/components/SubmitPrompt.vue";
import {backendHost, getLang, info_i18n, peopleUrl, t} from "@/logic/config";
import {parsePeopleJson, Person} from "@/logic/data";
import {fetchText} from "@/logic/helper";
import {error, info} from "@/logic/utils";
import router from "@/router";
import Swal from 'sweetalert2';
import urljoin from "url-join";
import {Component, Prop, Vue} from 'vue-facing-decorator';

interface KVPair {
    k: string,
    v: string
}

export function removeEmpty(arr: KVPair[]): void {
    let i = 0;
    while (i < arr.length) {
        if (!arr[i].k && !arr[i].v) arr.splice(i, 1)
        else ++i
    }
}

@Component({ components: { SubmitPrompt } })
export default class EditInfo extends Vue {
    @Prop() userid!: string
    p: Person = null as never as Person

    initialJson!: string

    editInfo: KVPair[] = []
    editWebsites: KVPair[] = []

    submitParams: { [id: string]: string } = null as never

    t = t

    json(): string {
        return JSON.stringify({
            info: Object.fromEntries(this.p.info),
            websites: Object.fromEntries(this.p.websites)
        }, null, 2)
    }

    created(): void {
        // TODO: Handle errors
        // Get data from server
        fetch(urljoin(peopleUrl(this.userid), `info.json`))
            .then(it => it.text())
            .then(it => {
                this.p = parsePeopleJson(it)
                this.initialJson = this.json()
                this.p.info.forEach((a) => {
                    if (getLang() === 'zh_hans')
                        this.editInfo.push({ k: a[0], v: a[1] })
                    else {
                        const targeti18n = info_i18n[getLang()]
                        let s: string
                        switch (a[0]) {
                            case info_i18n['zh_hans'].alias:
                                s = targeti18n.alias;
                                break;
                            case info_i18n['zh_hans'].age:
                                s = targeti18n.age;
                                break;
                            case info_i18n['zh_hans'].born:
                                s = targeti18n.born;
                                break;
                            case info_i18n['zh_hans'].died:
                                s = targeti18n.died;
                                break;
                            case info_i18n['zh_hans'].location:
                                s = targeti18n.location;
                                break;
                            default:
                                s = a[0];
                                break;
                        }
                        this.editInfo.push({ k: s, v: a[1] });
                    }
                })
                this.p.websites.forEach((a) => this.editWebsites.push({ k: a[0], v: a[1] }))
                this.change()
            })
    }

    change(): void {
        for (const list of [this.editInfo, this.editWebsites]) {
            // Remove redundant last entries
            if (list.filter(it => !it.k && !it.v).length > 1)
                removeEmpty(list)

            // Add empty
            if (list.filter(it => !it.k && !it.v).length == 0)
                list.push({ k: '', v: '' })
        }
    }

    submitBtn(): void {
        removeEmpty(this.editInfo)
        removeEmpty(this.editWebsites)
        this.p.info = this.editInfo.map(it => [it.k, it.v])
        this.p.websites = this.editWebsites.map(it => [it.k, it.v])
        this.p.info.forEach((e, i) => {
            switch (e[0]) {
                case info_i18n[getLang()].age:
                    (this.p.info[i])[0] = info_i18n['zh_hans'].age;
                    break;
                case info_i18n[getLang()].alias:
                    (this.p.info[i])[0] = info_i18n['zh_hans'].alias;
                    break;
                case info_i18n[getLang()].born:
                    (this.p.info[i])[0] = info_i18n['zh_hans'].born;
                    break;
                case info_i18n[getLang()].died:
                    (this.p.info[i])[0] = info_i18n['zh_hans'].died;
                    break;
                case info_i18n[getLang()].location:
                    (this.p.info[i])[0] = info_i18n['zh_hans'].location;
                    break;
                default:
                    break;
            }
        })
        const json = this.json()
        console.log(json)
        this.change()

        // Didn't change anything
        if (json == this.initialJson) {
            Swal.fire({
                title: t.nav_unable_submit,
                text: "(╯‵□′)╯︵┻━┻",
                icon: "error",
                confirmButtonText: t.nav_ok_0,
                showCloseButton: false
            })
            return
        }

        // Show submit prompt
        this.submitParams = { id: this.p.id, content: json }
    }

    submitRequest(p: CaptchaResponse): void {
        const params = { ...this.submitParams, ...p }

        Swal.fire({
            title: t.nav_creating_pull_request,
            text: t.nav_description_pull_request,
            icon: null,
            showConfirmButton: false,
            didOpen: (() => {
                Swal.showLoading(null);
                fetchText(backendHost + '/edit/info', { method: 'POST', params })
                    .then(text => {
                        info(text);
                        Swal.fire({
                            title: t.nav_success,
                            text: t.nav_success_text,
                            icon: "success",
                            timer: 5000,
                            timerProgressBar: true,
                            showConfirmButton: true,
                            confirmButtonText: t.nav_ok_1
                        }).then((result) => {
                            if ((result.isConfirmed) || (result.dismiss === Swal.DismissReason.timer))
                                router.push(`/profile/${this.p.id}`);
                        })
                    })
                    .catch(err => {
                        error(err);
                        Swal.fire({
                            title: t.nav_failed,
                            text: t.nav_fail_reason + err.message,
                            icon: "error",
                            timer: 5000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        })
                    })
            })
        })

        this.submitParams = null
    }
}
</script>

<style lang="sass" scoped>
@use "@/css/colors" as *

#container
    height: 100%

    .spacer
        flex-grow: 1

#EditInfo
    background: $color-bg-5
    margin: 0 min(5vw, 40px)
    padding: 20px 30px
    border-radius: 30px
    filter: drop-shadow(0 2px 5px rgba(166, 134, 89, 0.42))

    #id
        margin-top: -5px
        margin-bottom: 5px
        color: $color-text-light

    .head-text
        font-weight: bold
        font-size: 1.2em

    .head-text.websites
        margin-top: 20px
        margin-bottom: 5px

    .input-box
        width: 100%
        display: flex
        margin-bottom: 5px

        input
            flex-grow: 1
            border-radius: 5px
            border: none
            background-color: $color-bg-4
            padding: 4px 8px
            color: $color-text-main
            text-align: center
            outline: none

        input.key
            margin-right: 10px
            font-weight: bold

        input:focus-visible
            outline: solid $color-text-light

    .button.submit
        margin-top: 30px
        background-color: $color-bg-6
        border-radius: 10px
        padding: 8px 0
        //border: 2px solid $color-text-main
        filter: drop-shadow(0 2px 5px rgba(166, 134, 89, 0.16))

    .button.submit:hover
        filter: drop-shadow(0 2px 5px rgba(166, 134, 89, 0.42))
        cursor: pointer
        transform: translateY(-5px)

@media screen and (max-width: 480px)
    #EditInfo
        margin: 0
        padding: 20px 30px
        border-radius: 0

        .button.submit:hover
            transform: none

@media screen and (max-width: 430px)
    .input-box
        flex-direction: column

    #EditInfo .input-box
        input.key
            border-top: 1px solid #ff7878
            border-bottom: 1px solid $color-bg-6
            margin: 0
            border-bottom-left-radius: 0
            border-bottom-right-radius: 0

        input.value
            border-bottom: 1px solid #ff7878
            border-top-left-radius: 0
            border-top-right-radius: 0

[data-theme="dark"]
    #EditInfo
        background: $color-bg-dark-5

        #id
            color: $color-text-dark-light

        .input-box
            input
                color: $color-text-dark-main
                background-color: $color-bg-dark-6

            input:focus-visible
                outline: solid $color-text-dark-light

        .button.submit
            background-color: $color-bg-dark-6
</style>
