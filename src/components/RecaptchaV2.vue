<!-- Credit to https://github.com/bbonch/vue3-recaptcha2 -->
<!-- This component is modified for users in China Mainland -->
<template>
    <div ref="recaptcha" id="recaptcha"></div>
</template>

<script>
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default {
    name: "RecaptchaV2",
    data() {
        return {
            recaptcha: null
        }
    },
    props: {
        siteKey: {
            type: String,
            required: true
        },
        size: {
            type: String,
            required: false,
            default: "normal"
        },
        theme: {
            type: String,
            required: false,
            default: "light"
        },
        hl: {
            type: String,
            required: false
        }
    },
    emits: {
        verify: (response) => {
            return !!response;
        },
        expire: null,
        fail: null
    },
    methods: {
        renderRecaptcha() {
            // eslint-disable-next-line no-undef
            this.recaptcha = grecaptcha.render(this.$refs.recaptcha, {
                'sitekey': this.siteKey,
                'theme': this.theme,
                'size': this.size,
                'callback': (response) => this.$emit("verify", response),
                'expired-callback': () => this.$emit("expire"),
                'error-callback': () => this.$emit("fail")
            });
        },
        execute() {
            // eslint-disable-next-line no-undef
            grecaptcha.execute(this.recaptcha);
        },
        reset() {
            // eslint-disable-next-line no-undef
            grecaptcha.reset(this.recaptcha);
        }
    },
    mounted() {
        if (window.grecaptcha == null) {
            new Promise((resolve) => {
                window.recaptchaReady = function () {
                    resolve();
                };
                const doc = window.document;
                const scriptId = "recaptcha-script";
                const scriptTag = doc.createElement("script");
                scriptTag.id = scriptId;
                scriptTag.setAttribute("src", `https://www.recaptcha.net/recaptcha/api.js?onload=recaptchaReady&render=explicit&hl=${this.hl}`);
                doc.head.appendChild(scriptTag);
            }).then(() => {
                this.renderRecaptcha();
            });
        }
        else {
            this.renderRecaptcha();
        }
    }
}
</script>

<style lang="sass">
#recaptcha div
    margin: auto
</style>
