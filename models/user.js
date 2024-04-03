var pool = require('../config/database')

exports.userLogin = function(body, callback) {
    try {
        const { google_id, name, email } = body
        const now = new Date()

        pool.query("SELECT * FROM user WHERE email = ?", email, (err, result) => {
            if (err) {
                callback(err, null)
            } else {
                if (result.length == 0) {
                    pool.query("INSERT INTO user (google_id, email, name, last_login) VALUES ?", [[[google_id, email, name, now]]], (err, result) => {
                        if (err) callback(err, null)
                        callback(null, result.insertId)
                    })
                } else {
                    const user_id = result[0].id;
                    pool.query("UPDATE user SET last_login = ? WHERE email = ?", [now, email], (err, result) => {
                        if (err) callback(err, null)
                        callback(null, user_id)
                    })
                }
            }
        })
    } catch (e) {
        callback(e, null)
    }
}

exports.addUserInquery = function(body, callback) {
    try {
        const { user_id, text } = body
        const now = new Date()

        pool.query("INSERT INTO user_inquiry (user_id, text, timestamp) VALUES ?", [[[user_id, text, now]]], (err, result) => {
            if (err) callback(err, null)
            callback(null, result.insertId)
        })
    } catch (e) {
        callback(e, null)
    }
}