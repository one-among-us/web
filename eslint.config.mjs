import { createRequire } from 'node:module'
import pluginVue from 'eslint-plugin-vue'
import { configureVueProject, defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

const require = createRequire(import.meta.url)
const autoImportGlobals = require('./.eslintrc-auto-import.json')
const autoImport = autoImportGlobals?.globals ?? {}

configureVueProject({
  scriptLangs: ['ts', 'tsx'],
})

export default defineConfigWithVueTs(
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: autoImport,
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'vue/require-v-for-key': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
