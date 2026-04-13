<template>
    <div>
        <div id="EditInfo" v-if="loaded">
            <div class="head-text info">{{ t.nav_profile_card }}</div>
            <div id="id">@{{ userid }}</div>

            <!-- Language tabs -->
            <div class="lang-tabs" role="tablist">
                <button v-for="lang in langs" :key="lang.key"
                     :id="'tab-' + lang.key"
                     class="lang-tab" :class="{ active: activeLang === lang.key }"
                     role="tab"
                     :aria-selected="activeLang === lang.key"
                     :aria-controls="'panel-' + lang.key"
                     @click="activeLang = lang.key">
                    {{ lang.label }}
                </button>
            </div>

            <!-- Per-language info and desc -->
            <template v-for="lang in langs" :key="lang.key">
                <div v-show="activeLang === lang.key" :id="'panel-' + lang.key" role="tabpanel" :aria-labelledby="'tab-' + lang.key">
                    <div class="fields info">
                        <div class="input-box" v-for="item in editInfoMap[lang.key]" :key="item._id">
                            <input class="key" v-model="item.k" @change="changeInfo(lang.key)"/>
                            <input class="value" v-model="item.v" @change="changeInfo(lang.key)"/>
                        </div>
                    </div>
                </div>
            </template>

            <div class="head-text websites">{{ t.nav_website }}</div>
            <div class="fields websites">
                <div class="input-box" v-for="web in editWebsites" :key="web._id">
                    <input class="key" v-model="web.k" @change="changeWebsites"/>
                    <input class="value" v-model="web.v" @change="changeWebsites"/>
                </div>
            </div>
            <button class="button submit" @click="submitBtn">{{ t.nav_submit }}</button>
        </div>

        <SubmitPrompt v-if="submitParams" @submit="submitRequest" @close="() => submitParams = null"/>
    </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import SubmitPrompt, {CaptchaResponse} from "@/components/SubmitPrompt.vue";
import {backendHost, getLang, i18n, Lang, langDefs, peopleUrl, t} from "@/logic/config";
import {parsePeopleJson, Person} from "@/logic/data";
import {fetchText} from "@/logic/helper";
import {error, info} from "@/logic/utils";
import router from "@/router";
import Swal from 'sweetalert2';
import {getSwalTheme} from "@/logic/theme";
import urljoin from "url-join";

let _uid = 0

interface KVPair {
    k: string,
    v: string,
    _id: number
}

function kv(k: string, v: string): KVPair {
    return { k, v, _id: ++_uid }
}

function removeEmpty(arr: KVPair[]): void {
    let i = 0;
    while (i < arr.length) {
        if (!arr[i].k && !arr[i].v) arr.splice(i, 1)
        else ++i
    }
}

function ensureEmpty(list: KVPair[]): void {
    if (list.filter(it => !it.k && !it.v).length === 0) {
        list.push(kv('', ''))
    }
}

defineOptions({
    name: 'EditInfoView'
})

const props = defineProps<{
    userid: string
}>()
const userid = props.userid

const loaded = ref(false)
const langs = langDefs
const activeLang = ref<string>(getLang())
const editInfoMap = reactive(Object.fromEntries(
    langDefs.map(l => [l.key, []])
) as Record<Lang, KVPair[]>)
const editWebsites = ref<KVPair[]>([])
const personMap = reactive<Record<string, Person>>({} as Record<string, Person>)
const initialJson = ref('')
const submitParams = ref<{ [id: string]: string } | null>(null)

function json(): string {
    const data: Record<string, any> = {}

    for (const lang of langDefs) {
        const li = i18n[lang.key as Lang]
        const descKey = li.info.desc
        const infoEntries: [string, string][] = []
        let desc = ''

        for (const it of editInfoMap[lang.key]) {
            if (it.k === descKey) {
                desc = it.v
            } else if (it.k || it.v) {
                infoEntries.push([it.k, it.v])
            }
        }

        data[lang.key] = {
            info: Object.fromEntries(infoEntries),
            ...(desc ? { desc } : {}),
        }
    }

    const webEntries = editWebsites.value
        .filter(it => it.k || it.v)
        .map(it => [it.k, it.v])
    data.websites = Object.fromEntries(webEntries)

    return JSON.stringify(data, null, 2)
}

function changeInfo(langKey: string): void {
    const list = editInfoMap[langKey as Lang]
    if (list.filter(it => !it.k && !it.v).length > 1) removeEmpty(list)
    ensureEmpty(list)
}

function changeWebsites(): void {
    if (editWebsites.value.filter(it => !it.k && !it.v).length > 1) removeEmpty(editWebsites.value)
    ensureEmpty(editWebsites.value)
}

