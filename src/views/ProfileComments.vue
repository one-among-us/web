<template>
    <div id="ProfileComments" class="markdown-content">
        <h1>留言</h1>

        <div id="comments" v-if="p.comments.length > 0">
            <p class="comment" v-for="c in comments" :key="c.id">
                <span class="content" v-html="c.content"></span>
                <span class="from anonymous" v-if="c.anonymous">——匿名小可爱</span>
                <span class="from" v-else>——{{c.submitter}}</span>
            </p>
        </div>

        <div id="add-comment">
            <textarea id="comment-textarea" v-model="textInput" placeholder="添加留言... （支持 Markdown 哦！"
                      @input="resizeInput" ref="input"/>
            <div id="send-comment-btn" v-if="textInput.length > 0">
                <span class="char-count unselectable">{{textInput.length}} 字（已存草稿）</span>
                <i class="fas fa-paper-plane clickable" @click="btnSend"/>
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
import {ElMessage} from "element-plus/es";
import {neofetch} from "@/logic/helper";
import {backendHost} from "@/logic/config";
import {ElMessageBox} from "element-plus";
import {initSpoilers, mdParseInline} from "@/logic/spoiler";
import MarkdownTooltip from "@/components/MarkdownTooltip.vue";

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
            content: mdParseInline(c.content)
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
        console.log(params)

        neofetch(backendHost + '/comment/add', {method: 'POST', params})
            .then(() => {
                this.textInput = ""
                ElMessageBox.alert('提交成功！谢谢你！\n我们审核之后会给你发邮件')
            })
            .catch(error => {
                console.log(error)
                ElMessageBox.alert('失败原因：' + error.message, '提交失败')
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

.comment
    .from
        color: $color-text-light
        margin-left: 10px

    .from.anonymous
        color: lighten($color-text-light, 20%)


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

        .char-count
            font-size: 10px
            color: $color-text-light
            margin-right: 6px
</style>
