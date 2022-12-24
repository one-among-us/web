<template>
    <div>
        <TgBlog id="profile-page" :posts-url="backupUrl" v-if="backup">
            <ChannelBackupButton class="heading" text="返回信息页面" icon="fas fa-caret-left"
                                 :url="`/profile/${userid}`" />
        </TgBlog>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import {backupUrl} from "@/logic/config";
import {TgBlog} from "tg-blog";
import "tg-blog/dist/style.css"
import {Person} from "@/logic/data";
import ChannelBackupButton from "@/components/ChannelBackupButton.vue";

@Options({components: {TgBlog, ChannelBackupButton}})
export default class ChannelBackup extends Vue
{
    @Prop({required: true}) userid: string
    @Prop({required: true}) backup: string
    p: Person

    get backupUrl() { return backupUrl(this.userid, this.backup) }
}
</script>

<style lang="sass" scoped>
.heading
    margin-bottom: 20px
</style>
