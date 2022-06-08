const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const username = core.getInput("user")
    const chatID = core.getInput("chatID")
    const ghToken = process.env["GITHUB_TOKEN"]
    const octokit = github.getOctokit(ghToken)

    const { user } = await octokit.graphql(`
      query ($username: String!) {
        user(login: $username) {
          contributionsCollection {
            endedAt
            contributionCalendar {
              weeks {
                contributionDays {
                  contributionCount
                  date
                  weekday
                }
              }
            }
          }
        }
      }
    `, { username });

    const latestWeek = user.contributionsCollection.contributionCalendar.weeks.reverse()[0];
    const todayCount = latestWeek.contributionDays.map(el => el.contributionCount).reverse()[0]
    core.debug(latestWeek.contributionDays)
    if (todayCount == 0) {
      axios.post('https://lambda.saltbo.fun/senders/bot-timefriend-sender\?chatID\=' + chatID, 'Why no code commit today?')
      core.info("Ask done.")
      return
    }

    core.info("Already commited today, skip ask.")
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
