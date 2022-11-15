const apiPost = require('./api/post')
const clientData = JSON.parse(JSON.stringify(require('./clientData.json')))

/**
 * Simulate a front-end client request 
 * @param {Object} requestBody A JSON object
 * @returns 
 */
const sendClientRequest = async (requestBody) => {
  let response
  try {
    response = await apiPost({ body: requestBody })
  } catch (error) {
    console.log('Error occurred with client request: ', error)
  }
  return response
}

// Lets keep it C and run it with main()
async function main () {
  const requests = clientData
  for (const body of requests) {
    const request = await sendClientRequest(body)
    console.log('API Response: ', request)
  }
}

main()

