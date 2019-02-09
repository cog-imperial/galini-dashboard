// @flow

class JSONStreamParser {
  remainder = "";

  parse = (str: String) => {
    let pointer = 0;
    const items = [];
    const fullString = this.remainder + str;
    this.remainder = "";
    while (pointer < fullString.length) {
      const startPos = pointer;
      if (fullString.charAt(pointer) !== "{") {
        throw new SyntaxError("Unexpected token " + fullString.charAt(pointer) + " in JSON at position " + pointer);
      }
      while (fullString.charAt(pointer) !== "}") {
        if (pointer >= fullString.length) {
          this.remainder = fullString.substring(startPos);
          return items;
        }
        pointer++;
      }
      pointer++;
      items.push(JSON.parse(fullString.substring(startPos, pointer)));
    }
    return items;
  };
}

export default JSONStreamParser;
