function distributeRoles(playerCount) {
  const roles = [];

  // Add required roles
  roles.push("sheytoon");
  roles.push("parioon");

  // Add nadoon(s)
  if (playerCount > 10) {
    roles.push("nadoon", "nadoon");
  } else {
    roles.push("nadoon");
  }

  // Fill the rest with boodoon
  while (roles.length < playerCount) {
    roles.push("boodoon");
  }

  // Shuffle roles
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  return roles;
}

module.exports = distributeRoles;
