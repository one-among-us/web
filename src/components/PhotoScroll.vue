<template>
    <div id="PhotoScroll">
        <img v-for="(p, i) in photos" :key="i"
             :src="p" alt="p" class="stacked photo-frame-5" draggable="false"
             :style="{transform: `translate(-50%, -50%) translateX(80px) rotate(${rotations[i]}deg)`,
                      'z-index': p.length - i + 1}" @click="() => viewerOpen = true"/>
        <el-image-viewer v-if="viewerOpen" :url-list="photos" :onClose="() => viewerOpen = false"/>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {rand} from "@/logic/helper";
import {Prop} from "vue-property-decorator";

@Options({components: {}})
export default class PhotoScroll extends Vue
{
    viewerOpen = false

    @Prop() photos!: string[]

    rotations: number[] = []

    get displayedPhotos(): string[]
    {
        return this.photos.slice(0, 4)
    }

    created(): void
    {
        this.photos.forEach(() => this.rotations.push(rand(-15, 15)))
    }
}
</script>

<style lang="sass">
@import "../css/colors"

#PhotoScroll
    position: relative
    height: 200px

    margin-top: 20px
    margin-bottom: 20px

    img.stacked
        position: absolute
        max-height: 180px
        max-width: 180px
        left: 0
        top: 50%


</style>
