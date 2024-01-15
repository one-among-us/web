<!-- Credit to https://github.com/bbonch/vue3-recaptcha2 -->
<!-- This component is modified for users in China Mainland -->
<template>
  <div ref="recaptchaDiv"></div>
</template>

<script setup lang="ts">
import {captchaSiteKey} from "@/logic/config";
import { ref, onMounted } from 'vue'

declare global {
  interface Window {
    grecaptcha: any,
    recaptchaReady: any
  }
}

const recaptchaDiv = ref(null)
let recaptcha: any = null

const props = defineProps({
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
  },
  loadingTimeout: {
    type: Number,
    required: false,
    default: 0
  }
})

const emit = defineEmits({
  verify: (response: string) => {

    return response != null && response != "";
  },
  error: (reason: any) => reason,
  expire: null,
  fail: null
})

defineExpose({
  execute: function () {
    window.grecaptcha.execute(recaptcha)
  },
  reset: function () {
    window.grecaptcha.reset(recaptcha);
  }
})

function renderRecaptcha() {
  recaptcha = window.grecaptcha.render(recaptchaDiv.value, {
    'sitekey': captchaSiteKey,
    'theme': props.theme,
    'size': props.size,
    'callback': (response: string) => {
      window.grecaptcha.reset(recaptcha);
      emit("verify", response)
    },
    'expired-callback': () => {
      window.grecaptcha.reset(recaptcha);
      emit("expire")
    },
    'error-callback': () => {
      window.grecaptcha.reset(recaptcha);
      emit("fail")
    }
  })
}

onMounted(() => {
  if (window.grecaptcha == null) {
    new Promise<void>((resolve, reject) => {
      let loadingCountdown: ReturnType<typeof setTimeout>;
      let responded = false;

      window.recaptchaReady = function () {
        if (responded) return;
        responded = true;
        clearTimeout(loadingCountdown);
        resolve();
      };

      const scriptId = "recaptcha-script";
      const loadingFailed = (reason: string) => {
        return () => {
          if (responded) return;
          responded = true;
          clearTimeout(loadingCountdown);
          document.getElementById(scriptId)?.remove();
          reject(reason);
        }
      };

      if (props.loadingTimeout > 0) loadingCountdown = setTimeout(loadingFailed("timeout"), props.loadingTimeout);

      const doc = window.document;
      const scriptTag = doc.createElement("script");
      scriptTag.id = scriptId;
      scriptTag.onerror = loadingFailed("error");
      scriptTag.onabort = loadingFailed("aborted");
      scriptTag.setAttribute("src", `https://www.recaptcha.net/recaptcha/api.js?onload=recaptchaReady&render=explicit&hl=${props.hl}&_=${+new Date()}`);
      doc.head.appendChild(scriptTag);
    }).then(() => {
      renderRecaptcha();
    }).catch((err) => {
      emit("error", err.toString());
    });
  }
  else {
    renderRecaptcha();
  }
})
</script>

<style lang="sass">
#recaptcha div
    margin: auto
</style>
