import furinaImg from "@/assets/furina.webp";
import hydroElement from "@/assets/hydro.svg";
import dotPattern from "@/assets/dotpattern.svg";
import logo from "@/assets/logo.svg";
import ParallaxView from "./components/parallax-view";
import ChatWindow from "./components/chat-window";

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
        <div className="animate-[updown_8s_ease-in-out_infinite] w-full pointer-events-none">
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
      </div>

      <ChatWindow />
    </div>
  );
};

export default App;
