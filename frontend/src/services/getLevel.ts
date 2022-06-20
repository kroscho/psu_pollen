const TreesLevels = [
  {
    start: 1,
    end: 10,
    name: "Низкий",
    level: "low",
  },
  {
    start: 11,
    end: 100,
    name: "Средний",
    level: "medium",
  },
  {
    start: 101,
    end: 1000,
    name: "Высокий",
    level: "high",
  },
  {
    start: 1001,
    end: Number.MAX_SAFE_INTEGER,
    name: "Очень высокий",
    level: "veryHigh",
  },
];

const HerbLevels = [
  {
    start: 1,
    end: 10,
    name: "Низкий",
    level: "low",
  },
  {
    start: 11,
    end: 30,
    name: "Средний",
    level: "medium",
  },
  {
    start: 31,
    end: 100,
    name: "Высокий",
    level: "high",
  },
  {
    start: 100,
    end: Number.MAX_SAFE_INTEGER,
    name: "Очень высокий",
    level: "veryHigh",
  },
];

export default function getLevel(type: string, value: number) {
  const data = type === "tree" ? TreesLevels : HerbLevels;
  const level = data.find((el) => {
    return value >= el.start && value <= el.end;
  });
  if (level) {
    return level.level;
  }
  return "none";
}
