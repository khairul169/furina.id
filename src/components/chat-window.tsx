import { useIsMobile } from "@/hooks/useScreen";
import { cn } from "@/utils";
import { MessageSquareQuote, SendIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import furinaAvatar from "@/assets/furina-avatar.webp";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { ThreeDots } from "react-loader-spinner";
import Markdown from "react-markdown";

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
  const queryClient = useQueryClient();
  const [isOpen, setOpen] = useState(false);

  const { data: messages } = useQuery({
    queryKey: ["chats"],
    queryFn: () => api("/chats"),
  });

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      return api("/chats", {
        method: "POST",
        body: JSON.stringify({ message }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["chats"] });
      const prevData = queryClient.getQueryData(["chats"]);

      // optimistic update
      queryClient.setQueryData(["chats"], (prev: any) => [
        { id: "-1", role: "user", content: data },
        ...prev,
      ]);
      return { prevData };
    },
    onError: (_err, _data, ctx) => {
      queryClient.setQueryData(["chats"], ctx?.prevData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      const msgEl = document.querySelector('[name="message"]') as
        | HTMLInputElement
        | undefined;
      setTimeout(() => msgEl?.focus(), 100);
    },
  });

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
    if (sendMessage.isPending) {
      return;
    }

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const message = data.get("message") as string;
    if (!message?.length) {
      return;
    }

    sendMessage.mutate(message, {
      onSuccess: () => form.reset(),
    });
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
          "bg-white/20 border border-white/20 shadow-lg rounded-lg backdrop-blur-md absolute bottom-[10px] sm:bottom-1/4 left-[10px] sm:left-[10%] w-[calc(100%-20px)] sm:max-w-[320px] h-[80vh] sm:h-[300px] lg:max-w-[400px] lg:h-[350px] flex flex-col items-stretch overflow-hidden transition-all ease-linear sm:traansition-none translate-y-[110%] sm:translate-y-0 opacity-100",
          messages == null && "-translate-x-8 opacity-0",
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
          {sendMessage.isPending && (
            <Message
              name="Furina"
              role="model"
              children={
                <ThreeDots
                  visible={true}
                  height="16"
                  width="32"
                  color="#5381c7"
                  ariaLabel="writing.."
                />
              }
            />
          )}

          {sendMessage.isError && (
            <p className="text-xs text-center self-center text-black my-4 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg">
              {getSendChatErrorMessage(sendMessage.error)}
            </p>
          )}

          {messages?.map((msg: any) => {
            return (
              <Message
                key={msg.id}
                isMe={msg.role === "user"}
                name={msg.role === "user" ? "Me" : "Furina"}
                role={msg.role}
                children={<Markdown>{msg.content}</Markdown>}
              />
            );
          })}
        </div>

        <form onSubmit={onSubmit}>
          <div className="p-2 flex flex-row items-center pt-1">
            <input
              name="message"
              className="w-full border-none rounded-full text-sm px-3 h-8 focus:outline-none"
              placeholder="Write Message..."
              required
              disabled={sendMessage.isPending}
            />
            <button
              className="text-white size-8 shrink-0 hover:bg-white/40 rounded-full flex items-center justify-center -mr-1"
              disabled={sendMessage.isPending}
            >
              <SendIcon size={18} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

type MessageProps = {
  isMe?: boolean;
  role?: string;
  name: string;
  children?: React.ReactNode;
};

const Message = ({ isMe, role, name, children }: MessageProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-2 w-full max-w-[90%]",
        isMe && "justify-end self-end pr-1"
      )}
    >
      {role === "model" && (
        <div className="size-8 rounded-full bg-white shrink-0 overflow-hidden">
          <img src={furinaAvatar} className="w-full h-full object-cover" />
        </div>
      )}

      <div className={cn("flex flex-col", isMe && "items-end")}>
        <p className="font-medium -mt-1 text-sm text-white">{name}</p>
        <div
          className={cn(
            "bg-white/40 backdrop-blur-md text-slate-900 rounded-xl px-2 py-1 mt-0.5 text-sm",
            isMe ? "bg-white/80 rounded-tr-none" : "rounded-tl-none"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const getSendChatErrorMessage = (error: Error) => {
  if (error?.message?.includes("FinishReasonSafety")) {
    return "Your message probably detected with blocked words, please try again.";
  }

  return "An error occured. Please try again.";
};

export default ChatWindow;
