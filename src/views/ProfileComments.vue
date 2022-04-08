<template>
    <div id="ProfileComments" class="markdown-content">
        <h1>留言</h1>

        <div id="comments" v-if="p.comments.length > 0">
            <p class="comment" v-for="c in p.comments" :key="c">
                <span class="content">{{c.content + (c.content.endsWith('。') ? '' : '。')}}</span>
                <span class="from">——{{c.submitter}}</span>
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import {Person} from "@/logic/data";

@Options({components: {}})
export default class ProfileComments extends Vue
{
    @Prop() p: Person
}
</script>

<style lang="sass" scoped>

</style>
