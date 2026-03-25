/** Client-side toast dispatcher registered by ToastProvider. */

let dispatch = null;

export function registerToastDispatch(fn) {
  dispatch = fn;
  return () => {
    dispatch = null;
  };
}

/**
 * @param {{ variant?: "success" | "error" | "info"; message: string }} p
 */
export function toast({ variant = "info", message }) {
  if (typeof dispatch === "function") {
    dispatch({ variant, message });
  }
}
