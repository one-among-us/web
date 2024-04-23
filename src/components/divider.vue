<template>
    <div id="divider">
        <span class="color-strip" v-for="c in colors" :key="c"
              :style="`background-color: ${c}; height: ${height}`"
              v-on:click="switchEasterEgg()"/>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { transColors } from "@/logic/constants";
import Swal from 'sweetalert2';
import { i18n } from '@/logic/config';
import { getLang } from '@/logic/config';

@Component({components: {}})
export default class Divider extends Vue
{
    @Prop({default: transColors}) colors!: string[]
    @Prop({default: '2px'})       height!: string

    i18n = i18n[getLang()]

    switchEasterEgg() {
        if (!localStorage.getItem("easterEggMode")) 
            localStorage.setItem("easterEggMode", "1")
        else 
            localStorage.setItem("easterEggMode", (parseInt(localStorage.getItem("easterEggMode")) == 0) ? "1" : "0")

        Swal.fire({
            position: "top-end",
            toast: true,
            title: this.i18n.easter_egg.title + ((parseInt(localStorage.getItem("easterEggMode")) == 0) ? this.i18n.easter_egg.disabled : this.i18n.easter_egg.enabled),
            timer: 5000,
            showConfirmButton: false,
            showCancelButton: false,
            timerProgressBar: true,
            iconHtml: `<img style="width: 64px;height: 64px;border: none" src="/img/easterEgg.png"></img>`,
            iconColor: "#00000000"
        })
    }
}
</script>

<style lang="sass" scoped>
#divider
    display: flex

    .color-strip
        flex: 1
</style>
