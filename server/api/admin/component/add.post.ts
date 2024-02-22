// add or update a spefic component
import { getServerSession } from "#auth";
export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session) {
    return { status: "unauthenticated" };
  }
  const payload = await readBody(event);

  try {
    const blueprints = await useStorage().setItem(
      `blueprints:components:${encodeURI(payload.name)}.json`,
      JSON.stringify(payload)
    );
    return {
      status: "ok",
      body: blueprints,
    };
  } catch (error) {
    console.log(error);
  }
});
