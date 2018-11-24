const levelGroups = [
  { k: [...Array(5).keys()].map(i => i + 1), v: 100 },
  { k: [...Array(5).keys()].map(i => i + 6), v: 250 },
  { k: [...Array(5).keys()].map(i => i + 11), v: 500 },
  { k: [...Array(10).keys()].map(i => i + 16), v: 500 },
  { k: [...Array(25).keys()].map(i => i + 26), v: 750 },
  { k: [...Array(50).keys()].map(i => i + 51), v: 1500 },
];

let xp = 0;
const LEVELS_MAP = [];

levelGroups.forEach(group => {
  group.k.forEach(level => {
    LEVELS_MAP.push({ number: level, min: xp });
    xp += group.v;
  });
});

LEVELS_MAP.slice(1).forEach((level, index) => {
  LEVELS_MAP[index].max = level.min - 1;
});

const LAST_LEVEL = LEVELS_MAP[LEVELS_MAP.length - 1];

LAST_LEVEL.max = LAST_LEVEL.min + 1500;

module.exports = {
  LEVELS_MAP,
  MAX_XP: LAST_LEVEL.max,
};
