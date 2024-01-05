type StateManager = {
  onStart?: () => void;
  loop?: (time: number, delta: number) => void;
  onEnd?: () => void;
};

class StateMachine {
  time!: number;
  states!: {
    [key: number]: {
      instance: StateManager | null;
      init: () => StateManager;
    };
  };
  curState!: number;

  constructor() {
    this.time = 0.0;
    this.curState = -1;
    this.states = [];
  }

  add(idx: number, fn: () => StateManager) {
    this.states[idx] = {
      instance: null,
      init: fn,
    };
  }

  start(idx: number) {
    const lastState = this.states[this.curState]?.instance;
    if (lastState?.onEnd != null) {
      lastState.onEnd!();
    }

    this.time = 0.0;
    this.curState = idx;

    const state = this.states[idx]?.init();
    this.states[idx].instance = state;

    if (state?.onStart != null) {
      state.onStart!();
    }
  }

  loop(delta: number) {
    const dt = delta / 100;
    this.time = (this.time + dt) % 3600;

    const state = this.states[this.curState]?.instance;
    if (state?.loop != null) {
      state.loop!(this.time, dt);
    }
  }

  clean() {
    const state = this.states[this.curState]?.instance;
    if (state?.onEnd != null) {
      state.onEnd!();
    }
  }
}

export default StateMachine;
