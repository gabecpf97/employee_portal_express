function containsIgnoreCase(str, searchStr) {
    return new RegExp(searchStr, "i").test(str);
  }

export default containsIgnoreCase