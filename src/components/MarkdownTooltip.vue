<template>
    <div id="MarkdownTooltip" class="noanim" ref="el" @keydown.esc="close" @mousedown="windowDrag">
        <span class="drag"><IFasGripLinesVertical/></span>
        <el-tooltip v-for="act in actions" :key="act.name" :content="act.name">
            <span class="icon-wrapper" @mousedown="e => apply(e, act)">
                <IFasBold v-if="act.icon === 'bold'"/>
                <IFasItalic v-if="act.icon === 'italic'"/>
                <IFasUnderline v-if="act.icon === 'underline'"/>
                <IFasStrikethrough v-if="act.icon === 'strikethrough'"/>
                <IFasCode v-if="act.icon === 'code'"/>
                <IFasEyeSlash v-if="act.icon === 'spoiler'"/>
            </span>
        </el-tooltip>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from 'vue-facing-decorator';
import {t} from '@/logic/config'

interface TooltipAction {
    name: string
    icon: string
    md: string
    // is: (text: string, start: number, end: number) => boolean
}

@Component({})
export default class MarkdownTooltip extends Vue {
    actions: TooltipAction[] = [
        { name: t.markdown_tooltip.bold, icon: 'bold', md: '**' },
        { name: t.markdown_tooltip.italic, icon: 'italic', md: '__' },
        { name: t.markdown_tooltip.underline, icon: 'underline', md: '--'},
        { name: t.markdown_tooltip.strikethrough, icon: 'strikethrough', md: '~~' },
        { name: t.markdown_tooltip.code, icon: 'code', md: '`' },
        { name: t.markdown_tooltip.spoiler, icon: 'spoiler', md: '||' },
    ]

    @Ref() el!: HTMLElement
    @Prop({ default: null }) initialPos?: { x: number, y: number }

    @Prop() textAreaId!: string
    textAreaEl: HTMLTextAreaElement
    selectedArea?: { start: number, end: number } = null

    mounted() {
        // Get text area element
        this.textAreaEl = document.getElementById(this.textAreaId) as HTMLTextAreaElement
        document.addEventListener('selectionchange', this.documentSelectionChange)
    }

    unmounted() {
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
    documentSelectionChange(ev: UIEvent) {
        console.log("Document selection change", ev)
        const active = document.activeElement
        const tel = this.textAreaEl

        // Textarea is not focused, then it's deselected
        if (active != tel) return this.close()

        // Selection is empty
        if (tel.selectionStart == tel.selectionEnd) return this.close()

        this.selectedArea = { start: tel.selectionStart, end: tel.selectionEnd }
        this.el.classList.add('show')
    }

    apply(e: UIEvent, act: TooltipAction) {
        e.preventDefault()
        let { start, end } = this.selectedArea
        const txt = this.textAreaEl.value
        const sel = txt.substring(start, end)

        // Change text while preserving history (TODO: Manually implement undo/redo
        const newTxt = txt.substring(0, start) + act.md + sel + act.md + txt.substring(end)
        document.execCommand('selectAll', false);
        const el = document.createElement('p');
        el.innerText = newTxt;
        document.execCommand('insertHTML', false, el.innerHTML);
        // this.textAreaEl.value = newTxt

        // Update selection range
        start += act.md.length
        end += act.md.length
        this.selectedArea = { start, end }
        this.textAreaEl.setSelectionRange(start, end)
    }

    close() {
        this.selectedArea = null
        this.el.classList.remove('show')
    }

    setPos(x: number, y: number): void {
        this.el.style.left = x + 'px'
        this.el.style.top = y + 'px'
    }

    /**
     * Window dragging
     */
    windowDrag(e: MouseEvent): void {
        // Only drag if it's dragging the root element, or the dragged element has 'drag' class
        function hasDrag(el: HTMLElement) {
            if (el.classList.contains('drag')) return true
            if (!el.parentElement) return false
            return hasDrag(el.parentElement)
        }

        if (!(e.target == this.el || hasDrag(e.target as HTMLElement))) return

        e.preventDefault()
        let lastX = e.clientX, lastY = e.clientY
        const mousemove = (e: MouseEvent) => {
            const dx = lastX - e.clientX, dy = lastY - e.clientY
            lastX = e.clientX;
            lastY = e.clientY
            this.setPos(this.el.offsetLeft - dx, this.el.offsetTop - dy)
        }
        console.log(lastX, lastY)
        const mouseup = () => {
            document.removeEventListener('mouseup', mouseup);
            document.removeEventListener('mousemove', mousemove)
        }
        document.addEventListener('mouseup', mouseup)
        document.addEventListener('mousemove', mousemove)
    }
}
</script>

<style lang="sass">
@use "@/css/global" as *

#MarkdownTooltip:not(.show)
    opacity: 0
    pointer-events: none

#MarkdownTooltip
    position: absolute

    background: #fffcf9b5
    color: $color-text-light
    backdrop-filter: blur(10px)
    opacity: 0.9
    filter: drop-shadow(0 2px 5px rgba(166, 134, 89, 0.42))
    transition: opacity 0.5s ease

    border-radius: 10px
    padding: 5px

    display: flex
    align-items: center
    z-index: 255

    white-space: nowrap

    .icon-wrapper + .icon-wrapper
        margin-left: 2px

    .icon-wrapper
        display: inline-flex
        align-items: center
        justify-content: center

        width: 30px
        height: 30px
        padding: 0
        border-radius: 8px

    .icon-wrapper:hover
        background: white

    .drag
        display: inline-block
        padding-left: 3px
        padding-right: 8px

[data-theme="dark"]
    #MarkdownTooltip
        background: #fffcff30
        color: $color-text-dark-light
        filter: drop-shadow(0 2px 5px rgba(166, 134, 89, 0.42))

        .icon-wrapper:hover
            background: $color-bg-dark-5

</style>
