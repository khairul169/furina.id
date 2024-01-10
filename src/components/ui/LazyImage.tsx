import { cn } from "@/utility/utils";
import React, { useState } from "react";

type Props = React.ComponentProps<"img"> & {
  lazySrc: string;
  containerClassName?: string;
};

const LazyImage = ({
  lazySrc,
  src,
  containerClassName,
  className,
  ...props
}: Props) => {
  const [isLoaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "bg-no-repeat bg-cover",
        !isLoaded ? "blur-md" : "",
        containerClassName
      )}
      style={{ backgroundImage: `url('${lazySrc}')` }}
    >
      <img
        src={src}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          "transition-all",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
