<script lang="ts">
import ProfileFolder from "@/components/ProfileFolder.vue";
import {replaceUrlVars} from "@/logic/config";
import {PersonMeta} from "@/logic/data";
import {Component, Prop, Vue} from 'vue-facing-decorator';

@Component({ components: { ProfileFolder } })
export default class ProfileBookmark extends Vue {
    @Prop({ required: true }) list: PersonMeta[]
    @Prop({ required: true }) name: string

    source = [] as string[]
    showFolder = false;

    mounted() {
        if (!this.list.length) return;
        if (this.list.length >= 4) {
            for (let i = 0; i < 4; ++i) {
                this.source.push(this.profileUrl(this.list[i]));
            }
        }
        else {
            for (const o of this.list) {
                this.source.push(this.profileUrl(o));
            }
        }
    }

    profileUrl(p: PersonMeta): string {
        return replaceUrlVars(p.profileUrl, p.id)
    }
}
</script>

<template>
    <div class="profile">
        <div class="back"/>
        <div class="img-list front clickable" v-on:click="showFolder = true">
            <img v-for="i of source" :key="i" :src="i" :alt="i"/>
        </div>
        <div class="name font-custom" ref="bookmarkTexts">{{ name }}</div>
        <div class="bookmark" ref="bookmark"/>
    </div>
    <ProfileFolder :name="name" :people="list" v-if="showFolder" />
</template>

<style lang="scss">
@import "@/css/colors";
@import "@/css/motion";
@import "@/css/global";

.profile {
    position: relative;
    display: inline-block;
    margin: 20px 20px 30px;
    vertical-align: top;
    text-align: left;

    .front, .back {
        border: 10px solid white;
        outline: 2px solid $color-text-main;
        height: 150px;
        width: 150px;
        transition: all .25s $ease-out-cric;
    }

    .back {
        z-index: 2;
        position: relative;
    }

    .front {
        transform: rotate(10deg);
        position: absolute;
        z-index: 4;
        height: 150px;
        top: 0;
        left: 0;

        background-blend-mode: screen;
        background-color: #ffffff;

        &:hover {
            transform: rotate(2deg);
        }
    }

    .name {
        margin-top: 3px;
        margin-left: 15px;
        text-align: left;
        position: relative;
        z-index: 3;
        display: inline-flex;
        align-items: center;
        font-weight: bold;
    }

    .bookmark {
        border: 40px solid rgba(255, 189, 202, .49);
        border-bottom: 10px solid transparent;

        width: 0;
        left: 10px;
        height: 10px;

        position: absolute;
        bottom: -15px;
        z-index: 2;
    }

    .img-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        padding: 2px;
        gap: 8px;
        flex-direction: row-reverse;

        img {
            flex: 1;
            width: 70px;
            height: 70px;
            border-radius: 10px;
            object-fit: cover;
        }
    }
}

@media screen and (max-width: 440px) {
    .profile {
        .front, .back {
            border: 5px solid white;
            height: 30vw;
            width: 30vw;
        }
    }
}

[data-theme="dark"] {
    .back, .front {
        border: 10px solid rgba(27, 27, 32, .8964) !important;
        outline: 2px solid $color-text-dark-main !important;
    }

    .front {
        background-blend-mode: screen;
        background-color: rgba(27, 27, 32, 0.95) !important;
    }

    .bookmark {
        border: 40px solid rgba(255, 189, 202, 0.25) !important;
        border-bottom: 10px solid transparent !important;
    }
}
</style>