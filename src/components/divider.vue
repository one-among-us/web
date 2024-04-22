<template>
    <div id="divider">
        <span class="color-strip" v-for="c in colors" :key="c"
              :style="`background-color: ${c}; height: ${height}`"/>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { transColors } from "@/logic/constants";

@Component({components: {}})
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
