
<script lang="tsx">
import * as Vue from 'vue';
import { computed, defineComponent } from 'vue';
import PhotoScroll from './PhotoScroll.vue';
import ChannelBackupButton from "@/components/ChannelBackupButton.vue";
import BackupButtons from "@/components/BackupButtons.vue";

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
                            PhotoScroll, ChannelBackupButton, BackupButtons
                        }
                    })
                }
            </div>
        );
    }
})
</script>
