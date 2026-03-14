import { useCallback, useState } from "react";
import { uid } from "../utils/uid";

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((message, type = "success") => {
    const id = uid();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);
  return { toasts, show };
}