export function getName(struct: string | undefined) {
  if (struct)
    return {
      name: struct.split(":").pop()?.split(".")[0],
    };
}
