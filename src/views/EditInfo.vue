<template>
    <div>
    <div id="EditInfo">
        <div>@{{userid}}</div>
        <div class="head-text info">信息卡片</div>
        <div class="fields info">
            <div v-for="info in editInfo" :key="info.key">
                <input class="key" v-model="info.key"/>
                <input class="value" v-model="info.val"/>
            </div>
        </div>
        <div class="head-text websites">网站</div>
        <div class="fields websites">
            <div v-for="web in editWebsites" :key="web.key">
                <input class="key" v-model="web.key"/>
                <input class="value" v-model="web.val"/>
            </div>
        </div>
        <div class="button" @click="submit">提交</div>
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
            })
    }

    submit(): void
    {
        alert("这个功能还没有实现！")
    }
}
</script>

<style lang="sass" scoped>

</style>
