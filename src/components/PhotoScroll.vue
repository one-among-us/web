<template>
    <div class="ps-wrapper">
        <div id="PhotoScroll">
            <img v-for="(p, i) in photoList" :key="i" :src="p.url" alt="" class="stacked photo-frame-5"
                 draggable="false"
                 :style="{
          transform: `translate(-50%, -50%) translateX(80px) rotate(${rotations[i]}deg)`,
          'z-index': photoList.length - i + 1,
          'min-width': '150px',
          'object-fit': 'cover'
        }" @click="() => viewerIndex = 0"/>
            <ImageViewer v-model:index="viewerIndex" :imgs="photoList"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {rand} from "@/logic/helper";
import {ImageViewer} from "tg-blog";
import "tg-blog/dist/style.css"

export interface ViewedImage {
    url: string;
    text?: string;
    date?: string;
    fileName?: string;
}

const props = defineProps<{
    photos: string[] | string
}>()

const viewerIndex = ref<number | null>(null)

const photoList = computed<ViewedImage[]>(() =>
    ((typeof props.photos === 'string') ? JSON.parse(props.photos) : props.photos).map(it => ({ url: it }))
)

const rotations = computed<number[]>(() =>
    photoList.value.map(() => rand(-15, 15))
)
</script>

<style lang="sass">
@use "@/css/colors" as *

.ps-wrapper
    display: flex
    flex-direction: row
    justify-content: center

#PhotoScroll
    position: relative
    height: 200px
    width: 160px

    margin-top: 20px
    margin-bottom: 20px

    img.stacked
        position: absolute
        max-height: 180px
        max-width: 180px
        left: 0
        top: 50%
        cursor: zoom-in


</style>
