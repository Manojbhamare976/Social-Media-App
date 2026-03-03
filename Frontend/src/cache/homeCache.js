let homeCache = null;

export function setHomeCache(data) {
  homeCache = data;
}

export function getHomeCache() {
  return homeCache;
}

export function clearHomeCache() {
  homeCache = null;
}
