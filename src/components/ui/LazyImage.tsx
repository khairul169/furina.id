import { cn } from "@/utility/utils";
import React, { useState } from "react";

type Props = React.ComponentProps<"img"> & {
  lazySrc: string;
  containerClassName?: string;
  placeholderClassName?: string;
  placeholder?: React.ReactNode;
};

const LazyImage = ({
  lazySrc,
  src,
  containerClassName,
  placeholderClassName,
  className,
  placeholder,
  ...props
}: Props) => {
  const [isLoaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative", containerClassName)}>
      <div
        className={cn(
          "absolute inset-0 bg-no-repeat bg-cover blur-md z-0 transition-all duration-500",
          placeholderClassName,
          isLoaded ? "brightness-75" : ""
        )}
        style={{ backgroundImage: `url('${lazySrc}')` }}
      ></div>

      {!isLoaded && placeholder ? placeholder : null}

      <img
        src={src}
        loading="lazy"
        onLoad={() => setTimeout(() => setLoaded(true), 50)}
        className={cn(
          "transition-all duration-500 relative z-[1]",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
