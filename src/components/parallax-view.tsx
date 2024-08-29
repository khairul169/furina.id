import { useIsMobile } from "@/hooks/useScreen";
import { ComponentPropsWithoutRef, useEffect, useRef } from "react";

const ParallaxView = ({
  depth,
  style,
  ...props
}: ComponentPropsWithoutRef<"div"> & { depth: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = ref.current;
    if (!el || isMobile) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX * -depth;
      const y = e.clientY * -depth;
      el.style.transform = `${
        style?.transform || ""
      } translateX(${x}px) translateY(${y}px)`;
    };

    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [isMobile]);

  return <div {...props} style={style} ref={ref} />;
};

export default ParallaxView;
