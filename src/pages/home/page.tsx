import titleImg from "@/assets/images/title-img.svg";
import PageMetadata from "@/components/containers/PageMetadata";
import { cn } from "@/utility/utils";
import dayjs from "dayjs";
import { ComponentProps, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { icons } from "./icons";
import { useQuery } from "react-query";
import pb from "@/utility/api";

const HomePage = () => {
  return (
    <div className="h-screen w-full bg-slate-900 overflow-hidden relative">
      <PageMetadata title="" />
      <BackgroundSlideshow />

      <DateTime />
    </div>
  );
};

const BackgroundSlideshow = () => {
  const { data: wallpapers } = useQuery({
    queryKey: ["wallpapers"],
    queryFn: async () => {
      const items = await pb.collection("wallpapers").getFullList({
        sort: "@random",
        expand: "artwork",
      });

      return items.map((item) => {
        const artwork = item.expand?.artwork;
        return pb.files.getUrl(artwork, artwork?.image);
      });
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <img
        src={titleImg}
        alt="title"
        className="h-4 md:h-8 absolute top-6 left-6 md:top-8 md:left-8 lg:left-[5%] lg:top-[5%] z-[5]"
      />

      {wallpapers && wallpapers?.length > 0 ? (
        <BackgroundImage src={wallpapers[0]} />
      ) : null}
    </>
  );
};

type BackgroundImageProps = {
  src: string;
};

const BackgroundImage = ({ src }: BackgroundImageProps) => {
  const [isLoaded, setLoaded] = useState(false);
  return (
    <>
      <img
        src={src}
        alt="img"
        className="hidden"
        onLoad={() => setTimeout(() => setLoaded(true), 100)}
      />

      <div
        className={cn(
          "absolute w-[100vw] bg-center bg-cover inset-0 opacity-0 transition-opacity duration-500",
          isLoaded ? "opacity-100" : ""
        )}
        style={{ backgroundImage: `url('${src}')` }}
      ></div>
    </>
  );
};

const DateTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intv = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(intv);
    };
  }, [setTime]);

  const message = useMemo(() => {
    const hours = time.getHours();
    let msg = "Day";

    if (hours >= 18 && hours <= 2) {
      msg = "Night";
    } else if (hours > 2 && hours <= 9) {
      msg = "Morning";
    } else if (hours > 9 && hours <= 15) {
      msg = "Day";
    } else if (hours > 15 && hours < 18) {
      msg = "Evening";
    }

    return `Good ${msg}~ 💧✨`;
  }, [time]);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 lg:left-[5%] lg:translate-x-0 bottom-1/2 translate-y-1/2 w-full md:w-auto px-4 md:px-0 text-white [text-shadow:_0_1px_5px_rgb(0_0_0_/_60%)] text-center lg:text-left z-10">
      <p className="text-md md:text-2xl">{message}</p>
      <p className="text-7xl md:text-8xl font-light mt-0.5">
        {dayjs(time).format("HH:mm")}
      </p>
      <p className="text-md md:text-lg font-light mt-2">
        {dayjs(time).format("dddd, DD MMM YYYY")}
      </p>

      <AppNav className="mt-8" />
    </div>
  );
};

const AppNav = ({ className }: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex items-start justify-center lg:justify-start flex-wrap gap-3 md:gap-x-4 lg:gap-x-6",
        className
      )}
    >
      <AppNavItem title="Pat Furina" icon={icons.patFurina} path="/pat-pat" />
      <AppNavItem title="Album" icon={icons.treasures} path="/treasures" />
      <AppNavItem
        title="Facebook"
        icon={icons.facebook}
        path="https://www.facebook.com/"
        iconClassName="p-1"
      />
      <AppNavItem
        title="X"
        icon={icons.twitter}
        path="https://twitter.com/"
        iconClassName="bg-black"
      />
      <AppNavItem
        title="Furinamains Discord"
        icon={icons.furinamains}
        path="https://discord.com/invite/ew8yz3h5at"
        iconClassName="bg-[#6b473a]"
      />
    </div>
  );
};

type AppNavItemProps = {
  title: string;
  icon: string;
  path?: string;
  iconClassName?: string;
};

const AppNavItem = ({ title, icon, path, iconClassName }: AppNavItemProps) => {
  return (
    <Link to={path || "#"} className="flex flex-col items-center w-12 group">
      <div
        className={cn(
          "bg bg-white rounded-lg w-12 h-12 overflow-hidden group-hover:scale-110 transition-all",
          iconClassName
        )}
      >
        <img
          src={icon}
          alt={title}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>
      <p className={cn("text-white text-center mt-2 text-sm")}>{title}</p>
    </Link>
  );
};

export default HomePage;
