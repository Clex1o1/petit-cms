import { getServerSession } from "#auth";
export default defineEventHandler(async (event) => {
  const struct = event.context?.params?.struct;

  const session = await getServerSession(event);
  if (!session) {
    return { status: "unauthenticated" };
  }

  try {
    const blueprints = await useStorage().getItem(`blueprints:${struct}.json`);
    return {
      status: "ok",
      body: blueprints,
    };
  } catch (error) {
    console.log(error);
  }
});
