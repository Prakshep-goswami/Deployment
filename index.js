import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";
const git = simpleGit();

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const startDate = moment("2023-01-16");
const endDate = moment("2023-01-18");

const totalDays = endDate.diff(startDate, "days") + 1;

const allDates = Array.from({ length: totalDays }, (_, i) =>
  startDate.clone().add(i, "days")
);

const makeDailyCommits = async () => {
  for (const date of allDates) {
    const numCommits = randomInt(15, 25);
    const usedTimes = new Set();

    for (let i = 0; i < numCommits; i++) {
      let hour, minute;
      do {
        hour = randomInt(0, 23);
        minute = randomInt(0, 59);
      } while (usedTimes.has(`${hour}:${minute}`));
      usedTimes.add(`${hour}:${minute}`);

      const fullDate = date.clone().hour(hour).minute(minute).second(0);
      const isoDate = fullDate.format(); // e.g. 2023-10-28T14:23:00+05:30

      const data = {
        date: isoDate,
        message: `Commit #${i + 1} on ${date.format("YYYY-MM-DD")}`,
      };

      jsonfile.writeFileSync(path, data);

      await git.add([path]);
      await git.commit(data.message, {
        "--date": isoDate,
      });

      console.log(`✅ ${data.message} at ${isoDate}`);
    }
  }

  // Push all commits to GitHub
  await git.push();
  console.log("🚀 All commits pushed successfully");
};

makeDailyCommits();
