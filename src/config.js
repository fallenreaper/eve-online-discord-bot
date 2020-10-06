
const fs = require("fs");
var _METADATA = null;
try {
    _METADATA = JSON.parse(fs.readFileSync("./config.json"))
    console.log("MetaData", _METADATA)
} catch (e) {
    console.error(e)
}
exports.get = () => {
    return _METADATA
}