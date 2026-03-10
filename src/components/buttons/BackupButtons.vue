<template>
    <div id="BackupButtons">
        <ChannelBackupButton v-for="p in platforms" :key="p" :platform="p"/>
    </div>
</template>

<script lang="ts">
import ChannelBackupButton from "@/components/buttons/ChannelBackupButton.vue";
import {Component, Prop, Vue, toNative} from 'vue-facing-decorator';

@Component({ components: { ChannelBackupButton } })
class BackupButtons extends Vue {
    @Prop({ required: true }) platforms: string[]
}
export default toNative(BackupButtons)
</script>

<style lang="sass" scoped>
#BackupButtons
    margin: 10px 0
    display: flex
    gap: 20px
</style>
