/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { cn } from "@/utility/utils";
import LoadingPage from "../misc/loading-page";
import PageMetadata from "@/components/containers/PageMetadata";
import Modal from "@/components/ui/Modal";
import useModal from "@/hooks/useModal";
import Button from "@/components/ui/Button";

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
      <PageMetadata
        title="Pet the Furina"
        description="Play pet the furina meme game"
        keywords="pet furina, pet the furina, pet the meme, furina pat pat, pat furina"
      />

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
  const modal = useModal();

  return (
    <div className="container pt-4 pb-16">
      <Button onClick={modal.onOpen}>Assets Credits</Button>

      <Modal {...modal} title="Big Thanks to:" size="xl">
        <pre className="font-sans overflow-x-auto">
          {`
Furina Stickers:
Guido_ (https://risibank.fr/media/297778-genshin-archon-hydro-c6-r5-soutine)
Coll5 (https://risibank.fr/media/317061-furina-focalor-genshin)

Music:
Kururin Furina Cover by Ariyutta (https://facebook.com/arbi.yudatama)
pet the peepo by NitroiF (https://www.youtube.com/shorts/ll2Au3CdV2k)

Hand Sprite:
@soapmangraylace2752 (https://www.youtube.com/shorts/HEguW7Gmu2w)
Fijiwaterhelp (https://jailbreak.fandom.com/wiki/User_blog:Fijiwaterhelp/hand_petting)
        `.trim()}
        </pre>
      </Modal>
    </div>
  );
};

export default HomePage;
