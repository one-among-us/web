<script lang="tsx">
import BackupButtons from "@/components/buttons/BackupButtons.vue";
import Banner from "@/components/Banner.vue";
import CapDownQuote from "@/components/CapDownQuote.vue";
import ChannelBackupButton from "@/components/buttons/ChannelBackupButton.vue";
import DynamicIcon from "@/components/DynamicIcon.vue";
import * as Vue from 'vue';
import {computed, defineComponent} from 'vue';
import PhotoScroll from './PhotoScroll.vue';
import BlurBlock from "./BlurBlock.vue";

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
            <div class="markdown-content" style={props.margins ? { margin: '10px min(4vw, 40px)' } : {}}>
                {
                    renderFunction.value?.({
                        components: {
                            PhotoScroll, ChannelBackupButton, CapDownQuote, BackupButtons, DynamicIcon, Banner, BlurBlock
                        }
                    })
                }
            </div>
        );
    }
})
</script>
