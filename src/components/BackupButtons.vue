<template>
    <div id="BackupButtons">
        <ChannelBackupButton v-for="p in platforms" :key="p" :platform="p" />
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import ChannelBackupButton from "@/components/ChannelBackupButton.vue";
import {Prop} from "vue-property-decorator";

@Options({components: {ChannelBackupButton}})
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
