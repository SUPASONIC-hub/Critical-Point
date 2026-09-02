import { useCallback, useLayoutEffect, useRef } from "react";

export function useStableEvent(handler) {
  const handlerRef = useRef(handler);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args) => handlerRef.current(...args), []);
}
