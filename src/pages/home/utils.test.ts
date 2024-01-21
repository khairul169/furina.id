import { assert } from "chai";
import { getGreetingByTime } from "./utils.js";
import dayjs from "dayjs";

describe("HomePage utils", () => {
  it("getGreetingByTime() should return correct result", () => {
    const times = [
      { time: "02:00", result: "night" },
      { time: "05:00", result: "morning" },
      { time: "08:00", result: "morning" },
      { time: "11:00", result: "day" },
      { time: "13:00", result: "day" },
      { time: "16:00", result: "afternoon" },
      { time: "17:00", result: "evening" },
      { time: "19:00", result: "night" },
    ];

    times.forEach((item) => {
      const time = dayjs(
        dayjs().format("YYYY-MM-DD") + " " + item.time
      ).toDate();
      const result = getGreetingByTime(time).toLowerCase();

      assert.equal(
        result,
        item.result,
        `Greeting at ${item.time} is ${item.result}`
      );
    });
  });
});
