<template>
    <div id="ProfileComments" class="markdown-content">
        <h1>留言</h1>

        <div id="comments" v-if="p.comments.length > 0">
            <p class="comment" v-for="c in p.comments" :key="c">
                <span class="content">{{c.content + (c.content.endsWith('。') ? '' : '。')}}</span>
                <span class="from">——{{c.submitter}}</span>
            </p>
        </div>

        <div id="add-comment">
            <textarea v-model="textInput" placeholder="添加留言..." @input="resizeInput" ref="input"/>
            <div id="send-comment-btn" v-if="textInput.length > 0">
                <span class="char-count unselectable">{{textInput.length}} 字（已存草稿）</span>
                <i class="fas fa-paper-plane clickable" @click="btnSend"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import {Person} from "@/logic/data";

@Options({components: {}})
export default class ProfileComments extends Vue
{
    declare $refs: {
        input: HTMLTextAreaElement
    }

    @Prop() p: Person

    private textInputCache = ""
    private textInputKey: string

    /**
     * Send button
     */
    btnSend()
    {
        console.log('hi')
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
