# ScoreSystem - Detect Parody Twitter Accounts

## About

Recently, Elon Musk has purchased Twitter and allowed any user to have a verified (blue check mark) Twitter account, when subscribing to the Twitter Blue plan. In the wake of this change, a number of parody accounts sprung up. These imposter accounts were behaving as the real accounts, for real businesses, and causing their own trouble. This repo contains a very simple algorithm (ScoreSystem) that can detect accounts posing as legimately, verified business accounts.

Note: ***This is a PoC (proof of concept)***

## Payload

Below is the payload we'll be using for our demonstration. Based on the ```noteFromDeveloper``` property, you can determine which accounts are meant to be parodies and which are meant to be real.

```javascript
{
    username: "whoIef00ds",
    name: "Whole Foods",
    biography: "The official Twitter account for the Whole Foods brand. Parody.",
    noteFromDeveloper: "This is a paraody account with improper parody labels."
},
{
    username: "j0hn50n4ndjohnson",
    name: "Johsnon & Johnson Parody",
    biography: "The official Twitter account for Johnson & Johnson. A global leader in healthcare. Parody.",
    noteFromDeveloper: "This is a parody account with proper parody labels."
},
{
    username: "foodlionus",
    name: "Food Lion",
    biography: "The official Twitter account for Food Lion. A southeastern grocery store chain.",
    noteFromDeveloper: 'This is a real account.'
}
```

## How to Use

Run this in your terminal:

```bash
node index.js
```

## The Database

The database in this example can be found in the ```db.json``` file. This database contains 2 real twitter accounts.

## Similar Characters JSON

The ```similarCharacters.json``` file is a very simple key value pairing of similar letters and numbers, commonly used on the internet. You can add to this - replacing null values is important. The algorithm doesn't utilize this as much as it could, but further iterations of the code could include full utilization.

## Client Data JSON

The ```clientData.json``` file is an array of client payload data. This mock client payload data is suppose to mimic a real account creation request, with a few properties removed. If you'd like to experiment with new usernames, please copy an existing object, update it and add it to the array.

## The Scenario

The scenario is such: A user (not an automated bot) is creating a new account. This user has malicious intent and is trying to create a parody account to impersonate a real, verified (Twitter termoniolgy) business. The ScoreSystem algorithm will use the information provided by the user and try to determine if the account is real or a parody.

## Results - Strict mode

Running this, as is, should result in 2 "Account creation" failures and 1 success. Use this to measure against any changes you make.

```bash
API Response:  {
  message: 'Account creation failed. This is a parody account.',
  status: 400,
  requestBody: {
    username: 'whoIef00ds',
    name: 'Whole Foods',
    biography: 'The official Twitter account for the Whole Foods brand. Parody.',
    noteFromDeveloper: 'This is a paraody account with improper parody labels.'
  }
}
API Response:  {
  message: 'Account creation failed. This is a parody account.',
  status: 400,
  requestBody: {
    username: 'j0hn50n4ndjohnson',
    name: 'Johsnon & Johnson Parody',
    biography: 'The official Twitter account for Johnson & Johnson. A global leader in healthcare. Parody.',
    noteFromDeveloper: 'This is a parody account with proper parody labels.'
  }
}
API Response:  { message: 'Successfully created new user.', status: 200 }
```

## Results with ALLOW_PARODY_LABEL env variable - Free mode

Running this, with ```ALLOW_PARODY_LABEL=true```, should result in 1 "Account creation" failures and 2 successes. Use this to measure against any changes you make.

```bash
API Response:  {
  message: 'Account creation failed. This is a parody account.',
  status: 400,
  requestBody: {
    username: 'whoIef00ds',
    name: 'Whole Foods',
    biography: 'The official Twitter account for the Whole Foods brand. Parody.',
    noteFromDeveloper: 'This is a paraody account with improper parody labels.'
  }
}
API Response:  { message: 'Successfully created new user.', status: 200 }
API Response:  { message: 'Successfully created new user.', status: 200 }
```

## Notes

- It should be understood that this implementation alone should not and could not be used to 100% verify the authenticity of an account. Humans are always the better judges. (lets debate about it)
- This algorithm only takes into account a factors and simply calculates the probability that a "new" username is a parody of a real account username.
- Feel free to use this and expand on it, but please give credit where credit is due.
- It would not make sense to implement this at the Sign Up/Register view, as this is a heavily blocking implementation. You'd want to have this run as a cron service.
- You may notice redundancy, but doing this after my morning meetings, 3 cups of coffee and an hour break during work, I decided to do this and not do it perfectly. Have at it with your own implementation :)
- Everyone is a critic, so please be formal and write an Issue on the repo :)
- I will not accept PR requests, as the repo will not be maintained. I support any and all forks! - Fork responsibly!

## ScoreSystem Algorithm

Each character in the username is valued at 2 points (defined by ```this.charValue``` in the ```constructor```). Any character that is a replacement (similar) character to the character that should be expected is called an "offset" (defined by ```this.offset``` in the ```constructor```), and is valued at -1 point. You may ask, how can you have a point less than 0? This was chosen for simple summation using Arrays. You could easily have the offset valued at 1 point, but you'd need to update the code to subtract the offset, rather than only add (i.e. 2 + -1 === 2 - 1). Your choice. Please read code blocks for function descriptions.

## Changelog

- ***November 15th 2022*** - Elon Musk will allow verified parody accounts, but they must explicitly say "PARODY" in their name and bio. The ```ALLOW_PARODY_LABEL``` environment variable will allow you to toggle between strict or free mode. Strict mode = ```ALLOW_PARODY_LABEL=false``` & Free mode = ```ALLOW_PARODY_LABEL=true```.
