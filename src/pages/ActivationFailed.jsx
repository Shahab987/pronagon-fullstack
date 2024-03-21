import React from "react";
import { useLocation } from "react-router-dom";

function ActivationFailed() {
  const location = useLocation();
  const searchParams = Object.fromEntries(
    new URLSearchParams(location?.search)
  );

  return (
    <div>
      <p>Activation failed due to following error: </p>
      <p className="font-bold text-red-800">{searchParams.message}</p>
      <p>Another link will be sent to your Email...</p>
    </div>
  );
}

export default ActivationFailed;
