<template>
    <div>
        <TgBlog id="profile-page" :posts-url="postsUrl" :posts-data="postsData" v-if="postsUrl">
            <ChannelBackupButton class="heading" :text="t.backup.back" icon="icon-back"
                                 :url="`/profile/${userid}`"/>
        </TgBlog>
        <div v-if="error">
            {{ t.backup.error }}
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import ChannelBackupButton from "@/components/buttons/ChannelBackupButton.vue";
import {backupUrl, t} from "@/logic/config";
import {TgBlog} from "tg-blog";
import "tg-blog/dist/style.css"

const alias = { 'tg': 'telegram', 'tw': 'twitter' }

const props = withDefaults(defineProps<{
    userid: string
    backup?: string
}>(), {
    backup: 'telegram'
})
const userid = props.userid

const postsUrl = ref<string | null>(null)
const postsData = ref<string | null>(null)
const error = ref<string | null>(null)

const computedBackup = computed(() =>
    props.backup in alias ? alias[props.backup as keyof typeof alias] : props.backup
)

async function loadData() {
    try {
        let url = backupUrl(props.userid, computedBackup.value)
        let json = await (await fetch(url)).json()
        if (json.redirect) {
            url = json.redirect
            json = await (await fetch(url)).json()
        }

        postsData.value = json
        postsUrl.value = url
    } catch (e) {
        console.log(e)
        error.value = String(e)
    }
}

loadData()
</script>

<style lang="sass" scoped>
.heading
    margin-bottom: 20px
</style>
