<template>
    <div id="SubmitPrompt" class="fbox-vcenter">
        <div id="prompt">
            <div id="header">{{ t.nav_will_submit }}
                <IFasXmark class="clickable" @click="() => $emit('close')"></IFasXmark>
            </div>

            <div class="text">{{ t.nav_req_name }}
                <div class="sub">{{ t.nav_req_anonymous }}</div>
            </div>
            <HyInput class="input first" :placeholder="t.name" v-model="name"/>
            <HyInput class="input" :placeholder="t.email" v-model="email"/>

            <div>{{ t.nav_reCAPTCHA }}</div>
            <RecaptchaV2 @verify="submit"/>
        </div>
    </div>
</template>

<script lang="ts">
import HyInput from "@/components/HyInput.vue";
import RecaptchaV2 from "@/components/RecaptchaV2.vue";
import {t} from "@/logic/config";
import {Component, Vue} from 'vue-facing-decorator';


export interface CaptchaResponse {
    captcha: string
    name: string
    email: string
}


@Component({ components: { RecaptchaV2, HyInput } })
export default class SubmitPrompt extends Vue {
    name = ''
    email = ''

    t = t;

    submit(captcha: string): void {
        this.$emit('submit', { captcha, name: this.name, email: this.email })
        this.$emit('close')
    }
}
</script>

<style lang="sass" scoped>
@use "@/css/global" as *

#SubmitPrompt
    // Cover entire page
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    height: 100%
    background: rgba(0, 0, 0, .5)
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

[data-theme="dark"]
    #prompt
        background: $color-bg-dark-5
</style>
