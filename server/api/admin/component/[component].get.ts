// get a specific component
import { getServerSession } from "#auth";
export default defineEventHandler(async (event) => {
  const component = event.context?.params?.component;
  if (!component) {
    return { status: "not found" };
  }
  const session = await getServerSession(event);
  if (!session) {
    return { status: "unauthenticated" };
  }

  try {
    const blueprints = await useStorage().getItem(
      `blueprints:components:${decodeURI(component)}.json`
    );
    return {
      status: "ok",
      body: blueprints,
    };
  } catch (error) {
    console.log(error);
  }
});
