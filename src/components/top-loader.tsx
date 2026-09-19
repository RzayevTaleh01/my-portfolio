"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Thin accent-coloured progress bar at the top of the page during navigation.
 * Starts on internal link clicks (and on `startRouteProgress()` before a
 * programmatic router.push), completes when the new pathname renders.
 */

const START_EVENT = "route-progress:start";

/** Call before `router.push(...)` so programmatic navigations show the bar too. */
export function startRouteProgress() {
  window.dispatchEvent(new Event(START_EVENT));
}

interface BarState {
  value: number;
  timer?: ReturnType<typeof setInterval>;
  hideTimer?: ReturnType<typeof setTimeout>;
}

function render(el: HTMLDivElement, value: number, visible: boolean) {
  el.style.transform = `scaleX(${value})`;
  el.style.opacity = visible ? "1" : "0";
}

function start(el: HTMLDivElement, s: BarState) {
  clearInterval(s.timer);
  clearTimeout(s.hideTimer);
  s.value = 0.08;
  el.style.transition = "none";
  render(el, s.value, true);
  // Force a reflow so the next transition starts from the reset position.
  void el.offsetWidth;
  el.style.transition = "transform 200ms ease-out, opacity 300ms ease";
  // Trickle towards 90% while the next page loads.
  s.timer = setInterval(() => {
    s.value += (0.9 - s.value) * 0.12;
    render(el, s.value, true);
  }, 180);
}

function done(el: HTMLDivElement, s: BarState) {
  if (!s.timer) return;
  clearInterval(s.timer);
  s.timer = undefined;
  render(el, 1, true);
  s.hideTimer = setTimeout(() => render(el, 1, false), 220);
}

function isInternalNavigation(event: MouseEvent): boolean {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const anchor = (event.target as Element | null)?.closest("a");
  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  // Same page (or only the #hash differs): no navigation to wait for.
  return url.pathname !== window.location.pathname || url.search !== window.location.search;
}

export function TopLoader() {
  const bar = useRef<HTMLDivElement>(null);
  const state = useRef<BarState>({ value: 0 });
  const pathname = usePathname();

  useEffect(() => {
    const onStart = () => bar.current && start(bar.current, state.current);
    const onClick = (e: MouseEvent) => isInternalNavigation(e) && onStart();
    document.addEventListener("click", onClick, true);
    window.addEventListener(START_EVENT, onStart);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(START_EVENT, onStart);
    };
  }, []);

  // The new route has rendered.
  useEffect(() => {
    if (bar.current) done(bar.current, state.current);
  }, [pathname]);

  return (
    <div
      ref={bar}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 origin-left bg-accent opacity-0"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
