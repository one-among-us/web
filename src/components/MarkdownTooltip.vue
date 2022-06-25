<template>
    <div id="MarkdownTooltip">
        <el-tooltip v-for="act in actions" :key="act.name" :content="act.name">
            <i :class="act.icon"></i>
        </el-tooltip>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';

interface TooltipAction {
    name: string
    icon: string
    fn: (text: string) => void
}

@Options({components: {}})
export default class MarkdownTooltip extends Vue
{
    actions: TooltipAction[] = [
        {name: '加粗',   icon: 'fa-solid fa-bold',          fn: text => `**${text}**`},
        {name: '斜体',   icon: 'fa-solid fa-italic',        fn: text => `_${text}_`},
        {name: '下划线', icon: 'fa-solid fa-underline',     fn: text => `${text}`},
        {name: '划掉',   icon: 'fa-solid fa-strikethrough', fn: text => `~~${text}~~`},
        {name: '代码',   icon: 'fa-solid fa-code',          fn: text => `\`${text}\``},
        {name: '黑幕',   icon: 'fa-solid fa-eye-slash',     fn: text => `||${text}||`},
    ]
}
</script>

<style lang="sass" scoped>
#MarkdownTooltip
    position: absolute
    background: transparentize(#5d5d5d, 0.8)
    backdrop-filter: blur(10px)

</style>
