/**
 * Determine if the payload provided is valid
 * 
 * 
 * @param {Object} payload A JSON object
 * @returns {Boolean} Valid or invalid payload
 */
function validate(payload) {
  if (!payload) {
    return false
  }
  if (Array.isArray(payload) && payload.length === 0) {
    return false
  }
  if (Object.keys(payload).length  === 0) {
    return false
  }
  for (const key of Object.keys(payload)) {
    if (key === undefined) {
      return false
    }
  }
  return true
}

module.exports = {
  validate
}
