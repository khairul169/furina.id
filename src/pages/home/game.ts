/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AnimatedSprite,
  Application,
  Assets,
  Sprite,
  Text,
  TextStyle,
} from "pixi.js";
import StateMachine from "./stateMachine";
import { Howl } from "howler";

const IMG_URI = "/assets/images/";
const UI_URI = "/assets/ui/";
const SFX_URI = "/assets/sfx/";

const STATE = {
  MAIN_SCREEN: 0,
  PREPARE: 1,
  RUNNING: 2,
};

const game = async () => {
  const screen = { w: 800, h: 800 };
  const app = new Application({
    width: screen.w,
    height: screen.h,
    backgroundColor: "#fff",
  });

  const handPetTextures = [...Array(10)].map((_, idx) => {
    const uri = `/handpet/handpet_${String(idx + 1).padStart(2, "0")}.webp`;
    return Assets.load(IMG_URI + uri);
  });

  const tex = {
    furinaCurious: await Assets.load(IMG_URI + "furina-curious.webp"),
    furinaBeeg: await Assets.load(IMG_URI + "furina-beeg.webp"),
    furinaHappy: await Assets.load(IMG_URI + "furina-happy.webp"),
    hand: await Assets.load(IMG_URI + "hand.webp"),
    handPet: await Promise.all(handPetTextures),

    uiBtnPlay: await Assets.load(UI_URI + "btn_play.png"),
    uiBtnTouch: await Assets.load(UI_URI + "btn_touch.png"),
  };

  const sfx = {
    prepare: new Howl({
      src: SFX_URI + "pet-the-peepo-prepare.ogg",
      preload: true,
    }),
    music: new Howl({
      //   src: SFX_URI + "pet-the-peepo.ogg",
      src: SFX_URI + "kuru-kuru-kururin.ogg",
      preload: true,
      loop: true,
    }),
  };

  const stateMachine = new StateMachine();
  app.ticker.add((dt) => stateMachine.loop(dt));

  stateMachine.add(STATE.MAIN_SCREEN, () => {
    const furina = new Sprite(tex.furinaCurious);
    furina.scale.set(0.6);
    furina.anchor.set(0.5);
    furina.position.set(screen.w * 0.5, screen.h * 0.4);

    const btnStart = new Sprite(tex.uiBtnPlay);
    btnStart.scale.set(1.0);
    btnStart.anchor.set(0.5);
    btnStart.position.set(screen.w * 0.5, screen.h * 0.7);
    btnStart.eventMode = "static";
    btnStart.cursor = "pointer";

    btnStart.on("pointerdown", () => {
      stateMachine.start(STATE.PREPARE);
    });

    const startText = new Text(
      "Press to Play",
      new TextStyle({
        fontSize: 28,
      })
    );
    startText.anchor.set(0.5);
    startText.position.set(screen.w * 0.5, screen.h * 0.82);

    // let musicPlayTimeout: any;

    return {
      onStart() {
        app.stage.addChild(furina, btnStart, startText);
        // musicPlayTimeout = setTimeout(() => sfx.music.play(), 100);
      },
      loop(time) {
        btnStart.scale.set(1.0 + Math.sin(time) * 0.2);
      },
      onEnd() {
        app.stage.removeChild(furina, btnStart, startText);

        // clearTimeout(musicPlayTimeout);
        // sfx.music.stop();
      },
    };
  });

  stateMachine.add(STATE.PREPARE, () => {
    const furina = new Sprite(tex.furinaCurious);
    furina.scale.set(0.8);
    furina.anchor.set(0.5);
    const furinaPos = { x: screen.w * 0.5, y: screen.h * 0.45 };
    furina.position.set(furinaPos.x, furinaPos.y);
    furina.visible = false;

    const hand = new Sprite(tex.hand);
    hand.scale.set(0.5);
    hand.anchor.set(0.5);
    const handPos = { x: screen.w * 0.5, y: screen.h * 0.55 };
    hand.position.set(handPos.x, handPos.y);
    hand.visible = false;

    const timers: any[] = [];

    return {
      onStart() {
        app.stage.addChild(furina, hand);

        timers.push(
          setTimeout(() => {
            furina.visible = true;
            furinaPos.y = screen.h * 0.5;
            sfx.prepare.play();
          }, 500)
        );

        timers.push(
          setTimeout(() => {
            furina.visible = false;
            hand.visible = true;
            handPos.y = screen.h * 0.5;
          }, 1500)
        );

        timers.push(
          setTimeout(() => {
            furina.visible = true;
            furina.position.x = screen.w * 0.85;
            furinaPos.x = screen.w * 0.75;
            furina.scale.set(0.4);

            hand.visible = true;
            hand.position.x = screen.w * 0.15;
            handPos.x = screen.w * 0.25;
            hand.scale.set(0.4);
          }, 2400)
        );

        timers.push(
          setTimeout(() => {
            furinaPos.x = screen.w * 0.65;
            furina.scale.set(0.45);
            handPos.x = screen.w * 0.35;
            hand.scale.set(0.45);
          }, 3400)
        );

        timers.push(
          setTimeout(() => {
            stateMachine.start(STATE.RUNNING);
          }, 4500)
        );
      },
      loop(_, dt) {
        if (furina.visible) {
          lerpPos(furina.position, furinaPos, 8 * dt);
        }
        if (hand.visible) {
          lerpPos(hand.position, handPos, 8 * dt);
        }
      },
      onEnd() {
        app.stage.removeChild(furina, hand);
        sfx.prepare.stop();
        timers.forEach(clearTimeout);
      },
    };
  });

  stateMachine.add(STATE.RUNNING, () => {
    const furina = new Sprite(tex.furinaHappy);
    furina.scale.set(1);
    furina.anchor.set(0.5, 1.0);
    furina.position.set(screen.w * 0.5, screen.h * 0.85);

    const handPet = new AnimatedSprite(tex.handPet);
    handPet.animationSpeed = 0.2;
    handPet.scale.set(0.7);
    handPet.anchor.set(0, 0.5);
    handPet.position.set(0, screen.h * 0.34);

    const touchButtonGuide = new Sprite(tex.uiBtnTouch);
    touchButtonGuide.anchor.set(0.5, 1);
    touchButtonGuide.position.set(screen.w * 0.5, screen.h * 0.95);

    const touchText = new Text(
      "0",
      new TextStyle({
        fontSize: 64,
      })
    );
    touchText.anchor.set(1, 0);
    touchText.position.set(screen.w * 0.9, screen.h * 0.1);

    let touchCount = 0;
    let lastTouch = 0.0;

    const onTouch = () => {
      lastTouch = stateMachine.time;
      touchCount += 1;
      touchText.text = String(touchCount);
    };

    return {
      onStart() {
        touchCount = 0;
        handPet.play();
        app.stage.addChild(furina, handPet, touchButtonGuide, touchText);

        sfx.music.play();
        app.stage.eventMode = "static";
        app.stage.cursor = "pointer";
        app.stage.on("pointerdown", onTouch);
      },
      loop(time, delta) {
        if (time - lastTouch < 0.5) {
          if (!handPet.playing) {
            handPet.play();
            handPet.visible = true;
          }
          if (!sfx.music.playing()) {
            sfx.music.play();
          }
          furina.scale.y = 1 + Math.sin(time * 40) * 0.01;
          furina.rotation = -0.01 + Math.cos(time * 30) * 0.02;
        } else {
          if (handPet.playing) {
            handPet.stop();
            handPet.visible = false;
          }
          if (sfx.music.playing()) {
            sfx.music.pause();
          }
          furina.scale.y = 1 + Math.sin(time * 10) * 0.01;
          furina.rotation = lerp(furina.rotation, 0.0, 8 * delta);
        }

        touchButtonGuide.scale.set(0.5 + Math.sin(time * 40) * 0.01);
        touchButtonGuide.position.y =
          screen.h * (0.92 + Math.cos(time * 40) * 0.01);
      },
      onEnd() {
        handPet.stop();
        app.stage.removeChild(furina, handPet, touchButtonGuide, touchText);

        sfx.music.stop();
        app.stage.eventMode = "auto";
        app.stage.cursor = "";
        app.stage.off("pointerdown", onTouch);
      },
    };
  });

  stateMachine.start(STATE.MAIN_SCREEN);
  //   stateMachine.start(STATE.RUNNING);

  const clean = () => {
    stateMachine.clean();
    Howler.stop();
  };

  return { app, clean };
};

type Point = {
  x: number;
  y: number;
};

const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lerpPos = (startPos: any, endPos: Point, amount: number) => {
  startPos.set(
    lerp(startPos.x, endPos.x, amount),
    lerp(startPos.y, endPos.y, amount)
  );
};

export default game;
