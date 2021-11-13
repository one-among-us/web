<template>
    <div>
    <div id="container" class="fbox-vcenter">
        <div class="spacer"/>
        <div id="EditInfo" v-if="p">
            <div class="head-text info">信息卡片</div>
            <div id="id">@{{userid}}</div>
            <div class="fields info">
                <div class="input-box" v-for="info in p.info" :key="info.key">
                    <input class="key" v-model="info[0]" @change="change"/>
                    <input class="value" v-model="info[1]" @change="change"/>
                </div>
            </div>
            <div class="head-text websites">网站</div>
            <div class="fields websites">
                <div class="input-box" v-for="web in p.websites" :key="web.key">
                    <input class="key" v-model="web[0]" @change="change"/>
                    <input class="value" v-model="web[1]" @change="change"/>
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
import {parsePeopleJson, Person, removeEmpty, toJson} from "@/logic/data";
import {dataHost} from "@/logic/config.";
import json5 from "json5";

@Options({components: {}})
export default class EditInfo extends Vue
{
    @Prop() userid!: string
    p: Person = null as never as Person

    created(): void
    {
        // TODO: Handle errors
        // Get data from server
        fetch(dataHost + `/people/${this.userid.toLowerCase()}/info.json5`)
            .then(it => it.text())
            .then(it => {
                this.p = parsePeopleJson(it)
                this.change()
            })
    }

    change(): void
    {
        for (let list of [this.p.info, this.p.websites])
        {
            // Remove redundant last entries
            if (list.filter(it => !it[0] && !it[1]).length > 1)
                removeEmpty(list)

            // Add empty
            if (list.filter(it => !it[0] && !it[1]).length == 0)
                list.push(['', ''])
        }
    }

    submit(): void
    {
        removeEmpty(this.p.info)
        removeEmpty(this.p.websites)
        console.log(toJson(this.p))
        this.change()
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
