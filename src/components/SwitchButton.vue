<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
        <g
            fill="none"
            stroke="rgba(166, 134, 89, 0.84)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
        >
            <path d="m18 2l3 3l-3 3M6 22l-3-3l3-3" />
            <path d="M21 5H10a7 7 0 0 0-7 7m0 7h11a7 7 0 0 0 7-7" />
        </g>
    </svg>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';

@Component({ components: {} })
export default class SwitchButton extends Vue {}
</script>

<style lang="scss"></style>
