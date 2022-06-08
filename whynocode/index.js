const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const user = core.getInput("user")
    const chatID = core.getInput("chatID")
    const ghToken = process.env["GITHUB_TOKEN"]
    const octokit = github.getOctokit(ghToken)

    const {
      user: { contributionsCollection },
    } = await octokit.graphql(`{
      user(login: "saltbo") {
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
    }`);
    const latestWeek = contributionsCollection.contributionCalendar.weeks.reverse()[0];
    const todayCount = latestWeek.contributionDays.map(el => el.contributionCount).reverse()[0]
    if (todayCount == 0) {
      axios.post('https://lambda.saltbo.fun/senders/bot-timefriend-sender\?chatID\=527035525', 'Why no code commit today?')
      return
    }

    core.info("commited")
  } catch (error) {
    core.setFailed(error.message);
  }

}

run();
