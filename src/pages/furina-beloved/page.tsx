/* eslint-disable @typescript-eslint/no-explicit-any */
import coverImg from "@/assets/images/furina-cover.webp";
import buildImg from "@/assets/images/furina-build.webp";
import furinaChibiImg from "@/assets/images/113932900_p0_master1200.webp";
import copyIcon from "@/assets/icons/copy-outline.svg";
import playIcon from "@/assets/icons/play-outline.svg";
import skillAudio from "@/assets/audio/VO_JA_Furina_Elemental_Skill_1_04.ogg";
import { cn, copyToClipboard, showToast } from "@/utility/utils";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";

const gameUID = "828243224";

const FurinaBelovedPage = () => {
  const onCopyUID = () => {
    copyToClipboard(gameUID);
    showToast("success", "UID copied!");
  };

  return (
    <div>
      <section>
        <HeroBackground />

        <div className="container flex items-center justify-center pt-10">
          <SkillAudioPlayer />
        </div>
      </section>

      <section className="container py-8 md:py-16">
        <figure>
          <a
            href="https://enka.network/u/khairul169/4bLBVD/10000089/2778194/"
            target="_blank"
          >
            <img
              src={buildImg}
              alt="furina build"
              className="w-full rounded-xl mt-8 hover:scale-105 transition-transform"
            />
          </a>
          <figcaption className="text-sm mt-2 text-center italic">
            Furina build image generated using{" "}
            <a
              href="https://enka.network/"
              className="font-bold text-primary-500 hover:underline"
            >
              enka.network
            </a>
          </figcaption>
        </figure>
      </section>

      <section className="py-16 md:py-20 flex flex-col items-center justify-center bg-primary-600 text-white">
        <figure>
          <img
            src={furinaChibiImg}
            alt="furina"
            className={cn("h-60", styles.rotatingAnims)}
          />
          <figcaption className="text-sm text-center text mt-2 italic">
            Artwork by:{" "}
            <a
              href="https://www.pixiv.net/en/users/28173184"
              className="text-white font-bold hover:underline"
            >
              ゆずとろ
            </a>
          </figcaption>
        </figure>

        <div className="bg-white text-slate-700 rounded-xl mt-8 px-6 md:px-8 py-4 md:py-6 lg:py-8 lg:px-10 flex flex-col items-center shadow text-center mx-4">
          <p className="text-2xl text-black font-light">
            Do you want to play with me?
            <br />
            🥺👉👈
          </p>
          <p className="text-lg mt-2">
            Add:{" "}
            <button
              type="button"
              className="font-bold text-primary-600 hover:scale-110 transition-transform active:scale-100"
              onClick={onCopyUID}
            >
              {gameUID}
              <img src={copyIcon} alt="copy uid" className="h-4 inline mx-1" />
            </button>
          </p>
        </div>
      </section>
    </div>
  );
};

const HeroBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = (e: Event) => {
      const curScrollY = (e.currentTarget as any).scrollY;
      setScrollY(Math.min(curScrollY, 500));
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className="w-full bg-[length:100%_auto] hover:bg-[length:105%_auto] aspect-[1.8] md:aspect-[2.8] relative transition-all"
      style={{
        backgroundImage: `url(${coverImg})`,
        backgroundPosition: `center ${40 - Math.min(scrollY / 400, 1.0) * 10}%`,
      }}
    >
      <div className="absolute bottom-4 left-0 right-0 text-sm text-white">
        <div className="container">
          <p>Eclair (828243224)</p>
        </div>
      </div>
    </div>
  );
};

const SkillAudioPlayer = () => {
  const skillAudioRef = useRef<HTMLAudioElement>(null);
  const playingTimeout = useRef<any>(null);
  const [isPlaying, setPlaying] = useState(false);

  const onPlayAudio = () => {
    skillAudioRef.current?.play();
    setPlaying(true);

    if (playingTimeout.current) {
      clearTimeout(playingTimeout.current);
    }

    playingTimeout.current = setTimeout(() => {
      setPlaying(false);
      playingTimeout.current = null;
    }, 4000);
  };

  return (
    <>
      <button
        type="button"
        className={`group flex flex-col items-center justify-center text-center border border-transparent hover:border-primary-500
             rounded-xl px-6 py-4 hover:shadow transition-all hover:text-orange-500 hover:scale-105 active:scale-100 active:translate-y-5`}
        onClick={onPlayAudio}
      >
        <img
          src={playIcon}
          className={cn("h-8", isPlaying ? styles.playAnims : "")}
        />
        <p className="text-xl font-light mt-4">
          ✮⋆{" "}
          <span className="group-hover:text-purple-500">The curtain rises</span>{" "}
          ✩ ₊˚
        </p>
      </button>

      <audio ref={skillAudioRef}>
        <source src={skillAudio} type="audio/ogg" />
      </audio>
    </>
  );
};

export default FurinaBelovedPage;
