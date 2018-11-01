module.exports.show = (request, response) => {
  const { currentUser } = request;
  response.json({
    success: true,
    data: {
      uuid: currentUser.uuid,
      steamId: currentUser.steamId,
      level: currentUser.level,
      money: currentUser.money,
      rank: currentUser.rank,
      xp: currentUser.xp,
    },
  });
};
