<template>
    <div id="ProfileComments" class="markdown-content">
        <h1>{{ p.id == 'tdor' ? t.tdor_comment : t.nav_comments }}</h1>

        <!-- Comments -->
        <transition-group tag="div" name="comment-list" id="comments" v-if="p.comments.length > 0">
            <div class="comment" v-for="c in comments" :key="c.id">
                <span class="content" v-html="c.content"></span>
                <span class="from anonymous" v-if="c.anonymous">{{ t.nav_anonymous }}</span>
                <span class="from" v-else>——{{ c.submitter }}</span>

                <!-- Replies -->
                <div class="replies" v-if="c.replies.length">
                    <div class="reply-title">{{ t.nav_comment_in_reply_to }} @{{ c.submitter }}</div>
                    <div class="reply" v-for="(r, idx) in c.replies" :key="idx">
                        <span class="content" v-html="r.content"></span>
                        <span class="from">——{{ r.submitter }}</span>
                    </div>
                </div>
            </div>
        </transition-group>

        <!-- Add comment textbox -->
        <div id="add-comment" v-if="p.id != 'tdor'">
            <textarea id="comment-textarea" v-model="textInput" :placeholder="t.nav_comment_placeholder"
                      @input="resizeInput" ref="input"/>
            <div id="send-comment-btn" v-if="textInput.trim().length > 0">
                <span class="char-count unselectable">{{ trim(textInput.trim(), '\n').length }} {{
                        t.nav_comment_status
                    }}</span>
                <IFasPaperPlane class="icon" @click="btnSend"/>
            </div>

            <MarkdownTooltip text-area-id="comment-textarea"></MarkdownTooltip>
        </div>

        <SubmitPrompt v-if="showCaptchaPrompt" @submit="submitRequest" @close="showCaptchaPrompt = false"/>
    </div>
</template>

<script lang="ts">
import MarkdownTooltip from "@/components/MarkdownTooltip.vue";
import SubmitPrompt, {CaptchaResponse} from "@/components/SubmitPrompt.vue";
import {backendHost, t} from "@/logic/config";
import {Comment, Person} from "@/logic/data";
import {fetchText, trim} from "@/logic/helper";
import {error, info} from "@/logic/utils";
import Swal from 'sweetalert2';
import {initSpoilers} from '@/logic/spoilers';
import {mdParseInline} from "@/logic/markdown";
import {Component, Prop, Vue} from 'vue-facing-decorator';

@Component({ components: { MarkdownTooltip, SubmitPrompt } })
export default class ProfileComments extends Vue {
    declare $refs: {
        input: HTMLTextAreaElement
    }

    @Prop() p: Person

    private textInputCache = ""
    private textInputKey: string

    showCaptchaPrompt = false
    comments = []

    t = t

    trim = trim

    getComments(): Comment[] {
        const commentData = this.p.comments.map(c => {
            return {
                ...c,
                anonymous: c.submitter === "Anonymous",
                content: mdParseInline(c.content.replaceAll("\n", "<br />")),
                replies: c.replies
                    ? c.replies.map(r => {
                        return {
                            ...r,
                            content: mdParseInline(r.content.replaceAll("\n", "<br />")),
                        }
                    })
                    : []
            }
        }) as Comment[]
        const myComments = JSON.parse(localStorage.getItem("myComments"));
        if (!myComments) return commentData;
        if ((this.p.id in myComments) && (myComments[this.p.id] != undefined)) {
            for (const u of myComments[this.p.id]) {
                let flag = true;
                for (const v of commentData) {
                    if ((u.content.replaceAll('||', '').replaceAll('\n', '').replaceAll('<br />', '').replaceAll(' ', '') == v.content.replaceAll('<span class="spoiler"><span>', '').replaceAll('</span></span>', '').replaceAll('<br />', '').replaceAll(' ', ''))) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    commentData.push({
                        ...u,
                        content: mdParseInline(u.content.replaceAll("\n", "<br />")),
                    });
                }
            }
        }
        return commentData;
    }

    /**
     * Send button
     */
    btnSend() {
        // Show submit prompt
        this.showCaptchaPrompt = true
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
                        this.comments.push({
                            content: mdParseInline(this.textInput.replaceAll("\n", "<br />")),
                            replies: [],
                            submitter: 'You',
                            id: 0
                        })
                        let myComments = JSON.parse(localStorage.getItem("myComments"));
                        if (!myComments) myComments = {};
                        if ((!(this.p.id in myComments)) || (myComments[this.p.id] == undefined)) {
                            myComments[this.p.id] = [{
                                content: mdParseInline(this.textInput.replaceAll("\n", "<br />")),
                                replies: [],
                                submitter: 'You',
                                id: 0
                            }]
                        } else {
                            myComments[this.p.id].push({
                                content: mdParseInline(this.textInput.replaceAll("\n", "<br />")),
                                replies: [],
                                submitter: 'You',
                                id: 0
                            })
                        }
                        localStorage.setItem("myComments", JSON.stringify(myComments))
                        this.textInput = "";
                        this.resizeInput()
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
                        this.resizeInput()
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
        this.comments = this.getComments()
        if (!localStorage.getItem('myComments')) {
            localStorage.setItem('myComments', '{}')
        }
    }

    /**
     * Get cached textinput
     */
    get textInput() {
        return trim(this.textInputCache.trim(), '\n')
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
        if (!el) return
        el.style.height = "auto"
        el.style.height = `${el.scrollHeight + 18}px`
    }
}
</script>

<style lang="sass">
@use "@/css/global" as *

.divp
    margin: 0.65em 0
    line-height: 1.6
    margin-bottom: 1.6rem

.comment
    @extend .divp

    .from
        color: $color-text-light
        margin-left: 10px

    .from.anonymous
        color: $color-text-light
        opacity: 0.75

    .replies
        .reply-title
            font-size: 0.7em
            color: $color-text-light

        margin-top: 0.3em
        padding: 0.5em 20px

        background: $color-bg-5
        border-radius: 5px 10px 10px 5px
        border-left: 3px solid #ba8746

        // Gap between replies
        > .reply + .reply
            margin-top: 0.5em


#add-comment
    margin-top: 20px

    textarea
        font-family: $font
        width: 100%
        background: rgba(0, 0, 0, 0.05)
        color: $color-text-main
        border-radius: 10px

        overflow-y: hidden
        resize: none

        border: none
        padding: 10px
        box-sizing: border-box

        outline: 0 solid white

    textarea:focus-visible
        outline: 1px solid $color-text-light
    //outline: none

    textarea::placeholder
        color: $color-text-light
        opacity: 0.5

    position: relative

    #send-comment-btn
        position: absolute
        right: 10px
        bottom: 10px
        color: $color-text-special

        display: flex
        align-items: center

        .char-count
            font-size: 10px
            color: $color-text-light
            margin-right: 5px

.comment-list-enter-from, .comment-list-leave-to
    transition: all 1s $ease-in-out-cric
    opacity: 0
    transform: translateY(25px)

[data-theme="dark"]
    .comment
        .from
            color: $color-text-dark-light !important
            margin-left: 10px

        .from.anonymous
            color: $color-text-dark-light !important
            opacity: 0.5 !important

        .replies
            .reply-title
                color: $color-text-dark-light !important

            background: $color-bg-dark-5 !important

    #add-comment
        textarea
            background: rgba(255, 255, 255, 0.05) !important
            color: $color-text-dark-main !important

        textarea::placeholder
            color: $color-text-dark-light !important
</style>
