import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

type AnimationType = 
  | "fade-up" 
  | "fade-left" 
  | "fade-right" 
  | "scale" 
  | "rotate" 
  | "blur"
  | "wave";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
}

const animationClasses: Record<AnimationType, string> = {
  "fade-up": "scroll-fade-up",
  "fade-left": "scroll-fade-left",
  "fade-right": "scroll-fade-right",
  "scale": "scroll-scale",
  "rotate": "scroll-rotate",
  "blur": "scroll-blur",
  "wave": "scroll-wave",
};

const ScrollReveal = ({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration,
  threshold = 0.15,
}: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollReveal({ threshold });

  return (
    <div
      ref={ref}
      className={cn(
        animationClasses[animation],
        isVisible && "visible",
        className
      )}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        transitionDuration: duration ? `${duration}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
