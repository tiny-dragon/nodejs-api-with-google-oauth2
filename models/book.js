var pool = require('../config/database')

exports.getAll = function(body, callback) {
    try {
        pool.query("SELECT * FROM book", (err, result) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, result)
            }
        })
    } catch (e) {
        callback(e, null)
    }
}

exports.addFavoriteBook = function(body, callback) {
    try {
        const { user_id, book_id, favorite } = body
        const now = new Date()

        pool.query("SELECT * FROM user_book_favorite WHERE user_id = ? AND book_id = ?", [user_id, book_id], (err, result) => {
            if (err) {
                callback(err, null)
            } else {
                if (result.length == 0) {
                    pool.query("INSERT INTO user_book_favorite (user_id, book_id, favorite, timestamp) VALUES ?", [[[user_id, book_id, favorite, now]]], (err, result) => {
                        if (err) callback(err, null)
                        callback(null, result.insertId)
                    })
                } else {
                    pool.query("UPDATE user_book_favorite SET favorite = ?, timestamp = ? WHERE user_id = ? AND book_id = ?", [favorite, now, user_id, book_id], (err, result) => {
                        if (err) callback(err, null)
                        callback(null, result.insertId)
                    })
                }
            }
        })

    } catch (e) {
        callback(e, null)
    }
}