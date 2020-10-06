const { Pool } = require('pg')
const _METADATA = require("./config").get()
const pool = new Pool({
  user: _METADATA.POSTGRES_USER || "postgres",
  host: _METADATA.POSTGRES_HOST || "localhost",
  database: _METADATA.POSTGRES_DB || "postgres",
  password: _METADATA.POSTGRES_PASSWORD || 'password',
  port: _METADATA.POSTGRES_PORT || 5432,
})

exports.query = (statement, success, error) => {
    pool.query(statement, (err, res) => {
        pool.end()
        if (err){
            error(err)
        } else {
            success(res)
        }
    })
}

exports.test = (message) => {
    pool.query("SELECT NOW()", (err, res) => {
        const n = res.rows[0].now
        console.log("Testing Current Time: ", n)
        pool.end()
        message.reply(`The time is: ${n}`)
    })
}