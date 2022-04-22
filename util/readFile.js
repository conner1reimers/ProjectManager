const fs = require('fs').promises;

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath);
    return data;
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
    return null;
  }
} // returns buffer file

module.exports = readFile;