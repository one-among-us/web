<template>
    <div id="BackupButtons">
        <ChannelBackupButton v-for="p in platforms" :key="p" :platform="p"/>
    </div>
</template>

<script setup lang="ts">
import ChannelBackupButton from "@/components/buttons/ChannelBackupButton.vue";
defineProps<{
    platforms: string[]
}>()
</script>

<style lang="sass" scoped>
#BackupButtons
    margin: 10px 0
    display: flex
    gap: 20px
</style>
