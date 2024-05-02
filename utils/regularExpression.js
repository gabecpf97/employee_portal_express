function containsIgnoreCase(str, searchStr) {
  const regex = new RegExp(`^${searchStr}$`, "i");
  return regex.test(str);
}

export default containsIgnoreCase;
