
<script lang="tsx">
import * as Vue from 'vue';
import { computed, defineComponent } from 'vue';
import PhotoScroll from './PhotoScroll.vue';

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
            const exports: any = {};
            module(exports, Vue);
            return exports.default;
        });

        return () => (
            <div class="markdown-content" style={props.margins ? {margin: '10px min(4vw, 40px)'} : {}}>
                {
                    renderFunction.value?.({
                        components: {
                            PhotoScroll
                        }
                    })
                }
            </div>
        );
    }
})
</script>

<style lang="sass">
@import "../css/colors"

// Markdown style
.markdown-content
    text-align: justify
    text-justify: inter-word

    a
        color: $color-text-special
        text-decoration: none

    h1, h2
        border-bottom: 1px solid $color-text-special
        font-size: 1.5em
        margin-top: 1em

    h1, h2
        line-height: 1.3
        margin-bottom: 0.25em
        padding: 0

    p
        font-size: 0.875em
        margin: 0.5em 0
        line-height: 1.6

    li
        font-size: 0.875em
</style>
