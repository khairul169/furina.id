import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";
import { MessageSquareQuote, SendIcon, X } from "lucide-react";
import furinaImg from "@/assets/furina.webp";
import hydroElement from "@/assets/hydro.svg";
import dotPattern from "@/assets/dotpattern.svg";
import logo from "@/assets/logo.svg";
import furinaAvatar from "@/assets/furina-avatar.webp";
import { cn } from "./utils";
import { useIsMobile } from "./hooks/useScreen";

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

type ChatMessage = {
  name: string;
  role: "assistant" | "user";
  text: string;
};

const ChatWindow = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const moveWindowStateRef = useRef({
    isMoving: false,
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
  });
  const isMobile = useIsMobile();
  const [isOpen, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      name: "Furina",
      role: "assistant",
      text: "Ah, akhirnya seseorang yang mengerti betapa pentingnya kehadiranku! Tapi, hmm... Kau ingin apa dariku? Jangan bilang ini hanya sapaan biasa!",
    },
  ]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMobile) {
      if (isOpen) {
        setOpen(false);
      }
      return;
    }

    if (moveWindowStateRef.current.isMoving) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    moveWindowStateRef.current.isMoving = true;
    moveWindowStateRef.current.startX =
      e.clientX - moveWindowStateRef.current.x;
    moveWindowStateRef.current.startY =
      e.clientY - moveWindowStateRef.current.y;
  };

  const onMouseMove = (e: MouseEvent) => {
    const container = containerRef.current;
    if (isMobile || !moveWindowStateRef.current.isMoving || !container) {
      return;
    }

    const x = e.clientX - moveWindowStateRef.current.startX;
    const y = e.clientY - moveWindowStateRef.current.startY;
    moveWindowStateRef.current.x = x;
    moveWindowStateRef.current.y = y;
    container.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onMouseUp = () => {
    moveWindowStateRef.current.isMoving = false;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      setMessages([
        {
          name: "Furina",
          role: "assistant",
          text: "...?",
        },
        {
          name: "Me",
          role: "user",
          text: data.get("text") as string,
        },
        ...messages,
      ]);

      form.reset();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("pointermove", onMouseMove);
    document.addEventListener("pointerup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("pointermove", onMouseMove);
      document.removeEventListener("pointerup", onMouseUp);
    };
  }, []);

  return (
    <>
      <button
        className={cn(
          "flex md:hidden absolute bottom-4 right-4 h-14 px-4 rounded-xl gap-x-2 bg-white text-slate-600 shadow-lg active:opacity-80 flex-row items-center justify-center",
          isOpen && "hidden"
        )}
        onClick={() => setOpen(!isOpen)}
      >
        <span>Chat</span>
        <MessageSquareQuote />
      </button>

      <div
        ref={containerRef}
        className={cn(
          "bg-white/20 border border-white/20 shadow-lg rounded-lg backdrop-blur-md absolute bottom-[10px] sm:bottom-1/4 left-[10px] sm:left-[10%] w-[calc(100%-20px)] sm:max-w-[320px] h-[80vh] sm:h-[300px] flex flex-col items-stretch overflow-hidden transition-transform sm:transition-none translate-y-[110%] sm:translate-y-0",
          isOpen && "translate-y-0"
        )}
      >
        <div
          className="flex flex-row items-center gap-2 px-3 h-8 cursor-move"
          onMouseDown={onMouseDown}
          onPointerDown={onMouseDown}
        >
          <div className="size-3 rounded-full bg-red-500" />
          <div className="size-3 rounded-full bg-yellow-500" />
          <div className="size-3 rounded-full bg-green-500" />
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col-reverse gap-y-2 p-2">
          {messages.map((msg, idx) => {
            const isMe = msg.role === "user";

            return (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-2 w-full max-w-[90%]",
                  isMe && "justify-end self-end pr-1"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="size-8 rounded-full bg-white shrink-0 overflow-hidden">
                    <img
                      src={furinaAvatar}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className={cn("flex flex-col", isMe && "items-end")}>
                  <p className="font-medium -mt-1 text-sm text-white">
                    {msg.name}
                  </p>
                  <div
                    className={cn(
                      "bg-white text-slate-800 rounded-xl px-2 py-1 mt-0.5 text-sm",
                      isMe ? "rounded-tr-none" : "rounded-tl-none"
                    )}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={onSubmit}>
          <div className="p-2 flex flex-row items-center pt-1">
            <input
              name="text"
              className="w-full border-none rounded-full text-sm px-3 h-8 focus:outline-none"
              placeholder="Write Message..."
              required
            />
            <button className="text-white size-8 shrink-0 hover:bg-white/40 rounded-full flex items-center justify-center -mr-1">
              <SendIcon size={18} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default App;
