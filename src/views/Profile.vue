<template>
    <div id="Profile">
        {{name}}
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";

@Options({components: {}})
export default class Profile extends Vue
{
    @Prop() name!: string
}
</script>

<style lang="sass" scoped>

</style>
