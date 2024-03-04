import { useEffect, useRef } from "react";

const useEffectAfterMount = (effect, dependencies) => {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) {
      // Run the effect only when dependencies change
      return effect();
    } else {
      // Set the mounted flag to true after the first render
      mounted.current = true;
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useEffectAfterMount;
