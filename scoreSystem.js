const similarCharacters = require('./similarCharacters.json')

class ScoreSystem {
  constructor (api) {
    this.apiGet = api
    this.charValue = 2
    this.offset = -1
    this.similarChars = JSON.parse(JSON.stringify(similarCharacters))
  }

  /**
   * Search for similar usernames to the one provided.
   * 
   * This data can be passed into this class, but for
   * this demonstration lets keep it all in house.
   * 
   * @param {String} username A username to search with
   * @returns {String} Similar usernames
   */
  async searchUsernames (username) {
    let searchResults = []
    for (const character of username) {
      const payload = {
        body: {
          username: character,
          verified: true
        }
      }
      try {
        const results = await this.apiGet(payload)
        searchResults = searchResults.concat(results.data)
      } catch (error) {
        console.log(error)
      }
    }
    // Grab only verified account usernames
    const usernames = searchResults.filter(item => item.verified === true).map(item => item.username)
    // Remove duplicates from search results
    const results = usernames.filter((username, index, self) => { return self.indexOf(username) === index })
    return results
  }

  /**
   * Calculate the score of the given username
   * 
   * @param {String} username A username
   * @returns {Number} The score for the given username
   */
  getUsernameScore (username) {
    return username.split('').map(() => this.charValue).reduce((a, b) => { return a + b })
  }

  /**
   * Filter scores for similar usernames that are equal or greater than
   * the given username score
   * @param {Number} score The username score calculated by this.getUsernameScore()
   * @param {Array} scoresArray The scores for similar usernames
   * @returns 
   */
  _getSimilarScores (score, scoresArray) {
    return scoresArray.filter(item => item.score >= score)
  }

  /**
   * When calculating score, extra characters are appended
   * to the username, this function will remove those.
   * 
   * @param {String} username A username
   * @returns {String} The username with the extra characteres removed
   */
  _removeExtraChars (username) {
    return username.replace(/[*,]/g, '')
  }

  /**
   * Calculate the score for similar usernames
   * 
   * @param {String} username A username
   * @returns {Array} Scores for similar usernames
   */
  async gatherScores (username) {
    const similarUsernamesScores = []
    const usernameScore = await this.getUsernameScore(username)
    const similarUsernames = await this.searchUsernames(username)
    for (const similarUsername of similarUsernames) {
      const similarUsernameScore = await this.getUsernameScore(similarUsername)
      similarUsernamesScores.push({ username: similarUsername, score: similarUsernameScore })
    }
    return this._getSimilarScores(usernameScore, similarUsernamesScores)
  }

  /**
   * Compare the given username to similar usernames
   * 
   * @param {String} username A username
   * @param {Array} similars Similar usernames to username
   * @returns {Array} Array of objects containing comparison information
   */
  compareToSimilar(username, similars) {
    const final = []
    for (const similar of similars) {
      const score = []
      // get length difference
      const temp = [username, similar]
      // determine the larger string length
      temp.sort((a, b) => { return a.length - b.length })
      // find the difference in characters between the two string
      const difference = temp[1].length - temp[0].length
      // Add extra characters to the end of the shorter username
      // we do this to avoid an index error when iterating through strings
      username = temp[0] + Array.apply(null, Array(difference)).map(() => '*')
      // Compare letters in both
      // since they are the same length, we can use the index of either string
      for (const index in username) {
        let usernameLetter = username[index]
        let similarLetter = similar[index]
        // if characters are the same, treat as normal
        if (usernameLetter === similarLetter) {
          score.push(this.charValue)
        } else {
          // if they are not the same, treat as an offset
          score.push(this.offset)
        }
      }
      // Calculate the score 
      const calculation = score.reduce((a, b) => { return a + b })
      // Slice the calulation value in half (this.charValue = 2)
      // then subtract from username length
      const diff = calculation > 0 ? username.length - calculation * 0.5 : 0
      // final output array
      // parodyAccount is calculated by dividing the username by diff, if its more than half then this is possibly a parody/fake account
      final.push({ username: this._removeExtraChars(username), similar, score: calculation > 1 ? calculation : 0, difference: diff, usernameLength: username.length, parodyAccount: diff > 0 && username.length / diff >= 2 })
    }
    return final
  }

  /**
   * Evaluate the data and determine if the
   * given username is a parody account of
   * a verified account
   * @param {String} username A username
   * @returns {Array} Matching accounts
   */
  async evaluate(username) {
    const similar = await this.gatherScores(username)
    const similarScores = this.compareToSimilar(username, similar.map(item => item.username ))
    return similarScores.filter(item => item.parodyAccount === true)
  }
}

module.exports = ScoreSystem
