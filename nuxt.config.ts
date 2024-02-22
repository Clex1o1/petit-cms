// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // modules: ["@nuxt/content", "@formkit/nuxt", "@sidebase/nuxt-auth"],
  modules: [
    "@nuxt/content",
    "@formkit/nuxt",
    "@sidebase/nuxt-auth",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
  ],
  pages: true,
  components: {
    dirs: ["~/components"],
    global: true,
  },

  nitro: {
    storage: {
      blueprints: {
        driver: "fs",
        base: "./blueprints",
      },
      content: {
        driver: "fs",
        base: "./content",
      },
    },
  },
  //   auth: { origin: "http://localhost:3000" },
});
