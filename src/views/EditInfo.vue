<template>
    <div>
    <div id="container" class="fbox-vcenter">
        <div class="spacer"/>
        <div id="EditInfo" v-if="p">
            <div class="head-text info">信息卡片</div>
            <div id="id">@{{userid}}</div>
            <div class="fields info">
                <div class="input-box" v-for="info in editInfo" :key="info[0]">
                    <input class="key" v-model="info.k" @change="change"/>
                    <input class="value" v-model="info.v" @change="change"/>
                </div>
            </div>
            <div class="head-text websites">网站</div>
            <div class="fields websites">
                <div class="input-box" v-for="web in editWebsites" :key="web[0]">
                    <input class="key" v-model="web.k" @change="change"/>
                    <input class="value" v-model="web.v" @change="change"/>
                </div>
            </div>
            <div class="button submit" @click="submit">提交</div>
        </div>
        <div class="spacer"/>
    </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import {parsePeopleJson, Person, toJson, url} from "@/logic/data";
import {backendHost, dataHost} from "@/logic/config.";
import {ElMessage, ElMessageBox} from "element-plus";

interface KVPair { k: string, v: string }

export function removeEmpty(arr: KVPair[]): void
{
    let i = 0;
    while (i < arr.length) {
        if (!arr[i].k && !arr[i].v) arr.splice(i, 1)
        else ++i
    }
}

@Options({components: {}})
export default class EditInfo extends Vue
{
    @Prop() userid!: string
    p: Person = null as never as Person

    initialJson!: string

    editInfo: KVPair[] = []
    editWebsites: KVPair[] = []

    created(): void
    {
        // TODO: Handle errors
        // Get data from server
        fetch(dataHost + `/people/${this.userid.toLowerCase()}/info.json5`)
            .then(it => it.text())
            .then(it => {
                this.initialJson = it
                this.p = parsePeopleJson(it)
                this.p.info.forEach((a) => this.editInfo.push({k: a[0], v: a[1]}))
                this.p.websites.forEach((a) => this.editWebsites.push({k: a[0], v: a[1]}))
                this.change()
            })
    }

    change(): void
    {
        for (let list of [this.editInfo, this.editWebsites])
        {
            // Remove redundant last entries
            if (list.filter(it => !it.k && !it.v).length > 1)
                removeEmpty(list)

            // Add empty
            if (list.filter(it => !it.k && !it.v).length == 0)
                list.push({k: '', v: ''})
        }
    }

    submit(): void
    {
        ElMessageBox.confirm('确定要提交嘛？',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        })
        .then(() => {
            ElMessage({
                type: 'success',
                message: '正在创建更改请求 (Pull Request)...',
            })

            removeEmpty(this.editInfo)
            removeEmpty(this.editWebsites)
            this.p.info = this.editInfo.map(it => [it.k, it.v])
            this.p.websites = this.editWebsites.map(it => [it.k, it.v])
            let json = toJson(this.p)
            console.log(json)

            // fetch(url(backendHost + `/edit/info`, {id: this.p.id, json: json}))
            //     .then(it => it.text())
            //     .then(it => {
            //         ElMessageBox.confirm('提交成功！谢谢你',
            //         {
            //             confirmButtonText: '查看更改请求',
            //             cancelButtonText: '好的',
            //             type: 'warning',
            //         })
            //         .then(() => {
            //             open(it)
            //         })
            //     })

            this.change()
        })
    }
}
</script>

<style lang="sass" scoped>
@import "../css/colors"

#container
    height: 100%

    .spacer
        flex-grow: 1

#EditInfo
    background: $color-bg-5
    margin: 0 min(5vw, 40px)
    padding: 20px 30px
    border-radius: 30px
    filter: drop-shadow(0 2px 5px rgba(166, 134, 89, 0.42))

    #id
        margin-top: -5px
        margin-bottom: 5px
        color: $color-text-light

    .head-text
        font-weight: bold
        font-size: 1.2em

    .head-text.websites
        margin-top: 20px
        margin-bottom: 5px

    .input-box
        width: 100%
        display: flex
        margin-bottom: 5px

        input
            flex-grow: 1
            border-radius: 5px
            border: none
            background-color: $color-bg-4
            padding: 4px 8px
            color: $color-text-main
            text-align: center

        input.key
            margin-right: 10px
            font-weight: bold

        input:focus-visible
            outline-color: $color-text-light

    .button.submit
        margin-top: 30px
        background-color: $color-bg-6
        border-radius: 10px
        padding: 8px 0
        //border: 2px solid $color-text-main
        filter: drop-shadow(0 2px 5px rgba(166, 134, 89, 0.16))

    .button.submit:hover
        filter: drop-shadow(0 2px 5px rgba(166, 134, 89, 0.42))
        cursor: pointer
        transform: translateY(-5px)

@media screen and (max-width: 480px)
    #EditInfo
        margin: 0
        padding: 20px 30px
        border-radius: 0

        .button.submit:hover
            transform: none

@media screen and (max-width: 430px)
    .input-box
        flex-direction: column

    #EditInfo .input-box
        input.key
            border-top: 1px solid #ff7878
            border-bottom: 1px solid $color-bg-6
            margin: 0
            border-bottom-left-radius: 0
            border-bottom-right-radius: 0

        input.value
            border-bottom: 1px solid #ff7878
            border-top-left-radius: 0
            border-top-right-radius: 0
</style>
