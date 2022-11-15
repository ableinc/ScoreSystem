const apiPost = require('./api/post')

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
  const requests = [
    {
      username: "whoIef00ds",
      name: "Whole Foods",
      biography: "The official Twitter account for the Whole Foods brand. Parody.",
      noteFromDeveloper: 'This is a paraody account.'
    },
    {
      username: "j0hn50n4ndjohnson",
      name: "Johsnon & Johnson",
      biography: "The official Twitter account for Johnson & Johnson. A global leader in healthcare. Parody.",
      noteFromDeveloper: 'This is a parody account.'
    },
    {
      username: "foodlionus",
      name: "Food Lion",
      biography: "The official Twitter account for Food Lion. A southeastern grocery store chain.",
      noteFromDeveloper: 'This is a real account.'
    }
  ]
  for (const body of requests) {
    const request = await sendClientRequest(body)
    console.log('API Response: ', request)
  }
}

main()

