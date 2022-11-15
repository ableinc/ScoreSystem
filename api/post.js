const db = JSON.parse(JSON.stringify(require('./db.json')))
const getApi = require('./get')
const { validate } = require('./helper')
const ScoreSystem = require('../scoreSystem')

/**
 * Simulate a post endpoint in a restful API
 * 
 * @param {RequestBody} req http request body
 * @returns 
 */
const post = async (req) => {
  // Validate payload
  if (!validate(req.body)) {
    return { message: 'Error occurred creating new user.', status: 401 }
  }

  // Check for existing username
  for (const row of db) {
    if (row.username === req.body.username) {
      return { message: 'Username is already in use.', status: 401 }
    }
  }

  // Check if fake account
  const scoreSystem = new ScoreSystem(getApi)
  const parodyAccountScore = await scoreSystem.evaluate(req.body.username)
  if (parodyAccountScore[0]) {
    return { message: 'Account creation failed. This is a parody account.', status: 400, requestBody: req.body }
  }
  // Add user
  db.push({
    username: req.body.username,
    name: req.body.name,
    verified: false,
    biography: req.body.biography,
    created_at: new Date().toISOString()
  })
  // Return success message
  return { message: "Successfully created new user.", status: 200 }
}

module.exports = post