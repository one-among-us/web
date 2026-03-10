<template>
    <i v-if="getIcon(icon)" :class="getIcon(icon)"></i>
    <Icon v-else-if="getIconifyIcon(icon)" :icon="getIconifyIcon(icon)"/>
    <IFasLink v-else/>
</template>

<script lang="ts">
import {fab} from "@/logic/constants";
import {Icon} from "@iconify/vue";
import {Component, Prop, Vue, toNative} from 'vue-facing-decorator';

@Component({ components: { Icon } })
class DynamicIcon extends Vue {
    @Prop() icon!: string

    getIcon(platform: string): string | undefined {
        platform = platform.toLowerCase()
        if (fab.includes(platform)) return `fab fa-${platform}`
        if (platform.startsWith('custom-icon:')) return platform.replace('custom-icon:', '')
    }

    getIconifyIcon(icon: string): string | undefined {
        if (icon.startsWith('iconify:')) return icon.replace('iconify:', '')
    }
}
export default toNative(DynamicIcon)
</script>
