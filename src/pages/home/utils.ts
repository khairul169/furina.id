//
export const getGreetingByTime = (time: Date) => {
  const hours = time.getHours();
  let msg = "Day";

  if (hours >= 18 || hours < 3) {
    msg = "Night";
  } else if (hours >= 3 && hours < 10) {
    msg = "Morning";
  } else if (hours >= 10 && hours < 15) {
    msg = "Day";
  } else if (hours >= 15 && hours < 17) {
    msg = "Afternoon";
  } else if (hours >= 17 && hours < 18) {
    msg = "Evening";
  }

  return msg;
};
