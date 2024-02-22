// get all existing components
import { getServerSession } from "#auth";
export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session) {
    return { status: "unauthenticated" };
  }

  try {
    const blueprints = await useStorage().getKeys("blueprints:components");
    return {
      status: "ok",
      body: blueprints,
    };
  } catch (error) {
    console.log(error);
  }
});
