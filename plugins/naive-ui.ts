import { setup } from '@css-render/vue3-ssr'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) {
    const { collect } = setup(nuxtApp.vueApp)
    const originalRenderToString = renderToString
    renderToString = async (input, context) => {
      const html = await originalRenderToString(input, context)
      return `<style csr-id="naive-ui">${collect()}</style>${html}`
    }
  }
})
