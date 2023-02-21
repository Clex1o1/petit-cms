// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // modules: ["@nuxt/content", "@formkit/nuxt", "@sidebase/nuxt-auth"],
  modules: ["@nuxt/content", "@formkit/nuxt", "@sidebase/nuxt-auth"],
  pages: true,
  nitro: {
    storage: {
      blueprints: {
        driver: "fs",
        base: "./blueprints",
      },
    },
  },
  //   auth: { origin: "http://localhost:3000" },
});
