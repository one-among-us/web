<template>
    <div>
    <div id="container" class="fbox-vcenter">
        <div class="spacer"/>
        <div id="EditInfo">
            <div class="head-text info">信息卡片</div>
            <div id="id">@{{userid}}</div>
            <div class="fields info">
                <div class="input-box" v-for="info in editInfo" :key="info.key">
                    <input class="key" v-model="info.key" @change="change"/>
                    <input class="value" v-model="info.val" @change="change"/>
                </div>
            </div>
            <div class="head-text websites">网站</div>
            <div class="fields websites">
                <div class="input-box" v-for="web in editWebsites" :key="web.key">
                    <input class="key" v-model="web.key" @change="change"/>
                    <input class="value" v-model="web.val" @change="change"/>
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
import {Person} from "@/logic/data";
import {dataHost} from "@/logic/config.";
import json5 from "json5";

interface KVPair {key: string, val: string}

function isEmpty(p: KVPair)
{
    return !p.key && !p.val
}

function removeEmpty(arr: KVPair[])
{
    let i = 0;
    while (i < arr.length) {
        if (isEmpty(arr[i])) arr.splice(i, 1)
        else ++i
    }
    return arr
}

@Options({components: {}})
export default class EditInfo extends Vue
{
    @Prop() userid!: string
    p: Person = null as never as Person

    // TODO: Save in localstorage on change
    editInfo: KVPair[] = []
    editWebsites: KVPair[] = []

    created(): void
    {
        // TODO: Handle errors
        // Get data from server
        fetch(dataHost + `/people/${this.userid.toLowerCase()}/info.json5`)
            .then(it => it.text())
            .then(it => {
                this.p = json5.parse(it)
                if (!this.p.info) this.p.info = {}
                if (!this.p.websites) this.p.websites = {}

                for (let key in this.p.info)
                    this.editInfo.push({key: key, val: this.p.info[key]})
                for (let key in this.p.websites)
                    this.editWebsites.push({key: key, val: this.p.websites[key]})

                this.change()
            })
    }

    change(): void
    {
        for (let list of [this.editInfo, this.editWebsites])
        {
            // Remove redundant last entries
            if (list.filter(it => isEmpty(it)).length > 1)
                removeEmpty(list)

            // Add empty
            if (list.filter(it => isEmpty(it)).length == 0)
                list.push({key: '', val: ''})
        }
    }

    submit(): void
    {
        alert("这个功能还没有实现！")
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
