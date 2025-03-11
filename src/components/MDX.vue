<script lang="tsx">
import Banner from "@/components/Banner.vue";
import BackupButtons from "@/components/buttons/BackupButtons.vue";
import ChannelBackupButton from "@/components/buttons/ChannelBackupButton.vue";
import CapDownQuote from "@/components/CapDownQuote.vue";
import ColumnView from "@/components/ColumnView.vue";
import DynamicIcon from "@/components/DynamicIcon.vue";
import DottedNumber from "@/components/DottedNumber.vue";
import Sakura from "@/components/Sakura.vue";
import * as Vue from 'vue';
import {computed, defineComponent} from 'vue';
import BlurBlock from "./BlurBlock.vue";
import Hexagon from "./Hexagon.vue";
import PhotoScroll from './PhotoScroll.vue';
import TextRainbow from "./TextRainbow.vue";
import TextRing from "./TextRing.vue";

export default defineComponent({
    name: "MDX",
    props: {
        code: {
            type: String,
            required: true
        },
        margins: {
            type: Boolean,
            required: false
        }
    },
    setup(props) {
        const renderFunction = computed(() => {
            if (!props.code) return null;

            const module = new Function("exports", "Vue", props.code);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const exports: any = {};
            module(exports, Vue);
            return exports.default;
        });

        return () => (
            <div class="markdown-content" style={props.margins ? {margin: '10px min(4vw, 40px)'} : {}}>

                {
                    renderFunction.value?.({
                        components: {
                            BackupButtons,
                            Banner,
                            BlurBlock,
                            ChannelBackupButton,
                            CapDownQuote,
                            ColumnView,
                            DottedNumber,
                            DynamicIcon,
                            Hexagon,
                            PhotoScroll,
                            Sakura,
                            TextRainbow,
                            TextRing
                        }
                    })
                }
            </div>
        );
    }
})
</script>
