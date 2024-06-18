import { useMemo, useState, useRef, useCallback, useEffect } from "react";

/* 触发微任务 */
export function useMutationObserver(cb: MutationCallback) {
  const ref = useRef(0);
  const [node] = useMemo(() => {
    const observer = new MutationObserver(cb);
    const node = document.createTextNode("");
    observer.observe(node, { characterData: true });
    return [node];
  }, []);

  return useCallback(() => {
    const iterations = ref.current;
    node.data = `${iterations % 2}`;
    ref.current++;
  }, [node]);
}

export function useAsyncState(cb: () => Promise<any> | (() => any)) {
  const [state, setState] = useState(null);

  useEffect(() => {
    async function asyncFn() {
      const res = await cb();
      setState(res);
    }
    asyncFn();
  }, []);

  return [state, setState];
}
