
const process = require("process")

const _METADATA = {
	"token": process.env.DISCORD_TOKEN ||"",
	"POSTGRES_HOST": process.env.POSTGRES_HOST || "0.0.0.0",
	"POSTGRES_PORT": process.env.POSTGRES_PORT || 5432,
	"POSTGRES_USER": process.env.POSTGRES_USER || "postgres",
	"POSTGRES_PASSWORD": process.env.POSTGRES_PASSWORD || "password",
	"POSTGRES_DB": process.env.POSTGRES_DB || "evesde"
}
exports.get = () => {
    return _METADATA
}