<!-- This component credit to Vuesax (https://vuesax.com/docs/components/Input.html#label)
    I had to recreate (or copy) this component from Vuesax because, as of now (Mar 10, 2020),
    Vuesax does not support Vue 3, which I'm currently using.
 -->

<template>
    <div class="hy-input-container">
        <div class="hy-input">
            <input id="hy-input-inner" class="hy-input-inner tr" :value="modelValue"
                   @input="passInput($event.target.value)" v-bind="$attrs"/>
            <div class="hy-input-placeholder tr" :class="modelValue ? 'has-text' : ''">
                <label for="hy-input-inner">{{ placeholder }}</label>
            </div>
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
.tr
    transition: all .25s ease

.hy-input
    position: relative

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
input:focus~.hy-input-placeholder, .has-text
    left: 21px
    opacity: .8
    visibility: visible
    pointer-events: auto
    transform: translate(-10px,-70%)
    font-size: .75rem

.hy-input-placeholder.has-text
    transform: translate(-10px,-80%)

</style>
