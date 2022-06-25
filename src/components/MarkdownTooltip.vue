<template>
    <div id="MarkdownTooltip" class="noanim" ref="el" @keydown.esc="close" @mousedown="windowDrag">
        <el-tooltip v-for="act in actions" :key="act.name" :content="act.name">
            <i :class="act.icon" @click="() => apply(act)"/>
        </el-tooltip>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop, Ref} from "vue-property-decorator";

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
        // {name: '下划线', icon: 'fa-solid fa-underline',     fn: text => `${text}`},
        {name: '划掉',   icon: 'fa-solid fa-strikethrough', fn: text => `~~${text}~~`},
        {name: '代码',   icon: 'fa-solid fa-code',          fn: text => `\`${text}\``},
        {name: '黑幕',   icon: 'fa-solid fa-eye-slash',     fn: text => `||${text}||`},
    ]

    @Ref() el!: HTMLElement
    @Prop({default: null}) initialPos?: {x: number, y: number}

    @Prop() textAreaId!: string
    textAreaEl: HTMLTextAreaElement
    selectedText = ""

    mounted()
    {
        // Get text area element
        this.textAreaEl = document.getElementById(this.textAreaId) as HTMLTextAreaElement
        document.addEventListener('selectionchange', this.documentSelectionChange)
    }

    unmounted()
    {
        document.removeEventListener('selectionchange', this.documentSelectionChange)
    }

    /**
     * On document selection change
     *
     * This is necessary because there isn't a "deselect" event. One solution is to listen to blur,
     * focus, keydown, and mousedown events. It works most of the time, but when the user drags the
     * text, the mousedown event is called even though the text isn't deselected. So, we have to
     * listen to selection change event for the entire document instead.
     */
    documentSelectionChange(ev: UIEvent)
    {
        const active = document.activeElement
        const tel = this.textAreaEl

        // Textarea is not focused, then it's deselected
        if (active != tel) return this.close()

        // Get selection
        const sel = tel.value.substring(tel.selectionStart, tel.selectionEnd)

        // Selection is empty
        if (sel == "") return this.close()

        this.selectedText = sel
        this.el.classList.add('show')
        this.el.focus()

        this.$forceUpdate()

        console.log(sel)
    }

    apply(act: TooltipAction)
    {
        console.log(act)
    }

    close()
    {
        console.log('closed')
        this.selectedText = ""
        this.el.classList.remove('show')
    }

    setPos(x: number, y: number): void
    {
        this.el.style.left = x + 'px'
        this.el.style.top = y + 'px'
    }

    /**
     * Window dragging
     */
    windowDrag(e: MouseEvent): void
    {
        e.preventDefault()
        let lastX = e.clientX, lastY = e.clientY
        const mousemove = (e: MouseEvent) =>
        {
            const dx = lastX - e.clientX, dy = lastY - e.clientY
            lastX = e.clientX; lastY = e.clientY
            this.setPos(this.el.offsetLeft - dx, this.el.offsetTop - dy)
        }
        console.log(lastX, lastY)
        const mouseup = () => {document.removeEventListener('mouseup', mouseup); document.removeEventListener('mousemove', mousemove)}
        document.addEventListener('mouseup', mouseup)
        document.addEventListener('mousemove', mousemove)
    }
}
</script>

<style lang="sass">
@import src/css/global

#MarkdownTooltip:not(.show)
    opacity: 0
    pointer-events: none

#MarkdownTooltip
    position: absolute
    background: transparentize($color-text-light, 0.8)
    color: $color-text-light
    backdrop-filter: blur(10px)
    opacity: 0.9

    border-radius: 10px
    padding: 8px 12px

    white-space: nowrap

    i + i
        margin-left: 10px


</style>
