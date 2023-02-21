export default defineEventHandler((event) => {
  console.log(event);
  return { user: { id: 1, name: "J Smith", email: "" } };
});
