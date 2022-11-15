const db = JSON.parse(JSON.stringify(require('./db.json')))
const { validate } = require('./helper')

/**
 * Simulate a get endpoint in a restful API
 * 
 * @param {RequestBody} req http request body
 * @returns 
 */
const get = (req) => {
  const search = []
  // validate payload
  if (!validate(req.body)) {
    throw new Error('Request body is required.')
  }
  // return all users on wildcard
  if (req.body.username === '*') {
    search.push(db)
  }
  // if we found existing user, return row
  for (const row of db) {
    if (row.username === req.body.username) {
      return search.push(row)
    }
  }
  // Do search based query on verified users
  for (const row of db) {
    if (row.username.includes(req.body.username)) {
      search.push(row)
    }
  }
  // if we didn't find aything return empty data
  return { data: search, status: 200 }
}



module.exports = get