function submitBtn(): void {
    for (const lang of langDefs) {
        removeEmpty(editInfoMap[lang.key])
    }
    removeEmpty(editWebsites.value)

    for (const lang of langDefs) {
        const orphan = editInfoMap[lang.key].find(it => !it.k && it.v)
        if (orphan) {
            for (const l of langDefs) ensureEmpty(editInfoMap[l.key])
            ensureEmpty(editWebsites.value)
            Swal.fire({
                title: t.nav_empty_key,
                text: t.nav_empty_key_text.replace('{lang}', lang.label),
                icon: 'warning',
                confirmButtonText: t.nav_ok_0,
                theme: getSwalTheme()
            })
            return
        }
    }
    {
        const orphan = editWebsites.value.find(it => !it.k && it.v)
        if (orphan) {
            for (const l of langDefs) ensureEmpty(editInfoMap[l.key])
            ensureEmpty(editWebsites.value)
            Swal.fire({
                title: t.nav_empty_key,
                text: t.nav_empty_key_text.replace('{lang}', t.nav_website),
                icon: 'warning',
                confirmButtonText: t.nav_ok_0,
                theme: getSwalTheme()
            })
            return
        }
    }

    for (const lang of langDefs) {
        const keys = editInfoMap[lang.key].map(it => it.k).filter(k => k)
        const seen = new Set<string>()
        for (const k of keys) {
            if (seen.has(k)) {
                for (const l of langDefs) ensureEmpty(editInfoMap[l.key])
                ensureEmpty(editWebsites.value)
                Swal.fire({
                    title: t.nav_duplicate_key,
                    text: t.nav_duplicate_key_text.replace('{key}', k).replace('{lang}', lang.label),
                    icon: 'warning',
                    confirmButtonText: t.nav_ok_0,
                    theme: getSwalTheme()
                })
                return
            }
            seen.add(k)
        }
    }
    {
        const keys = editWebsites.value.map(it => it.k).filter(k => k)
        const seen = new Set<string>()
        for (const k of keys) {
            if (seen.has(k)) {
                for (const l of langDefs) ensureEmpty(editInfoMap[l.key])
                ensureEmpty(editWebsites.value)
                Swal.fire({
                    title: t.nav_duplicate_key,
                    text: t.nav_duplicate_key_text.replace('{key}', k).replace('{lang}', t.nav_website),
                    icon: 'warning',
                    confirmButtonText: t.nav_ok_0,
                    theme: getSwalTheme()
                })
                return
            }
            seen.add(k)
        }
    }

    const jsonText = json()
    console.log(jsonText)

    for (const lang of langDefs) {
        ensureEmpty(editInfoMap[lang.key])
    }
    ensureEmpty(editWebsites.value)

    if (jsonText === initialJson.value) {
        Swal.fire({
            title: t.nav_unable_submit,
            text: "(╯‵□′)╯︵┻━┻",
            icon: "error",
            confirmButtonText: t.nav_ok_0,
            showCloseButton: false,
            theme: getSwalTheme()
        })
        return
    }

    const pid = personMap['zh_hans']?.id || props.userid
    submitParams.value = { id: pid, content: jsonText }
}

function submitRequest(p: CaptchaResponse): void {
    if (!submitParams.value) return
    const params = { ...submitParams.value, ...p }
    const pid = personMap['zh_hans']?.id || props.userid

    Swal.fire({
        title: t.nav_creating_pull_request,
        text: t.nav_description_pull_request,
        icon: null,
        showConfirmButton: false,
        theme: getSwalTheme(),
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
                        confirmButtonText: t.nav_ok_1,
                        theme: getSwalTheme()
                    }).then(() => {
                        router.push(`/profile/${pid}`);
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
                        showConfirmButton: false,
                        theme: getSwalTheme()
                    })
                })
        })
    })

    submitParams.value = null
}

{
    const promises = langDefs.map(lang => {
        const filename = lang.suffix ? `info${lang.suffix}.json` : 'info.json'
        return fetch(urljoin(peopleUrl(props.userid), filename))
            .then(res => {
                if (!res.ok) throw new Error(`${filename}: ${res.status}`)
                return res.text()
            })
            .then(text => {
                const p = parsePeopleJson(text)
                personMap[lang.key] = p

                p.info.forEach(a => {
                    editInfoMap[lang.key].push(kv(a[0], String(a[1])))
                })

                if (p.solarBorn && p.bornKey) {
                    const bornIdx = editInfoMap[lang.key].findIndex(it => it.k === p.bornKey)
                    const solarKv = kv(i18n[lang.key as Lang].info.solar_born, p.solarBorn)
                    if (bornIdx >= 0) {
                        editInfoMap[lang.key].splice(bornIdx + 1, 0, solarKv)
                    } else {
                        editInfoMap[lang.key].push(solarKv)
                    }
                }

                editInfoMap[lang.key].push(kv(i18n[lang.key as Lang].info.desc, p.desc || ''))

                if (lang.key === 'zh_hans') {
                    p.websites.forEach(a => editWebsites.value.push(kv(a[0], a[1])))
                }
            })
            .catch(err => {
                error(`Failed to load ${filename} for ${lang.key}: ${err.message}`)
                editInfoMap[lang.key].push(kv(i18n[lang.key as Lang].info.desc, ''))
                ensureEmpty(editInfoMap[lang.key])
            })
    })

    Promise.all(promises).then(() => {
        loaded.value = true
        initialJson.value = json()
        for (const lang of langDefs) {
            ensureEmpty(editInfoMap[lang.key])
        }
        ensureEmpty(editWebsites.value)
    })
}
</script>

<style lang="sass" scoped>
@use "@/css/colors" as *

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

    .lang-tabs
        display: flex
        gap: 8px
        margin: 10px 0

    .lang-tab
        flex: 1
        padding: 6px 0
        border: none
        border-radius: 8px
        background-color: $color-bg-4
        text-align: center
        cursor: pointer
        font-size: 0.9em
        font-family: inherit
        transition: all 0.2s
        user-select: none

    .lang-tab:hover
        filter: brightness(0.95)

    .lang-tab.active
        background-color: $color-bg-6
        font-weight: bold
        filter: drop-shadow(0 1px 3px rgba(166, 134, 89, 0.3))

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
        width: 100%
        border: none
        font-family: inherit
        font-size: inherit
        color: inherit
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

        .lang-tab
            background-color: $color-bg-dark-4
            color: $color-text-dark-main

        .lang-tab.active
            background-color: $color-bg-dark-6

        .button.submit
            background-color: $color-bg-dark-6
</style>

<style lang="sass">
// Override #router padding when EditInfo is displayed
// (#container doesn't exist in DOM due to Vue 3 attribute inheritance on <router-view>)
#router:has(#EditInfo)
    padding-bottom: 20px
</style>
