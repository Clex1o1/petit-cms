import { getServerSession } from "#auth";
export default defineEventHandler(async (event) => {
  console.log(event);
  const session = await getServerSession(event);
  if (!session) {
    return { status: "unauthenticated" };
  }

  try {
    const blueprints = await useStorage().getKeys("blueprints");
    return {
      status: "ok",
      body: { blueprints },
    };
  } catch (error) {
    console.log(error);
  }
});
