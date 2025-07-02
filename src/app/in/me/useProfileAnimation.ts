// GSAP and Framer Motion animation setup for Next.js
import { useEffect } from "react";
import gsap from "gsap";

export function useGsapProfileAnimation(ref: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, [ref]);
}

// Framer Motion variants for profile card
export const profileCardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};
