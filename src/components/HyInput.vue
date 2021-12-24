<!-- This component credit to Vuesax (https://vuesax.com/docs/components/Input.html#label)
    I had to recreate (or copy) this component from Vuesax because, as of now (Mar 10, 2020),
    Vuesax does not support Vue 3, which I'm currently using.
 -->

<template>
    <div class="hy-input" :class="modelValue ? 'has-text' : ''">
        <input id="hy-input-inner" class="hy-input-inner" :value="modelValue"
               @input="passInput($event.target.value)" v-bind="$attrs"
               autocomplete="off"/>
        <div class="hy-input-placeholder">
            <label for="hy-input-inner">{{ placeholder }}</label>
        </div>
    </div>
</template>

<script>
export default {
    name: "HyInput",
    props: {
        modelValue: String,
        placeholder: String
    },
    emits: [
        'update:modelValue',
        'input'
    ],
    methods: {
        passInput(value) {
            this.$emit('update:modelValue', value)
            this.$emit('input', value)
        }
    },
}
</script>

<style lang="sass" scoped>
*
    transition: all .25s ease

.hy-input
    position: relative

.hy-input.has-text, .hy-input:focus-within
    margin-top: 20px

input
    transition: all .25s ease

    border: none
    background-color: #edf1f2
    border-radius: 15px
    padding: 0 15px

    height: 36px
    line-height: 36px

    // From ElementUI
    box-sizing: border-box
    color: #606266
    display: inline-block
    outline: 0
    width: 100%

input:focus
    padding-left: 20px

    .hy-input-placeholder
        background-color: red

// Placeholder (From Vuesax)
.hy-input-placeholder

    // Fill the entire input box
    position: absolute
    top: 0
    left: 15px
    width: 100%
    height: 100%

    // Vertical center
    display: flex
    align-items: center
    justify-content: flex-start

    // Not selectable
    user-select: none
    pointer-events: none

    font-size: .8rem
    opacity: .4
    text-align: left

// Placeholder move up when input is focused (From Vuesax)
input:focus~.hy-input-placeholder, .has-text .hy-input-placeholder
    left: 21px
    opacity: .8
    visibility: visible
    pointer-events: auto
    transform: translate(-10px,-70%)
    font-size: .75rem

.has-text .hy-input-placeholder
    transform: translate(-10px,-80%)

</style>
