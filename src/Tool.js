import React, { useCallback } from "react";
import { useGlobals } from "@storybook/api";
import { Icons, IconButton } from "@storybook/components";
import { TOOL_ID } from "./constants";
export const Tool = () => {
  const [{ fontInspectActive }, updateGlobals] = useGlobals();
  const toggleFontInspect = useCallback(
    () =>
      updateGlobals({
        fontInspectActive: !fontInspectActive,
      }),
    [fontInspectActive]
  );
  return (
    <IconButton
      key={TOOL_ID}
      active={fontInspectActive}
      title="Inspect Font"
      onClick={toggleFontInspect}
    >
      <Icons icon="location" />
    </IconButton>
  );
};
