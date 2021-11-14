<template>
    <div id="PhotoScroll">
        <img v-for="(p, i) in photos" :key="i"
             :src="p" alt="p" class="photo-frame-5" draggable="false"
             :style="{transform: `translate(-50%, -50%) translateX(80px) rotate(${rotations[i]}deg)`, 'z-index': i + 1}">
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

<style lang="sass" scoped>
@import "../css/colors"

#PhotoScroll
    position: relative
    height: 200px

    margin-top: 20px
    margin-bottom: 20px

img
    position: absolute
    max-height: 180px
    max-width: 180px
    left: 50%
    top: 50%


</style>
