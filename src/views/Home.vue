<template>
    <div id="home">
        <div id="introduction">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eu dignissim velit, condimentum commodo metus. Nullam libero massa, condimentum eget erat vel, lobortis tristique enim. Donec vestibulum orci a orci elementum pellentesque vel ut est. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse et eros magna. Suspendisse potenti. Mauris luctus risus eget magna eleifend ultrices. Quisque magna lorem, laoreet ut velit non, auctor pharetra ligula. Duis quis elit turpis. Nunc et odio dui. Nunc erat enim, placerat eu tellus non, dignissim semper arcu. Pellentesque feugiat metus ac magna dignissim placerat. Sed vitae rhoncus libero. Quisque pharetra consectetur nisi quis pulvinar. Sed quis fermentum justo. Nunc blandit vitae neque quis dictum.
        </div>

        <div id="profiles">
            <div class="profile" v-for="p in people" :key="p">
                <img :src="p.profileUrl" alt="profile" class="back">
                <img :src="p.profileUrl" alt="profile" class="front">
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
        {name: '不存在', profileUrl: 'https://pbs.twimg.com/profile_images/1374397593594122242/bPfn-Zzk_400x400.jpg'},
        {name: '蛍', profileUrl: 'https://pbs.twimg.com/profile_images/1378912446782394368/icyGMaK5_400x400.jpg'},
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

.profile
    img
        height: 150px
        border: 10px solid #ffffff
        outline: 2px solid #565656

    .front
        transform: rotate(10deg)

    .back
        margin-right: -170px

    display: inline-block
    margin: 0 20px


</style>
