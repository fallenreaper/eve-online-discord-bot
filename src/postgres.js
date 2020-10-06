const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: '0.0.0.0',
  database: 'evesde',
  password: 'password',
  port: 5432,
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