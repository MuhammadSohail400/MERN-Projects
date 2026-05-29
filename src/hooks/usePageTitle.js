import { useEffect } from "react";

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} — NexusHR`;

    // ── Cleanup — component hatne pe reset
    return () => {
      document.title = "NexusHR";
    };
  }, [title]); // title change hone pe update
}