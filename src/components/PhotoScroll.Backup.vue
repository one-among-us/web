<template>
    <div id="PhotoScroll" class="fbox-h">
        <div id="prev" class="fbox-vcenter clickable">
            <div class="box fbox-vcenter">&lt;
                <div class="control" @click="scrollIndex--"></div>
            </div>
        </div>
        <div class="f-grow1"></div>
        <div v-for="(p, i) in photos" :key="i" class="img-container fbox-vcenter"
             :class="{left: i < scrollIndex, right: i > scrollIndex + maxDisplay}">
            <img :src="p" alt="p" class="photo-frame-5"
                 :style="{transform: `rotate(${rotations[i]}deg)`, 'z-index': i + 1}">
        </div>
        <div class="f-grow1"></div>
        <div id="next" class="fbox-vcenter clickable">
            <div class="box fbox-vcenter">&gt;
                <div class="control" @click="scrollIndex++"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {rand} from "@/logic/helper";

@Options({components: {}})
export default class PhotoScroll extends Vue
{
    photos = [
        'http://localhost:8081/people/siinamota/photos/1.png',
        'http://localhost:8081/people/siinamota/photos/2.jpg',
        'http://localhost:8081/people/siinamota/photos/3.jpg',
        'http://localhost:8081/people/siinamota/photos/4.jpg',
        'http://localhost:8081/people/siinamota/photos/5.jpg',
        'http://localhost:8081/people/siinamota/photos/6.jpg',
        'http://localhost:8081/people/siinamota/photos/7.jpg',
    ]

    rotations: number[] = []

    scrollIndex = 7
    maxDisplay = 4

    get displayedPhotos(): string[]
    {
        return this.photos.slice(this.scrollIndex, this.scrollIndex + this.maxDisplay)
    }

    created(): void
    {
        this.photos.forEach(() => this.rotations.push(rand(-15, 15)))
    }

    // created(): void
    // {
    //     let img = new Image();
    //     img.onload = () => {
    //         console.log(`the image dimensions are ${img.width}x${img.height}`);
    //     }
    //     img.src = "http://localhost:8081/people/siinamota/photos/1.png"
    // }
}
</script>

<style lang="sass" scoped>
@import "../css/colors"

#PhotoScroll > *
    margin-right: 10px

#PhotoScroll > *:last-child
    margin-right: 0

#PhotoScroll
    margin-bottom: 100px
    margin-top: 20px
    position: relative

    #prev, #next
        width: 50px

        .box
            height: 80px
            border: 2px dashed $color-text-main

            position: relative
            .control
                position: absolute
                width: 100%
                height: 100%
                z-index: 100
                border: 1px dotted #ffe1e1

    .img-container
        flex-grow: 1
        align-items: center

    img
        object-fit: cover
        display: block

        max-width: 10vw

    .img-container.right, .img-container.left
        position: absolute
        width: 0
        height: 100%

    .img-container.right
        right: 0

</style>
