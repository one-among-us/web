<template>
    <div class="four-oh-four unselectable">
        <div class="title">404</div>
        <div class="sub">这个页面不见了</div>
        <div class="click"><a href="javascript:history.back()">返回</a></div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({components: {}})
export default class FourOhFour extends Vue
{
}
</script>

<style lang="sass" scoped>
</style>
