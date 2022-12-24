<template>
    <div>
        <TgBlog id="profile-page" :posts-url="postsUrl" :posts-data="postsData" v-if="postsUrl">
            <ChannelBackupButton class="heading" text="返回" icon="fas fa-caret-left"
                                 :url="`/profile/${userid}`" />
        </TgBlog>
        <div v-if="error">
            加载页面错误... 请重试
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import {backupUrl} from "@/logic/config";
import {TgBlog} from "tg-blog";
import "tg-blog/dist/style.css"
import ChannelBackupButton from "@/components/ChannelBackupButton.vue";

const alias = {'tg': 'telegram', 'tw': 'twitter'}

@Options({components: {TgBlog, ChannelBackupButton}})
export default class ChannelBackup extends Vue
{
    @Prop({required: true}) userid: string
    @Prop({default: 'telegram'}) backup: string

    postsUrl: string = null
    postsData: string = null
    error: string = null

    get computedBackup() { return this.backup in alias ? alias[this.backup] : this.backup }

    async created()
    {
        try
        {
            // Support redirecting to another url
            let url = backupUrl(this.userid, this.computedBackup)
            let json = await (await fetch(url)).json()
            if (json.redirect)
            {
                url = json.redirect
                json = await (await fetch(url)).json()
            }

            this.postsData = json
            this.postsUrl = url
        }
        catch (e)
        {
            console.log(e)
            this.error = e
        }
    }
}
</script>

<style lang="sass" scoped>
.heading
    margin-bottom: 20px
</style>
