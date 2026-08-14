import { useEffect, useLayoutEffect, useRef } from "react";

const SESSION_KEY = "outlfy-preloader-shown";

// useLayoutEffect warns when it runs during SSR; fall back to useEffect
// there since this only ever needs to run in the browser.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const Preloader = () => {
  const preloaderSection = useRef();

  // Runs before paint so the overlay never has a chance to render (and
  // block clicks) on client-side navigations after the first page load —
  // RootLayout is instantiated per-page, so this component remounts on
  // every route change, not just the initial visit.
  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const preloader = preloaderSection.current;
    if (!preloader) return;

    if (window.sessionStorage.getItem(SESSION_KEY)) {
      preloader.style.display = "none";
      return;
    }

    const timer = setTimeout(() => {
      preloader.style.display = "none";
      window.sessionStorage.setItem(SESSION_KEY, "true");
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="preloader" ref={preloaderSection}>
        <div className="loading">
          <div className="bar bar1"></div>
          <div className="bar bar2"></div>
          <div className="bar bar3"></div>
          <div className="bar bar4"></div>
          <div className="bar bar5"></div>
          <div className="bar bar6"></div>
          <div className="bar bar7"></div>
          <div className="bar bar8"></div>
        </div>
      </div>
    </>
  );
};

export default Preloader;
