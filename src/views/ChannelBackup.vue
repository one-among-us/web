<template>
    <div>
        <TgBlog :posts-url="backupUrl">

        </TgBlog>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import {backupUrl} from "@/logic/config";
import {TgBlog} from "tg-blog";
import "tg-blog/dist/style.css"

@Options({components: {TgBlog}})
export default class ChannelBackup extends Vue
{
    @Prop({required: true}) userid: string
    @Prop({required: true}) platform: string

    get backupUrl() { return backupUrl(this.userid, this.platform) }
}
</script>

<style lang="sass" scoped>

</style>
