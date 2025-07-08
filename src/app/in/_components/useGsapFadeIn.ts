import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * useGsapFadeIn - Animate fade-in and upward motion for a container and its children.
 * - Animates the container itself and then staggers its direct children for a more lively effect.
 * @param delay - Delay before animation starts (in seconds)
 */
export function useGsapFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, delay, ease: "power2.out" }
      );
      gsap.fromTo(
        ref.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: delay + 0.2,
          stagger: 0.12,
          ease: "power2.out",
        }
      );
    }
  }, [delay]);
  return ref;
}
