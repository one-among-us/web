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

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'
import {t} from '@/logic/config'

interface TooltipAction {
    name: string
    icon: string
    md: string
    // is: (text: string, start: number, end: number) => boolean
}

const actions: TooltipAction[] = [
    { name: t.markdown_tooltip.bold, icon: 'bold', md: '**' },
    { name: t.markdown_tooltip.italic, icon: 'italic', md: '__' },
    { name: t.markdown_tooltip.underline, icon: 'underline', md: '--'},
    { name: t.markdown_tooltip.strikethrough, icon: 'strikethrough', md: '~~' },
    { name: t.markdown_tooltip.code, icon: 'code', md: '`' },
    { name: t.markdown_tooltip.spoiler, icon: 'spoiler', md: '||' },
]

const el = ref<HTMLElement | null>(null)
const props = defineProps<{
    initialPos?: { x: number, y: number } | null
    textAreaId: string
}>()

let textAreaEl: HTMLTextAreaElement
const selectedArea = ref<{ start: number, end: number } | null>(null)

onMounted(() => {
    textAreaEl = document.getElementById(props.textAreaId) as HTMLTextAreaElement
    document.addEventListener('selectionchange', documentSelectionChange)
})

onUnmounted(() => {
    document.removeEventListener('selectionchange', documentSelectionChange)
})

    /**
     * On document selection change
     *
     * This is necessary because there isn't a "deselect" event. One solution is to listen to blur,
     * focus, keydown, and mousedown events. It works most of the time, but when the user drags the
     * text, the mousedown event is called even though the text isn't deselected. So, we have to
     * listen to selection change event for the entire document instead.
     */
function documentSelectionChange(ev: UIEvent) {
    console.log("Document selection change", ev)
    const active = document.activeElement
    const tel = textAreaEl

    if (active != tel) return close()
    if (tel.selectionStart == tel.selectionEnd) return close()

    selectedArea.value = { start: tel.selectionStart, end: tel.selectionEnd }
    el.value?.classList.add('show')
}

function apply(e: UIEvent, act: TooltipAction) {
    e.preventDefault()
    if (!selectedArea.value) return
    let { start, end } = selectedArea.value
    const txt = textAreaEl.value
    const sel = txt.substring(start, end)

    const newTxt = txt.substring(0, start) + act.md + sel + act.md + txt.substring(end)
    document.execCommand('selectAll', false);
    const htmlEl = document.createElement('p');
    htmlEl.innerText = newTxt;
    document.execCommand('insertHTML', false, htmlEl.innerHTML);

    start += act.md.length
    end += act.md.length
    selectedArea.value = { start, end }
    textAreaEl.setSelectionRange(start, end)
}

function close() {
    selectedArea.value = null
    el.value?.classList.remove('show')
}

function setPos(x: number, y: number): void {
    if (!el.value) return
    el.value.style.left = x + 'px'
    el.value.style.top = y + 'px'
}

    /**
     * Window dragging
     */
function windowDrag(e: MouseEvent): void {
        // Only drag if it's dragging the root element, or the dragged element has 'drag' class
        function hasDrag(el: HTMLElement) {
            if (el.classList.contains('drag')) return true
            if (!el.parentElement) return false
            return hasDrag(el.parentElement)
        }

        if (!(e.target == el.value || hasDrag(e.target as HTMLElement))) return

        e.preventDefault()
        let lastX = e.clientX, lastY = e.clientY
        const mousemove = (e: MouseEvent) => {
            const dx = lastX - e.clientX, dy = lastY - e.clientY
            lastX = e.clientX;
            lastY = e.clientY
            if (!el.value) return
            setPos(el.value.offsetLeft - dx, el.value.offsetTop - dy)
        }
        console.log(lastX, lastY)
        const mouseup = () => {
            document.removeEventListener('mouseup', mouseup);
            document.removeEventListener('mousemove', mousemove)
        }
        document.addEventListener('mouseup', mouseup)
        document.addEventListener('mousemove', mousemove)
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
