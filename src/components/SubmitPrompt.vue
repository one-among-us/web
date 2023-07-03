<template>
    <div id="SubmitPrompt" class="fbox-vcenter">
        <div id="prompt">
            <div id="header">{{i18n.nav_will_submit}}
                <IFasXmark class="clickable" @click="() => $emit('close')"></IFasXmark>
            </div>

            <div class="text">{{i18n.nav_req_name}}
                <div class="sub">{{i18n.nav_req_anonymous}}</div>
            </div>
            <HyInput class="input first" placeholder="名字" v-model="name"/>
            <HyInput class="input" placeholder="邮箱（可选）" v-model="email"/>

            <div>{{i18n.nav_reCAPTCHA}}</div>
            <RecaptchaV2 @verify="submit"/>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import HyInput from "@/components/HyInput.vue";
import RecaptchaV2 from "@/components/RecaptchaV2.vue";
import {i18n, getLang} from "@/logic/config";


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

    i18n = i18n[getLang()];

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
    display: flex
    font-weight: bold
    svg
        margin-left: auto

#close
    float: right

.text
    .sub
        font-size: small
        color: $color-text-light

</style>
