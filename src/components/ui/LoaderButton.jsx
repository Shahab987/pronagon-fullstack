import React from "react";
import { dotPulse } from "ldrs";

dotPulse.register();

function LoaderButton({ loading, style, text, type }) {
  return (
    <button disabled={loading} className={style} type={type}>
      {loading ? (
        <l-dot-pulse size="40" speed="1.3" color="#ffffff"></l-dot-pulse>
      ) : (
        text
      )}
    </button>
  );
}

export default LoaderButton;
