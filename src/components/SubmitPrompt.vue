<template>
    <div id="SubmitPrompt" class="fbox-vcenter">
        <div id="prompt">
            <div id="header">要提交编辑吗？
                <i id="close" class="fas fa-xmark" @click="() => $emit('close')"></i>
            </div>

            <div class="text">谢谢你！请留下你的昵称！
                <div class="sub">（如果不想留名字也可以填匿名哦）</div>
            </div>
            <HyInput class="input first" placeholder="名字" v-model="name"/>
            <HyInput class="input" placeholder="邮箱（可选）" v-model="email"/>

            <div>点击下面的验证码就能提交啦！</div>
            <RecaptchaV2 @verify="submit"/>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import HyInput from "@/components/HyInput.vue";
import RecaptchaV2 from "@/components/RecaptchaV2.vue";


export interface CaptchaResponse
{
    captcha: string
    name: string
    email: string
}


@Options({components: {RecaptchaV2, HyInput}})
export default class SubmitPrompt extends Vue
{
    name = ''
    email = ''

    submit(captcha: string): void
    {
        this.$emit('submit', {captcha, name: this.name, email: this.email})
        this.$emit('close')
    }
}
</script>

<style lang="sass" scoped>
@import src/css/global

#SubmitPrompt
    // Cover entire page
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    height: 100%
    background: rgba(0,0,0,.5)
    z-index: 1000

    text-align: center

#prompt
    width: 306px
    margin: auto
    background: white
    border-radius: 10px
    padding: 15px

    > *
        margin-bottom: 20px

    > *:last-child
        margin-bottom: 0

    > .input.first
        margin-bottom: 10px

#header
    text-align: left
    font-weight: bold

#close
    float: right

.text
    .sub
        font-size: small
        color: $color-text-light

</style>
