"use strict";

const fastGlob = require("fast-glob");
const {writeFile, truncate} = require("fs/promises");
const {resolve} = require("path");
const {platform} = require("os");

// special version of writeFile that preserves metadata on WSL and Cygwin platforms
module.exports.writeFile = async (file, content) => {
  if (platform() === "win32") {
    try {
      await truncate(file);
      await writeFile(file, content, {flag: "r+"});
    } catch {
      await writeFile(file, content);
    }
  } else {
    await writeFile(file, content);
  }
};

module.exports.exit = (err) => {
  if (err) console.error(err);
  process.exit(err ? 1 : 0);
};

module.exports.glob = (pattern) => {
  return fastGlob.sync(pattern, {cwd: resolve(__dirname, ".."), absolute: true});
};
