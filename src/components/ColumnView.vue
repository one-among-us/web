<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';

@Component({})
export default class ColumnView extends Vue {

}
</script>

<template>
    <div class="column-view">
        <slot></slot>
    </div>
</template>

<style lang="scss">
.column-view {
    display: block;
    column-count: 2;
    column-gap: 20px;

    @media screen and (max-width: 800px) {
        column-count: 1;
    }
}
</style>