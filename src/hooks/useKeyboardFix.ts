import { useIsMobile } from "./use-mobile";

export function useMobileKeybard() {
  const isMobile = useIsMobile();

  function handleMobileKeybard(
    e: React.TouchEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    if (!isMobile) return;
    setTimeout(() => {
      if (e.target) {
        (e.target as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 200);
  }
  return { handleMobileKeybard };
}
