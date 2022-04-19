const github = require('@actions/github');
const core = require('@actions/core');
const fs = require('fs').promises;

// most @actions toolkit packages have async methods
async function run() {
  try {
    const repos = core.getInput("repos")
    const outputFile = core.getInput('outputFile') || 'snapshot-repos.json'
    const ghToken = process.env['GITHUB_TOKEN'] || ''
    const reposArray = repos.split(",")

    let repoResults = new Array()
    for (let idx = 0; idx < reposArray.length; idx++) {
      const repoFullName = reposArray[idx];
      const octokit = github.getOctokit(ghToken)
      const [owner, repo] = repoFullName.split("/")
      let response = await octokit.rest.repos.get({ owner, repo })
      let repoInfo = response.data
      repoResults.push({ name: repoInfo.name, description: repoInfo.description, language: repoInfo.language, stargazers_count: repoInfo.stargazers_count })
    }
    fs.writeFile(outputFile, JSON.stringify(repoResults))
    core.info("repos has output to the file " + outputFile)
  } catch (error) {
    console.log(error)
    core.setFailed(error.message);
  }

}

run();
