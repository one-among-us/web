<template>
    <div id="Profile">
        {{p.name}}
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import {exampleData, Person} from "@/logic/data";

@Options({components: {}})
export default class Profile extends Vue
{
    @Prop() name!: string

    p?: Person
    created()
    {
        // TODO: Get data from server
        this.p = exampleData.filter(it => it.name == this.name)[0]
    }
}
</script>

<style lang="sass" scoped>

</style>
