<template>
    <div id="divider">
        <span class="color-strip" v-for="c in colors" :key="c"
              :style="`background-color: ${c}; height: ${height}`"/>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";

const transColors = [
    '#5BCEFA',
    '#F5A9B8',
    '#FFF',
    '#F5A9B8',
    '#5BCEFA'
]

@Options({components: {}})
export default class Divider extends Vue
{
    @Prop({default: transColors}) colors!: string[]
    @Prop({default: '2px'})       height!: string
}
</script>

<style lang="sass" scoped>
#divider
    display: flex

    .color-strip
        flex: 1
</style>
