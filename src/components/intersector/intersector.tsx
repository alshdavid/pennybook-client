import { h } from "preact";
import type { HTMLAttributes } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { classNames } from "../../platform/preact/class-names.ts";

export type IntersectorProps = HTMLAttributes<HTMLDivElement> & {
  onEnter?: () => any | Promise<any>;
  onExit?: () => any | Promise<any>;
  rootMargin?: string;
  threshold?: number | number[];
  root?: Element | Document | null;
};

/**
 * @description this component will emit an event when it's revealed.
 * This is used to detect proximity to the bottom of the page, it's
 * more performant to use than polling onscroll events
 */
export function Intersector({
  onEnter,
  onExit,
  rootMargin,
  threshold,
  root,
  className,
  children,
  ...props
}: IntersectorProps) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const windowRef = globalThis.window;

  useEffect(() => {
    if (containerRef.current) {
      setIsVisible(checkVisible(windowRef, containerRef.current));
    }
  }, [
    containerRef,
    onEnter,
    onExit,
    children,
    rootMargin,
    threshold,
    root,
    className,
  ]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new (windowRef as any).IntersectionObserver(
      (e: IntersectionObserverEntry[]) => {
        if (e[0].isIntersecting) {
          setIsVisible(true);
          if (onEnter) onEnter();
        } else {
          setIsVisible(false);
          if (onExit) onExit();
        }
      },
      {
        root,
        rootMargin,
        threshold,
      },
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [containerRef, rootMargin, threshold, root]);

  return (
    <div
      {...props}
      ref={containerRef}
      className={classNames("component-intersector", className)}
    >
      {children && isVisible && children}
    </div>
  );
}

function checkVisible(windowRef: Window, elm: HTMLDivElement) {
  var rect = elm.getBoundingClientRect();
  const clientHeight = windowRef.document.documentElement.clientHeight;
  const innerHeight = windowRef.screen.height;
  var viewHeight = Math.max(clientHeight, innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}
