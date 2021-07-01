import { RefObject, useEffect } from "react";


/**
 * Hook that alerts clicks outside of the passed ref
 * https://stackoverflow.com/a/42234988
 */

export default function useOutsideAlerter(
  ref: RefObject<HTMLDivElement>,
  action: () => void
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
          action();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, action]);
}