import { defineRpc } from "@getpaseo/plugin";
import { z } from "zod";

export const artifactSetLocale = defineRpc({
  name: "artifact.set_locale",
  input: z.object({ locale: z.string().trim().min(1).max(128) }),
  output: z.object({ locale: z.enum(["en", "ko"]) }),
});
