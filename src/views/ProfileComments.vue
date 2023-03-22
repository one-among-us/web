<template>
    <div id="ProfileComments" class="markdown-content">
        <h1>留言</h1>

        <!-- Comments -->
        <div id="comments" v-if="p.comments.length > 0">
            <div class="comment" v-for="c in comments" :key="c.id">
                <span class="content" v-html="c.content"></span>
                <span class="from anonymous" v-if="c.anonymous">——匿名小可爱</span>
                <span class="from" v-else>——{{c.submitter}}</span>

                <!-- Replies -->
                <div class="replies" v-if="c.replies">
                    <div class="reply-title">回复 @{{c.submitter}}</div>
                    <div class="reply" v-for="(r, idx) in c.replies" :key="idx">
                        <span class="content" v-html="r.content"></span>
                        <span class="from">——{{r.submitter}}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add comment textbox -->
        <div id="add-comment">
            <textarea id="comment-textarea" v-model="textInput" placeholder="添加留言... （支持 Markdown"
                      @input="resizeInput" ref="input"/>
            <div id="send-comment-btn" v-if="textInput.length > 0">
                <span class="char-count unselectable">{{textInput.length}} 字（已存草稿）</span>
                <IFasPaperPlane class="icon" @click="btnSend"/>
            </div>

            <MarkdownTooltip text-area-id="comment-textarea"></MarkdownTooltip>
        </div>

        <SubmitPrompt v-if="showCaptchaPrompt" @submit="submitRequest" @close="showCaptchaPrompt = false"/>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import {Person} from "@/logic/data";
import SubmitPrompt, {CaptchaResponse} from "@/components/SubmitPrompt.vue";
import {fetchText} from "@/logic/helper";
import {backendHost} from "@/logic/config";
import MarkdownTooltip from "@/components/MarkdownTooltip.vue";
import {error, info} from "@/logic/utils";
import {initSpoilers, mdParseInline} from "tg-blog";
import {ElMessage, ElMessageBox} from "element-plus";

@Options({components: {MarkdownTooltip, SubmitPrompt}})
export default class ProfileComments extends Vue
{
    declare $refs: {
        input: HTMLTextAreaElement
    }

    @Prop() p: Person

    private textInputCache = ""
    private textInputKey: string

    showCaptchaPrompt = false

    get comments()
    {
        return this.p.comments.map(c => {return {...c,
            anonymous: c.submitter === "Anonymous",
            content: mdParseInline(c.content.replaceAll("\n", "<br />"))
        }})
    }

    /**
     * Send button
     */
    btnSend()
    {
        // Show submit prompt
        this.showCaptchaPrompt = true
    }

    /**
     * Submit comment request
     */
    submitRequest(p: CaptchaResponse)
    {
        this.showCaptchaPrompt = false
        ElMessage.success('正在提交留言...')

        const params = {id: this.p.id, content: this.textInput, ...p}
        info(params)

        fetchText(backendHost + '/comment/add', {method: 'POST', params})
            .then(() => {
                this.textInput = ""
                ElMessageBox.alert('提交成功！谢谢你！\n我们审核之后会给你发邮件')
            })
            .catch(err => {
                error(err)
                ElMessageBox.alert('失败原因：' + err.message, '提交失败')
            })
    }

    /**
     * Load saved textinput from localStorage
     */
    created()
    {
        this.textInputKey = `draft-${this.p.id}`
        this.textInputCache = localStorage.getItem(this.textInputKey) ?? ""
    }

    /**
     * Get cached textinput
     */
    get textInput()
    {
        return this.textInputCache
    }

    /**
     * Set text and save localstorage
     * @param s
     */
    set textInput(s: string)
    {
        this.textInputCache = s
        localStorage.setItem(this.textInputKey, s)
    }

    mounted()
    {
        // Set initial size
        this.resizeInput()

        // Init spoilers
        initSpoilers()
    }

    /**
     * Auto resize
     */
    resizeInput()
    {
        const el = this.$refs.input
        el.style.height = "auto"
        el.style.height = `${el.scrollHeight + 18}px`
    }
}
</script>

<style lang="sass">
@import src/css/global
@import src/css/colors

.divp
    margin: 0.65em 0
    line-height: 1.6

.comment
    @extend .divp

    .from
        color: $color-text-light
        margin-left: 10px

    .from.anonymous
        color: lighten($color-text-light, 20%)

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
</style>
