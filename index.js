const core = require('@actions/core')
const github = require('@actions/github')

const REF_PATTERN = new RegExp('^refs\/pull\/(?<prNum>[0-9]+)\/merge$')

function parsePullRequestNumber(githubRef) {
  const result = REF_PATTERN.exec(githubRef)
  if (!result) throw new Error('Could not parse PR number from reference.')
  const { prNum } = result.groups
  return prNum
}

async function run() {
  const prNumber = parsePullRequestNumber(process.env.GITHUB_REF)
  const [githubOwner, githubRepo] = process.env.GITHUB_REPOSITORY.split('/')
  const githubToken = core.getInput('github_token')
  const successMessage = core.getInput('success_message')
  const failureMessage = core.getInput('failure_message')
  const bodyPattern = new RegExp(core.getInput('body_pattern'))
  const octokit = new github.GitHub(githubToken)

  const { data: pullRequest } = await octokit.pulls.get({
    owner: githubOwner,
    repo: githubRepo,
    pull_number: prNumber,
  })

  const result = bodyPattern.exec(pullRequest.body)
  if (result) {
    // If PB ever opens an API, we can get the feature id:
    // const { featureId } = result
    core.setOutput('Success', successMessage);
  } else {
    core.setFailed(failureMessage)
  }
}

async function main() {
  try {
    await run()
  } catch (error) {
    core.setFailed(error.message);
  }
}

main()
