import { useEffect, useGlobals } from "@storybook/addons";
import { useRef } from "react";
import { DebugPanel } from "./side-effects";
export const withGlobals = (StoryFn, context) => {
  const [{ fontInspectActive }] = useGlobals(); // Is the addon being used in the docs panel

  const rootRef = useRef(null);

  useEffect(function mountEffect() {
    rootRef.current = document.getElementById("root");
    return () => (rootRef.current = null);
  }, []);

  useEffect(
    function attachMouseMoveListener() {
      const dbgPanel = DebugPanel();
      if (fontInspectActive) {
        dbgPanel.attachPanel();
      } else {
        dbgPanel.detachPanel();
      }
      return () => {
        dbgPanel.detachPanel();
      };
    },
    [fontInspectActive]
  );

  return StoryFn();
};
