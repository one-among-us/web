<template>
    <div id="BackupButtons">
        <ChannelBackupButton v-for="p in platforms" :key="p" :platform="p" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import ChannelBackupButton from "@/components/ChannelBackupButton.vue";

@Component({components: {ChannelBackupButton}})
export default class BackupButtons extends Vue
{
    @Prop({required: true}) platforms: string[]
}
</script>

<style lang="sass" scoped>
#BackupButtons
    margin: 10px 0
    display: flex
    gap: 20px
</style>
