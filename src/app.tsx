import furinaImg from "@/assets/furina.webp";
import hydroElement from "@/assets/hydro.svg";
import dotPattern from "@/assets/dotpattern.svg";
import logo from "@/assets/logo.svg";
import ParallaxView from "./components/parallax-view";
import ChatWindow from "./components/chat-window";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { CloudSun, GitPullRequest } from "lucide-react";

const App = () => {
  return (
    <div
      className="bg-[#353771] min-h-screen max-h-[100dvh] overflow-hidden relative"
      style={{
        background: "linear-gradient(145deg, #353771 30%, #8ea6f4 150%)",
      }}
    >
      <ParallaxView
        depth={0.005}
        className="absolute inset-0 bg-white"
        style={{
          maskImage: `url(${dotPattern})`,
          maskRepeat: "repeat",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 90%)",
          transform: "scale(1.2)",
        }}
      />
      {/* <ParallaxView
        depth={0.01}
        className="absolute w-[90vw] max-w-[800px] bottom-[10%] left-1/2"
      >
        <div className="animate-[wiggle_10s_ease-in-out_infinite] pointer-events-none">
          <div className="-translate-x-[46%] rotate-6 w-full aspect-video bg-[#d0ecf7] drop-shadow-[-40px_-40px_0px_#869de8]" />
        </div>
      </ParallaxView> */}
      <ParallaxView
        depth={0.015}
        className="absolute right-[10%] top-[10%] md:top-[10%]"
      >
        <img
          src={hydroElement}
          className="h-[80vw] md:h-[40vw] blur-sm opacity-20 pointer-events-none"
        />
      </ParallaxView>
      <ParallaxView
        depth={0.005}
        className="absolute left-1/2 -bottom-[5%] w-full"
      >
        <div className="animate-[updown_8s_ease-in-out_infinite] w-full">
          <img
            src={furinaImg}
            className="max-h-screen w-full aspect-[0.666] object-contain -translate-x-1/2"
          />
        </div>
      </ParallaxView>

      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-full max-w-3xl">
        <ParallaxView
          depth={0.01}
          className="absolute top-0 md:top-[10%] left-[10%] md:left-[1%]"
        >
          <div className="animate-[wiggle_10s_ease-in-out_infinite] pointer-events-none">
            <img src={logo} className="w-[120px] md:w-[200px]" />
          </div>
        </ParallaxView>

        <p className="absolute left-4 md:left-0 bottom-10 text-white text-sm">
          Furina artwork by{" "}
          <a
            href="https://www.pixiv.net/en/users/98144454"
            target="_blank"
            rel="nofollow"
            className="font-bold"
          >
            Rine
          </a>
        </p>

        <p className="absolute left-4 md:left-auto md:right-0 bottom-4 md:bottom-10 text-white text-sm">
          <GitPullRequest className="inline mr-2" size={16} />
          Fork{" "}
          <a
            href="https://git.rul.sh/khairul169/furina.id"
            target="_blank"
            className="font-bold"
          >
            Repo
          </a>
        </p>

        <Clock />
      </div>

      <ChatWindow />
    </div>
  );
};

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const { data: weather } = useQuery({
    queryKey: ["forecast"],
    queryFn: async () => {
      const url =
        "https://api.open-meteo.com/v1/forecast?latitude=-6.2297401&longitude=106.7469453&current_weather=true";
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const data = await res.json();
      return data?.current_weather;
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ParallaxView
      depth={0.01}
      className="bg-white/10 border border-white/40 backdrop-blur-sm text-white p-4 rounded-lg absolute right-4 md:right-0 bottom-24 md:bottom-[10%]"
    >
      <p className="text-right">{dayjs(time).format("dddd, DD MMM YYYY")}</p>

      <p className="text-3xl md:text-5xl font-mono mt-1">
        {dayjs(time).format("hh:mm:ss")}
      </p>

      {weather ? (
        <div className="flex flex-row items-center gap-2 mt-0.5 justify-end md:text-2xl">
          <CloudSun size={20} />
          <p>
            {weather?.temperature}
            <span className="text-sm"> °C</span>
          </p>
        </div>
      ) : null}
    </ParallaxView>
  );
};

export default App;
