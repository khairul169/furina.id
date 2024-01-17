/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AnimatedSprite,
  Application,
  Assets,
  FederatedPointerEvent,
  Sprite,
  Text,
  TextStyle,
} from "pixi.js";
import StateMachine from "./stateMachine";
import { Howl } from "howler";
import { gameDataStore } from "./store";

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

  if (app.view.style) {
    app.view.style.touchAction = "inherit";
  }

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
      src: SFX_URI + "kururina-intro.mp3",
      preload: true,
    }),
    music: new Howl({
      src: SFX_URI + "kururina-loop.mp3",
      preload: true,
      loop: true,
    }),
  };

  const stateMachine = new StateMachine();
  app.ticker.add((dt) => stateMachine.loop(dt));

  stateMachine.add(STATE.MAIN_SCREEN, () => {
    const furina = new Sprite(tex.furinaCurious);
    furina.scale.set(0.6);
    furina.anchor.set(0.5, 0.9);
    furina.position.set(screen.w * 0.5, screen.h * 0.55);

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
      "Press to Pet Furina",
      new TextStyle({
        fontSize: 48,
        fill: ["#fff"],
        stroke: "#333",
        lineJoin: "round",
        strokeThickness: 12,
        align: "center",
      })
    );
    startText.anchor.set(0.5);
    startText.position.set(screen.w * 0.5, screen.h * 0.85);

    // let musicPlayTimeout: any;

    return {
      onStart() {
        app.stage.addChild(furina, btnStart, startText);
      },
      loop(time) {
        btnStart.scale.set(1.0 + Math.sin(time) * 0.2);
        furina.scale.y = 0.55 + Math.cos(time * 10) * 0.01;
        furina.rotation = -0.005 + Math.cos(time * 5) * 0.01;
      },
      onEnd() {
        app.stage.removeChild(furina, btnStart, startText);
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
        sfx.prepare.play();

        timers.push(
          setTimeout(() => {
            furina.visible = true;
          }, 500)
        );

        timers.push(
          setTimeout(() => {
            furinaPos.y = screen.h * 0.48;
          }, 1200)
        );

        timers.push(
          setTimeout(() => {
            furina.visible = false;
            hand.visible = true;
            handPos.y = screen.h * 0.5;
          }, 2500)
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
          }, 3500)
        );

        timers.push(
          setTimeout(() => {
            handPos.x = screen.w * 0.28;
            furinaPos.x = screen.w * 0.72;
          }, 4500)
        );

        timers.push(
          setTimeout(() => {
            handPos.x = screen.w * 0.3;
            hand.scale.set(0.45);
            furinaPos.x = screen.w * 0.7;
            furina.scale.set(0.45);
          }, 5500)
        );

        timers.push(
          setTimeout(() => {
            handPos.x = screen.w * 0.35;
            furinaPos.x = screen.w * 0.65;
          }, 6500)
        );

        timers.push(
          setTimeout(() => {
            stateMachine.start(STATE.RUNNING);
          }, 7500)
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
    handPet.scale.set(0.6);
    handPet.anchor.set(0.5, 0.6);
    let handPetPos = { x: 240, y: 320 };
    handPet.position.set(240, 320);

    const touchButtonGuide = new Sprite(tex.uiBtnTouch);
    touchButtonGuide.anchor.set(0.5, 1);
    touchButtonGuide.position.set(screen.w * 0.5, screen.h * 0.95);

    let touchCount = gameDataStore.getState().score;
    let lastTouch = 0.0;
    let isTouching = false;

    const touchText = new Text(
      String(touchCount),
      new TextStyle({
        fontSize: 80,
        fill: ["#fff"],
        stroke: "#333",
        lineJoin: "round",
        strokeThickness: 12,
        align: "right",
      })
    );
    touchText.anchor.set(0.5, 0.8);
    touchText.position.set(screen.w * 0.5, screen.h * 0.15);

    const onTouch = (e: FederatedPointerEvent) => {
      handPetPos = { x: e.global.x, y: e.global.y };
      isTouching = true;

      gameDataStore.setState((state) => {
        touchCount = state.score + 1;
        return { score: touchCount };
      });

      lastTouch = stateMachine.time;
      touchText.text = String(touchCount);
      touchText.scale.set(1.3);
      touchText.rotation = 0.2;
    };

    const onPointerMove = (e: FederatedPointerEvent) => {
      if (isTouching) {
        handPetPos = { x: e.global.x, y: e.global.y };
      }
    };

    const onTouchUp = () => {
      isTouching = false;
    };

    return {
      onStart() {
        touchCount = 0;
        handPet.play();
        app.stage.addChild(furina, handPet, touchButtonGuide, touchText);

        sfx.music.play();
        app.stage.eventMode = "static";
        app.stage.hitArea = app.screen;
        app.stage.cursor = "pointer";
        app.stage.on("pointerdown", onTouch);
        app.stage.on("pointerup", onTouchUp);
        app.stage.on("pointermove", onPointerMove);
      },
      loop(time, delta) {
        if (isTouching) {
          lastTouch = time;
        }

        if (time - lastTouch < 0.8) {
          if (!handPet.playing) {
            handPet.play();
            handPet.visible = true;
          }
          if (!sfx.music.playing()) {
            sfx.music.play();
          }
          furina.scale.y = 1 + Math.sin(time * 40) * 0.01;
          furina.rotation = -0.01 + Math.cos(time * 30) * 0.02;

          lerpPos(handPet.position, handPetPos, 12 * delta);
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

        if (touchText.scale.x > 1.0) {
          touchText.scale.set(Math.max(1.0, touchText.scale.x - 10 * delta));
        }
        if (touchText.rotation > 0.0) {
          touchText.rotation = Math.max(0.0, touchText.rotation - 2 * delta);
        }
      },
      onEnd() {
        handPet.stop();
        app.stage.removeChild(furina, handPet, touchButtonGuide, touchText);

        sfx.music.stop();
        app.stage.eventMode = "auto";
        app.stage.cursor = "";
        app.stage.off("pointerdown", onTouch);
        app.stage.off("pointerup", onTouchUp);
        app.stage.off("pointermove", onPointerMove);
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
