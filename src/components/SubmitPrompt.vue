<template>
    <div id="SubmitPrompt" class="fbox-vcenter">
        <div id="prompt">
            <div id="header">要提交编辑吗？</div>
            <HyInput class="input" placeholder="名字" v-model="name"/>
            <HyInput class="input" placeholder="邮箱" v-model="name"/>

            <div>点击下面的验证码就能提交啦！</div>
            <RecaptchaV2 site-key="6LcbpzQdAAAAAN-J3dWZsi1t_ZRNT-ybUbmsQmH_"/>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import HyInput from "@/components/HyInput.vue";
import RecaptchaV2 from "@/components/RecaptchaV2.vue";

@Options({components: {RecaptchaV2, HyInput}})
export default class SubmitPrompt extends Vue
{
    name = ''
}
</script>

<style lang="sass" scoped>
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

</style>
