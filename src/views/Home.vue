<template>
    <div>
    <div id="home" :class="clicked ? 'clicked' : ''">
        <div id="introduction">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eu dignissim velit, condimentum commodo metus. Nullam libero massa, condimentum eget erat vel, lobortis tristique enim. Donec vestibulum orci a orci elementum pellentesque vel ut est. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse et eros magna. Suspendisse potenti. Mauris luctus risus eget magna eleifend ultrices. Quisque magna lorem, laoreet ut velit non, auctor pharetra ligula. Duis quis elit turpis. Nunc et odio dui. Nunc erat enim, placerat eu tellus non, dignissim semper arcu. Pellentesque feugiat metus ac magna dignissim placerat. Sed vitae rhoncus libero. Quisque pharetra consectetur nisi quis pulvinar. Sed quis fermentum justo. Nunc blandit vitae neque quis dictum.
        </div>

        <div id="profiles" class="unselectable" v-if="people">
            <div class="profile" v-for="p in people" :key="p">
                <div class="back"/>
                <transition name="fade" @after-leave="() => switchPage(p)">
                    <img :src="p.profileUrl" draggable="false" alt="profile" class="front"
                         v-if="clicked !== p.name"
                         @click="() => { if (!clicked) clicked = p.name }">
                </transition>
                <div class="sub-text font-custom">{{p.name}}</div>
                <div class="bookmark"/>
            </div>
            <div class="profile">
                <div class="back add fbox-vcenter">+</div>
            </div>
        </div>
    </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {PersonMeta} from "@/logic/data";
import {dataHost} from "@/logic/config.";
import json5 from 'json5';

@Options({components: {}})
export default class Home extends Vue
{
    clicked = ''

    people: PersonMeta[] = null as never as PersonMeta[]

    created(): void
    {
        fetch(dataHost + '/generated/people-list.json5')
            .then(it => it.text())
            .then(it => {
                this.people = json5.parse(it)
                console.log(it)
                console.log(this.people)
            })
    }

    switchPage(p: PersonMeta): void
    {
        console.log("Called, " + p.id)
        this.$router.push(`/profile/${p.id}`)
    }
}
</script>

<style lang="sass" scoped>
@import "../css/colors"

#introduction
    font-size: 15px
    color: $color-text-light
    text-align: justify
    text-justify: inter-word
    margin: 10px min(5vw, 40px)

#profiles
    margin-top: 20px

// Profile picture alignment
.profile
    position: relative
    display: inline-block
    margin: 20px 20px 30px
    vertical-align: top

    .fade-enter-active, .fade-leave-active
        transition: all .25s ease !important

    .fade-enter, .fade-leave-to
        opacity: 0

    .front, .back
        border: 10px solid white
        outline: 2px solid $color-text-main
        height: 150px
        width: 150px
        transition: all .25s ease

    .back
        z-index: 2
        position: relative

    .front
        transform: rotate(10deg)
        position: absolute
        z-index: 4
        height: 150px
        top: 0
        left: 0

    // Hover animation
    .front:hover
        transform: rotate(2deg)

    .sub-text
        margin-top: 3px
        margin-left: 15px
        text-align: left
        position: relative
        z-index: 3

    .back.add
        outline: 2px dashed $color-text-main
        font-size: 75px
        color: gray
        background-color: #f1f1f1

    .bookmark
        border: 40px solid rgba(255, 189, 202, 0.49)
        //$border: pink
        //filter: drop-shadow(0 2px 0 $border) drop-shadow(2px 0 0 $border) drop-shadow(-2px 0 0 $border)
        border-bottom: 10px solid transparent
        // width:        100px
        width: 0
        left: 10px
        height: 10px

        position: absolute
        bottom: -15px
        z-index: 2

@media screen and (max-width: 440px)
    .profile
        .front, .back
            border: 5px solid white
            $len: 30vw
            height: $len
            width: $len
</style>
