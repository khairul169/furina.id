import { createStore } from "zustand";
import { persist } from "zustand/middleware";

type GameDataStore = {
  score: number;
};

export const gameDataStore = createStore(
  persist<GameDataStore>(
    () => ({
      score: 0,
    }),
    { name: "gameData" }
  )
);
