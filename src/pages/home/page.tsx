/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { cn } from "@/utility/utils";
import LoadingPage from "../misc/loading-page";

const HomePage = () => {
  const appRef = useRef<any>();
  const cleanRef = useRef<any>();
  const targetRef = useRef<HTMLDivElement>(null);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    if (!appRef.current) {
      appRef.current = true;

      const init = async () => {
        const { default: game } = await import("./game");
        const { app, clean } = await game();
        targetRef.current?.appendChild(app.view as never);

        appRef.current = app;
        cleanRef.current = clean;
        setReady(true);
      };

      init();
    }

    return () => {
      if (cleanRef.current) {
        cleanRef.current();
      }
    };
  }, [setReady]);

  return (
    <div>
      {!isReady ? <LoadingPage /> : null}

      <div
        ref={targetRef}
        className={cn(
          "flex flex-col items-center justify-center",
          styles.canvasContainer
        )}
      />

      <Credits />
    </div>
  );
};

const Credits = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <div className="container pt-4 pb-16 border-t">
      <button
        type="button"
        className={cn(
          "border-primary-500 border text-sm rounded-lg px-4 py-2",
          toggle ? "bg-primary-500 text-white" : ""
        )}
        onClick={() => setToggle(!toggle)}
      >
        Assets Credits
      </button>

      {toggle ? (
        <pre className="max-h-[200px] overflow-y-auto mt-4 font-sans">
          {`
Furina Stickers:
Guido_ (https://risibank.fr/media/297778-genshin-archon-hydro-c6-r5-soutine)
Coll5 (https://risibank.fr/media/317061-furina-focalor-genshin)

Hand Sprite:
@soapmangraylace2752 (https://www.youtube.com/shorts/HEguW7Gmu2w)
Fijiwaterhelp (https://jailbreak.fandom.com/wiki/User_blog:Fijiwaterhelp/hand_petting)

Music:
Kurururin by Raphiiel (https://www.youtube.com/watch?v=NY0ffyEu6uo)
pet the peepo by NitroiF (https://www.youtube.com/shorts/ll2Au3CdV2k)
        `.trim()}
        </pre>
      ) : null}
    </div>
  );
};

export default HomePage;
