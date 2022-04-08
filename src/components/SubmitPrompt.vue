<template>
    <div id="SubmitPrompt" class="fbox-vcenter">
        <div id="prompt">
            <div id="header">要提交编辑吗
                <i id="close" class="el-icon-close clickable" @click="() => $emit('close')"></i>
            </div>

            <div>谢谢你！请留下你的名字！</div>
            <HyInput class="input" placeholder="名字" v-model="name"/>
            <HyInput class="input" placeholder="邮箱" v-model="email"/>

            <div>点击下面的验证码就能提交啦！</div>
            <RecaptchaV2 :site-key="captchaSiteKey" @verify="submit"/>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import HyInput from "@/components/HyInput.vue";
import RecaptchaV2 from "@/components/RecaptchaV2.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {backendHost, captchaSiteKey} from "@/logic/config";
import {Prop} from "vue-property-decorator";
import {neofetch} from "@/logic/helper";

@Options({components: {RecaptchaV2, HyInput}})
export default class SubmitPrompt extends Vue
{
    captchaSiteKey = captchaSiteKey

    name = ''
    email = ''
    
    @Prop({required: true}) node!: string
    @Prop({required: true}) params!: {[id: string]: string}

    submit(captcha: string): void
    {
        this.$emit('close')
        ElMessage.success('正在创建更改请求 (Pull Request)...')

        const params = {
            ...this.params,
            captcha: encodeURIComponent(captcha),
            name: encodeURIComponent(this.name),
            email: encodeURIComponent(this.email)
        }

        neofetch(backendHost + this.node, {method: 'POST', headers: params})
            .then(text => {
                ElMessageBox.confirm('提交成功！谢谢你',
                    {
                        confirmButtonText: '查看更改请求',
                        cancelButtonText: '好的',
                        type: 'warning',
                    })
                    .then(() => open(text))
            })
            .catch(error => {
                console.log(error)
                ElMessageBox.alert('失败原因：' + error.message, '提交失败')
            })
    }
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

#prompt
    width: 320px
    margin: auto
    background: white
    border-radius: 10px
    padding: 15px

#prompt > *
    margin-bottom: 10px

#prompt > *:last-child
    margin-bottom: 0

#header
    text-align: left
    font-weight: bold

#close
    float: right
</style>
