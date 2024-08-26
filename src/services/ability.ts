import { defineAbility } from "@casl/ability";

export default defineAbility((can, cannot) => {
  can("read", "all");
  cannot("read", "all", { private: true }).because(
    "You are not allowed to read private information"
  );
});
