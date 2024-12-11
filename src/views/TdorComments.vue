<template>
    <div id="TdorComments" class="introduction">
        <!-- Add comment textbox -->
        <transition name="collapse">
            <div id="add-comment" v-show="showInputArea">
        <textarea id="comment-textarea" v-model="textInput" :placeholder="t.nav_comment_placeholder"
                  @input="resizeInput" ref="input"/>
                <div id="send-comment-btn" v-if="textInput.length > 0">
                    <span class="char-count unselectable">{{ textInput.length }} {{ t.nav_comment_status }}</span>
                    <IFasPaperPlane class="icon" @click="btnSend"/>
                </div>
                <MarkdownTooltip text-area-id="comment-textarea"></MarkdownTooltip>
            </div>
        </transition>

        <SubmitPrompt v-if="showCaptchaPrompt" @submit="submitRequest" @close="showCaptchaPrompt = false"/>
    </div>
</template>

<script lang="ts">
import MarkdownTooltip from "@/components/MarkdownTooltip.vue";
import SubmitPrompt, {CaptchaResponse} from "@/components/SubmitPrompt.vue";
import {backendHost, t} from "@/logic/config";
import {Person} from "@/logic/data";
import {fetchText} from "@/logic/helper";
import {error, info} from "@/logic/utils";
import Swal from 'sweetalert2';
import {initSpoilers} from "tg-blog";
import {Component, Vue} from 'vue-facing-decorator';

@Component({ components: { MarkdownTooltip, SubmitPrompt } })
export default class TdorComments extends Vue {
    declare $refs: {
        input: HTMLTextAreaElement
    }

    private textInputCache = ""
    private textInputKey: string

    showCaptchaPrompt = false

    t = t
    p = { id: "tdor" } as Person
    showInputArea = true

    /**
     * Send button
     */
    btnSend() {
        // Show submit prompt
        this.showCaptchaPrompt = true
    }

    alterTextArea() {
        // Show Input area
        this.showInputArea = !this.showInputArea
    }

    /**
     * Submit comment request
     */
    submitRequest(p: CaptchaResponse) {
        this.showCaptchaPrompt = false

        const params = { id: this.p.id, content: this.textInput, ...p }
        info(params)

        Swal.fire({
            title: t.nav_comment_submit,
            showConfirmButton: false,
            icon: null,
            didOpen: (() => {
                Swal.showLoading(null);
                fetchText(backendHost + '/comment/add', { method: 'POST', params })
                    .then(() => {
                        this.textInput = "";
                        Swal.fire({
                            title: t.nav_success,
                            text: t.nav_success_text_reply,
                            icon: 'success',
                            timer: 5000,
                            timerProgressBar: true,
                            showConfirmButton: true,
                            confirmButtonText: t.nav_ok_1,
                            showCloseButton: true
                        })
                    })
                    .catch(err => {
                        error(err);
                        Swal.fire({
                            title: t.nav_failed,
                            text: t.nav_fail_reason + err.message,
                            icon: 'error',
                            timer: 5000,
                            timerProgressBar: true,
                            showConfirmButton: false,
                            showCloseButton: false
                        })
                    })
            })
        })
    }

    /**
     * Load saved textinput from localStorage
     */
    created() {
        this.textInputKey = `draft-${this.p.id}`
        this.textInputCache = localStorage.getItem(this.textInputKey) ?? ""
    }

    /**
     * Get cached textinput
     */
    get textInput() {
        return this.textInputCache
    }

    /**
     * Set text and save localstorage
     * @param s
     */
    set textInput(s: string) {
        this.textInputCache = s
        localStorage.setItem(this.textInputKey, s)
    }

    mounted() {
        // Set initial size
        this.resizeInput()

        // Init spoilers
        initSpoilers()
    }

    /**
     * Auto resize
     */
    resizeInput() {
        const el = this.$refs.input
        el.style.height = "auto"
        el.style.height = `${el.scrollHeight + 18}px`
    }
}
</script>

<style lang="sass">
@use '@/css/global'
@use '@/css/colors'
@use '@/css/fonts/font-custom'

.divp
    margin: 0.65em 0
    line-height: 1.6

.comment
    @extend .divp

    .from
        color: colors.$color-text-light
        margin-left: 10px

    .from.anonymous
        color: lighten(colors.$color-text-light, 20%)

    .replies
        .reply-title
            font-size: 0.7em
            color: colors.$color-text-light

        margin-top: 0.3em
        padding: 0.5em 20px

        background: colors.$color-bg-5
        border-radius: 5px 10px 10px 5px
        border-left: 3px solid #ba8746

        // Gap between replies
        > .reply + .reply
            margin-top: 0.5em


#add-comment
    margin: 20px auto 50px

    textarea
        font-family: font-custom.$font
        width: 100%
        // min-height: 4rem
        background: rgba(0, 0, 0, 0.05)
        color: colors.$color-text-main
        border-radius: 10px

        overflow-y: hidden
        resize: none

        border: none
        padding: 10px
        box-sizing: border-box

        outline: 0 solid white

    textarea:focus-visible
        outline: 1px solid colors.$color-text-light
    //outline: none

    textarea::placeholder
        color: colors.$color-text-light
        opacity: 0.5

    position: relative

    #send-comment-btn
        position: absolute
        right: 10px
        bottom: 10px
        color: colors.$color-text-special

        display: flex
        align-items: center

        .char-count
            font-size: 10px
            color: colors.$color-text-light
            margin-right: 5px

.btn
    display: flexbox
    background: colors.$color-bg-6
    border-radius: 20px
    border-style: solid
    border-width: 1px
    border-color: colors.$color-text-light
    padding: 10px
    width: fit-content
    gap: 8px
    align-items: center
    color: colors.$color-text-main

    filter: drop-shadow(0 2px 3px rgba(188 140 68 / 0.2))

    .iconR
        font-size: 2em
        color: rgba(188 140 60 / 0.5)
        background: transparent
        font-family: 'Hua', '851', 'STXINGKA', Avenir, Helvetica, Arial, sans-serif
        display: inline-block

    .textR
        font-size: 1.65em
        margin-left: 10px
        font-family: '851'
        vertical-align: middle
        display: inline-block
        padding-bottom: 0.6rem

.shadow:hover
    box-shadow: 15px 15px 15px -5px rgba(166 134 89 / 0.3)
    border-color: colors.$color-text-special

[data-theme="dark"]
    .comment
        .from
            color: colors.$color-text-dark-light

        .from.anonymous
            color: darken(colors.$color-text-dark-light, 20%)

        .replies
            .reply-title
                color: colors.$color-text-dark-light !important

            background: colors.$color-bg-dark-5 !important

    #add-comment
        textarea
            background: rgba(255, 255, 255, 0.05) !important
            color: colors.$color-text-dark-main !important

        textarea::placeholder
            color: colors.$color-text-dark-light !important

        #send-comment-btn
            color: colors.$color-text-dark-special

            .char-count
                color: colors.$color-text-dark-main

    .btn
        background: colors.$color-bg-dark-6
        border-color: colors.$color-text-dark-light
        color: colors.$color-text-dark-main
</style>
