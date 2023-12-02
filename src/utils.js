const util = {
  stringToColor: function stringToColor(str, opts) {
    if (!str) return util.randColor();

    let h, s, l;
    opts = opts || {};
    opts.hue = opts.hue || [0, 360];
    opts.sat = opts.sat || [75, 100];
    opts.lit = opts.lit || [40, 60];

    const range = function (hash, min, max) {
      const diff = max - min;
      const x = ((hash % diff) + diff) % diff;

      return x + min;
    };

    let hash = 0;

    if (str.length === 0) return hash;

    for (let x = 0; x < str.length; ++x) {
      hash = str.charCodeAt(x) + ((hash << 5) - hash);
      hash &= hash;
    }

    h = range(hash, opts.hue[0], opts.hue[1]);
    s = range(hash, opts.sat[0], opts.sat[1]);
    l = range(hash, opts.lit[0], opts.lit[1]);

    return `hsl(${h}, ${s}%, ${l}%)`;
  },
  getOppositeHue: function getOppositeHue(base) {
    return (
      "hsl(" +
      ((parseInt(base.slice(4, base.length).replace(/,.*/, "")) + 180) % 360) +
      ", 100%, 30%)"
    );
  },
  formatBytes: function (bytes, decimals = 2) {
    if (!bytes || bytes === "0") return "0 Bytes";

    const kByte = 1024,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      sizeIndex = Math.floor(Math.log(bytes) / Math.log(kByte));

    return `${parseFloat(
      (bytes / Math.pow(kByte, sizeIndex)).toFixed(decimals)
    )} ${sizes[sizeIndex]}`;
  },
  dateStringReplacements: {
    "%%": function () {
      return "%";
    },
    "%a": function (date) {
      return date.toLocaleString("en-us", { weekday: "short" });
    },
    "%A": function (date) {
      return date.toLocaleString("en-us", { weekday: "long" });
    },
    "%b": function (date) {
      return date.toLocaleString("en-us", { month: "short" });
    },
    "%B": function (date) {
      return date.toLocaleString("en-us", { month: "long" });
    },
    "%c": function (date) {
      return (
        util.dateStringReplacements["%x"](date) +
        " " +
        util.dateStringReplacements["%X"](date)
      );
    },
    "%d": function (date) {
      return util.padNumber(date.getDate(), 2);
    },
    "%H": function (date) {
      return util.padNumber(date.getHours(), 2);
    },
    "%I": function (date) {
      return util.padNumber((date.getHours() + 12) % 12, 2);
    },
    "%j": function (date) {
      const dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
      const month = date.getMonth(),
        day = date.getDate();
      let dayOfYear = dayCount[month] + day;

      if (month > 1 && util.isLeapYear(date)) ++dayOfYear;

      return dayOfYear;
    },
    "%m": function (date) {
      return util.padNumber(date.getMonth() + 1, 2);
    },
    "%M": function (date) {
      return util.padNumber(date.getMinutes(), 2);
    },
    "%p": function (date) {
      return date.getHours() < 12 ? "AM" : "PM";
    },
    "%S": function (date) {
      return util.padNumber(date.getSeconds(), 2);
    },
    "%U": function (date) {
      const jan = new Date(date.getFullYear(), 0, 1);

      return Math.ceil(((date - jan) / 86400000 + jan.getDay() + 1) / 7) - 1;
    },
    "%w": function (date) {
      return date.getDay();
    },
    "%W": function (date) {
      const jan = new Date(date.getFullYear(), 0, 1);

      return Math.ceil(((date - jan) / 86400000 + jan.getDay() + 1) / 7);
    },
    "%x": function (date) {
      return (
        util.dateStringReplacements["%m"](date) +
        "/" +
        util.dateStringReplacements["%d"](date) +
        "/" +
        util.dateStringReplacements["%y"](date)
      );
    },
    "%X": function (date) {
      return (
        util.dateStringReplacements["%H"](date) +
        ":" +
        util.dateStringReplacements["%M"](date) +
        ":" +
        util.dateStringReplacements["%S"](date)
      );
    },
    "%y": function (date) {
      return parseInt(String(date.getFullYear()).substring(2));
    },
    "%Y": function (date) {
      return date.getFullYear();
    },
    "%z": function (date) {
      return date.toString().match(/\(([A-Za-z\s].*)\)/)[1];
    },
  },
  parseDateString: function parseDateString(format, date) {
    if (typeof format !== "string") return format;

    const matches = util.uniqueArr(format.match(/%./g));
    let x = 0,
      count = matches.length,
      replacement;
    date = date || new Date();

    for (; x < count; ++x) {
      replacement = util.dateStringReplacements[matches[x]];

      format = format.replace(
        new RegExp(matches[x], "g"),
        replacement ? replacement(date) : ""
      );
    }

    return format;
  },
  isLeapYear: function (date) {
    const year = (date || new Date()).getFullYear();

    if ((year & 3) !== 0) return false;

    return year % 100 !== 0 || year % 400 === 0;
  },
  toCoLeDate: function (date) {
    date = new Date(date);

    return date.getTime() / 24 / 3600 / 1000 + 25568;
  },
  fromCoLeDate: function (cole) {
    return new Date((cole - 25568) * 24 * 3600 * 1000);
  },
  padNumber: function padNumber(number, length) {
    const string = "000000000" + number;

    return string.substr(string.length - length);
  },
  clone: function clone(it) {
    if (typeof it !== "object") return; // console.error('common', 'util.clone only accepts Objects and Arrays');

    if (it instanceof Array || typeof it.length === "number")
      return [].slice.call(it);

    return Object.assign({}, it);
  },
  arrToTruthTable: function (arr) {
    return Object.fromEntries(
      arr.map((item) => {
        return [item, 1];
      })
    );
  },
  sumArr: function (arr) {
    return arr.reduce((a, b) => {
      return a + b;
    }, 0);
  },
  averageArr: function (arr) {
    return util.sumArr(arr) / arr.length;
  },
  cleanArr: function cleanArr(arr, items) {
    const newArr = [];

    for (let x = 0, itemCount = arr.length, item; x < itemCount; ++x) {
      item = arr[x];

      if (item && (!items || (items && !items.includes(item))))
        newArr.push(item);
    }

    return newArr;
  },
  adjustArr: function adjustArr(arr, oldIndex, newIndex) {
    const arrLen = arr.length;
    let padding;

    while (oldIndex < 0) oldIndex += arrLen;
    while (newIndex < 0) newIndex += arrLen;

    if (newIndex >= arrLen) {
      padding = newIndex - arrLen;

      while (--padding + 1) arr.push(undefined);
    }

    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);

    return arr;
  },
  sameArr: function sameArr(arr1, arr2) {
    if (!arr1 || !arr2) return false;

    const arrLen = arr1.length;

    if (arrLen !== arr2.length) return false;

    for (let x = 0; x < arrLen; ++x) {
      if (arr1[x] !== arr2[x]) return false;
    }

    return true;
  },
  inArr: function inArr(arr1, arr2) {
    if (!arr1 || !arr2) return false;

    for (let x = 0, count = arr1.length; x < count; ++x) {
      if (!arr2.includes(arr1[x])) return false;
    }

    return true;
  },
  anyInArr: function anyInArr(arr1, arr2) {
    if (!arr1 || !arr2) return false;

    for (let x = 0, count = arr1.length; x < count; ++x) {
      if (arr2.includes(arr1[x])) return true;
    }

    return false;
  },
  uniqueArr: function uniqueArr(arr) {
    const seen = {},
      out = [];
    const len = arr.length;
    let x = 0,
      y = 0;

    for (; x < len; ++x) {
      const item = arr[x];

      if (seen[item]) continue;

      seen[item] = 1;
      out[y] = item;
      ++y;
    }

    return out;
  },
  commonArr: function commonArr() {
    const arrays = Array.prototype.sort.call(arguments);

    arrays.sort(function (a, b) {
      return b.length - a.length;
    });

    const result = arrays.shift().reduce(function (res, val) {
      if (
        !res.includes(val) &&
        arrays.every(function (arr) {
          return arr.includes(val);
        })
      )
        res.push(val);

      return res;
    }, []);

    return result;
  },
  differenceArr: function differenceArr(arr1, arr2) {
    const result = [],
      arr1Len = arr1.length,
      arr2Len = arr2.length,
      longerArr = arr1Len > arr2Len ? arr1 : arr2,
      shorterArr = arr1Len > arr2Len ? arr2 : arr1;

    for (let x = 0; x < longerArr.length; ++x) {
      if (!shorterArr.includes(longerArr[x])) result.push(longerArr[x]);
    }

    return result;
  },
  sortArrAlphaNumeric: function (arr) {
    const alphabeticRegex = /[^a-zA-Z]/g;
    const numericRegex = /[^0-9]/g;

    function sortAlphaNum(a, b) {
      const AInt = parseInt(a);
      const BInt = parseInt(b);

      if (isNaN(AInt) && isNaN(BInt)) {
        const aA = a.replace(alphabeticRegex, "");
        const bA = b.replace(alphabeticRegex, "");

        if (aA === bA) {
          const aN = parseInt(a.replace(numericRegex, ""));
          const bN = parseInt(b.replace(numericRegex, ""));

          return aN === bN ? 0 : aN > bN ? 1 : -1;
        } else {
          return aA > bA ? 1 : -1;
        }
      } else if (isNaN(AInt)) {
        //A is not an Int
        return 1; //to make alphanumeric sort first return -1 here
      } else if (isNaN(BInt)) {
        //B is not an Int
        return -1; //to make alphanumeric sort first return 1 here
      } else {
        return AInt > BInt ? 1 : -1;
      }
    }

    return arr.sort(sortAlphaNum);
  },
  arrIsNegative: function arrIsNegative(arr) {
    return arr.every((item) => {
      return item < 0;
    });
  },
  shuffleArr: function (array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },
  IPToDec: function IPToDec(ip) {
    const octets = ip.split(".");

    return (
      ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>>
      0
    );
  },
  decToIP: function decToIP(int) {
    const oct_3 = int & 255;
    const oct_2 = (int >> 8) & 255;
    const oct_1 = (int >> 16) & 255;
    const oct_0 = (int >> 24) & 255;

    return oct_0 + "." + oct_1 + "." + oct_2 + "." + oct_3;
  },
  decToHex: function decToHex(dec, length) {
    length = length || 8;
    let output = (parseInt(dec) + Math.pow(16, length))
      .toString(16)
      .substr(-length)
      .toString();

    if (output === "NaN") {
      output = "0".repeat(length);
      console.error("decTohex isNaN", String(dec), length, output);
    }

    return output;
  },
  decToRGB: function decToRGB(dec) {
    dec = Number(dec);

    return (
      "rgb(" +
      (dec & 0x0000ff) +
      ", " +
      ((dec & 0x00ff00) >> 8) +
      ", " +
      ((dec & 0xff0000) >> 16) +
      ")"
    );
  },
  stringToHex: function stringToHex(string, charBytes) {
    let hex = "",
      stringLen = string.length,
      x,
      charHex;

    for (x = 0; x < stringLen; ++x) {
      charHex = Number(string.charCodeAt(x)).toString(16);
      hex += charBytes
        ? "0".repeat(charBytes - charHex.length) + charHex
        : charHex;
    }

    return hex;
  },
  hexToString: function hexToString(hex, charBytes) {
    hex = hex.toString();
    charBytes = charBytes || 2;

    let string = "",
      hexLen = hex.length,
      x;

    for (x = 0; x < hexLen; x += charBytes) {
      string += String.fromCharCode(parseInt(hex.substr(x, charBytes), 16));
    }

    return string;
  },
  bitCheck: function bitCheck(mask, bit) {
    return !!(mask & parseInt(bit, 16));
  },
  findRanges: function (arr, simplify) {
    const arrLength = arr.length;
    if (!arrLength) return arr;

    arr = arr.sort(function (a, b) {
      return a - b;
    });

    const ranges = [];
    let range = 0;

    for (let x = 0; x < arrLength; ++x) {
      ranges[range] = ranges[range] || [];

      if (simplify) {
        ranges[range][Math.min(1, ranges[range].length)] = arr[x];
      } else {
        ranges[range].push(arr[x]);
      }

      if (arr[x + 1] - arr[x] !== 1 && x < arrLength - 1) ++range;
    }

    return ranges;
  },
  rand: function rand(min, max) {
    return Math.random() * (max - min) + min;
  },
  randInt: function randInt(min, max) {
    return parseInt(util.rand(min, max));
  },
  seedRand: function (seed, min, max) {
    const x = Math.sin(++seed) * 10000;

    return parseInt((x - Math.floor(x)) * (max - min) + min);
  },
  randTF: function randTF() {
    return !!(Math.random() < 0.5 ? 1 : 0);
  },
  randColor: function (opts) {
    opts = typeof opts === "object" ? opts : {};

    const h_lvl = opts.h_lvl || 180;
    const h_var = opts.h_var || 180;
    const h = util.randInt(
      Math.max(0, h_lvl - h_var),
      Math.min(360, h_lvl + h_var)
    );

    const s_lvl = opts.s_lvl || 55;
    const s_var = opts.s_var || 25;
    const s = util.randInt(
      Math.max(0, s_lvl - s_var),
      Math.min(100, s_lvl + s_var)
    );

    const l_lvl = opts.l_lvl || 55;
    const l_var = opts.l_var || 10;
    const l = util.randInt(
      Math.max(0, l_lvl - l_var),
      Math.min(100, l_lvl + l_var)
    );

    return "hsl(" + h + "," + s + "%," + l + "%)";
  },
  randFromArr: function randFromArr(arr) {
    const arrLen = arr.length;

    return arr[util.randInt(0, arrLen)];
  },
  chance: function (chance) {
    if (chance === undefined) {
      chance = 50;
    }
    return chance > 0 && Math.random() * 100 <= chance;
  },
  weightedChance: function (items) {
    const rand = Math.random() * 100;
    let sum = 0;

    const itemNames = Object.keys(items);

    for (let x = 0; x < itemNames.length; ++x) {
      sum += items[itemNames[x]];

      if (rand <= sum) return itemNames[x];
    }
  },
  incChar: function incChar(char, inc) {
    return String.fromCharCode(char.charCodeAt(0) + (inc === 0 ? 0 : inc || 1));
  },
  toggle: function toggle(bool) {
    return (bool ^= 1);
  },
  run: function run(arr, destructive) {
    if (!destructive) arr = util.clone(arr);

    let task;

    while ((task = arr.shift())) task();
  },
  runInOrder: function (functions, currentFunction) {
    if (!currentFunction && !functions.length) return;
    if (!currentFunction) currentFunction = functions.shift();

    const nextFunction = functions.shift();

    const next = function () {
      util.runInOrder(functions, nextFunction);
    };

    currentFunction(next);
  },
  forEachInOrder: function (arr, func, currentItem) {
    if (!currentItem && !arr.length) return;
    if (!currentItem) currentItem = arr.shift();

    func(
      currentItem,
      arr.length < 1
        ? undefined
        : () => util.forEachInOrder(arr, func, arr.shift())
    );
  },
  capitalize: function capitalize(str, recursive, split = " ") {
    const words = str.split(split);
    const wordCount = words.length;

    for (let x = 0, word; x < (recursive ? wordCount : 1); ++x) {
      word = words[x];

      words[x] = word.charAt(0).toUpperCase() + word.slice(1);
    }

    return words.join(split);
  },
  fromCamelCase: function fromCamelCase(string, joiner = " ") {
    return string.split(/(?=[A-Z][a-z])/).join(joiner);
  },
  toCamelCase: function (string, upperCamelCase = false, splitter = " ") {
    return string
      .split(splitter)
      .map((item, index) => {
        return (index === 0 && upperCamelCase) || index > 0
          ? util.capitalize(item)
          : item;
      })
      .join("");
  },
  objectValues: function objectValues(obj) {
    return Object.keys(obj).map(function (key) {
      return obj[key];
    });
  },
  toFixed: function (num, decimalPlaces, outputAsNumber) {
    // no rounding, yay!
    const floatRegex = new RegExp(
      "(^-?[0-9]*)\\.?([0-9]{0," +
        (decimalPlaces - 1 || -1) +
        "}[1-9]{1}(?=.+?0*$))?"
    );
    let output = String(num).match(floatRegex);
    output = output[1] + (output[2] ? "." + output[2] : "");

    return outputAsNumber ? parseFloat(output) : output;
  },
};

export default util;
