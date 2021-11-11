<template>
    <div id="home">
        <div id="introduction">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eu dignissim velit, condimentum commodo metus. Nullam libero massa, condimentum eget erat vel, lobortis tristique enim. Donec vestibulum orci a orci elementum pellentesque vel ut est. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse et eros magna. Suspendisse potenti. Mauris luctus risus eget magna eleifend ultrices. Quisque magna lorem, laoreet ut velit non, auctor pharetra ligula. Duis quis elit turpis. Nunc et odio dui. Nunc erat enim, placerat eu tellus non, dignissim semper arcu. Pellentesque feugiat metus ac magna dignissim placerat. Sed vitae rhoncus libero. Quisque pharetra consectetur nisi quis pulvinar. Sed quis fermentum justo. Nunc blandit vitae neque quis dictum.
        </div>

        <div id="profiles">
            <div class="profile" v-for="p in people" :key="p">
                <div class="back"></div>
                <img :src="p.profileUrl" alt="profile" class="front">
                <div class="sub-text">{{p.name}}</div>
                <div class="bookmark"></div>
            </div>
            <div class="profile">
                <div class="back add fbox-vcenter">+</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({components: {}})
export default class Home extends Vue
{
    people = [
        // {name: '小桂桂', profileUrl: 'https://pbs.twimg.com/profile_images/1445198854429810690/TzeMf5yX_400x400.jpg'},
        {name: '椎名もた', profileUrl: 'https://pbs.twimg.com/profile_images/591631266937638913/AtOAlQpd_400x400.jpg'},
        {name: '不存在', profileUrl: 'https://pbs.twimg.com/profile_images/1374397593594122242/bPfn-Zzk_400x400.jpg'},
        {name: '萤', profileUrl: 'https://pbs.twimg.com/profile_images/1378912446782394368/icyGMaK5_400x400.jpg'},
    ]
}
</script>

<style lang="sass" scoped>
#introduction
    font-size: 15px
    color: #7c7c7c
    text-align: justify
    text-justify: inter-word
    margin: 10px 50px

#profiles
    margin-top: 20px

// Profile picture alignment
.profile
    position: relative
    display: inline-block
    margin: 20px 20px 30px
    vertical-align: top

    .front, .back
        border: 10px solid #ffffff
        outline: 2px solid #565656
        height: 150px
        width: 150px

    .back
        z-index: 2
        position: relative

    .front
        transition: all .25s ease
        transform: rotate(10deg)
        position: absolute
        z-index: 3
        height: 150px
        top: 0
        left: 0

    .front:hover
        transform: rotate(2deg)

    .sub-text
        margin-top: 3px
        margin-left: 15px
        text-align: left
        position: relative
        z-index: 3

        font-family: FZSJ-QIANNYDH, Avenir, Helvetica, Arial, sans-serif

    .back.add
        outline: 2px dashed #565656
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
</style>
