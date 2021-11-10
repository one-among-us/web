<template>
    <div id="divider">
        <span class="color-strip" v-for="c in colors" :key="c"
              :style="`background-color: ${c}; height: ${height}`"/>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({components: {}})
export default class Divider extends Vue
{
    colors: string[] = [
        '#5BCEFA',
        '#F5A9B8',
        '#FFF',
        '#F5A9B8',
        '#5BCEFA'
    ]

    height = '2px'
}
</script>

<style lang="sass" scoped>
#divider
    display: flex

    .color-strip
        flex: 1
</style>
