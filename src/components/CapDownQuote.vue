<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';

@Component({})
export default class CapDownQuote extends Vue {
    @Prop({ required: true }) messages: string[][]
}
</script>

<template>
    <div class="cd">
        <p v-for="v of messages" :key="v[0]">
            <span v-for="p of v" :key="p" v-html="p" />
        </p>
    </div>
</template>

<style lang="scss">
@use 'sass:math';
@use "@/css/fonts/font-custom";

.cd {
    margin: 1rem auto;
    line-height: 1.2;

    text-wrap: stable;

    p:first-child {
        &:before {
            float: left;
            font-size: 15rem;
            line-height: 1;
            font-weight: bold;
            margin-right: 9px;
            content: '“';
            height: 5rem;
            overflow: hidden;
        }
    }

    p:nth-child(2n) {
        span:first-child {
            margin-left: 2rem;
        }
    }

    p:nth-child(3n) {
        span:first-child {
            margin-left: 3rem;
        }
    }

    p {
        line-height: 1.2;

        span:first-child {
            margin-left: 0;
        }

        span {
            margin-left: 2rem;
        }
    }

    @media screen and (max-width: 720px) {
        p:nth-child(2n) {
            span:first-child {
                margin-left: 0;
            }
        }

        p:nth-child(3n) {
            span:first-child {
                margin-left: 0;
            }
        }

        p {
            line-height: 1.2;

            span:first-child {
                margin-left: 0;
            }

            span {
                margin-left: 2rem;
            }
        }
    }
}
</style>