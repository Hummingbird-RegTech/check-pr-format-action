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
  const bodyPatternString = core.getInput('body_pattern')
  const titlePatternString = core.getInput('title_pattern')
  const octokit = new github.GitHub(githubToken)

  const { data: pullRequest } = await octokit.pulls.get({
    owner: githubOwner,
    repo: githubRepo,
    pull_number: prNumber,
  })

  let bodyMatch = true
  let titleMatch = true
  if (bodyPatternString && bodyPatternString.length > 0) {
    const bodyPattern = new RegExp(bodyPatternString)
    bodyMatch = !!bodyPattern.exec(pullRequest.body)
  }

  if (titlePatternString && titlePatternString.length > 0) {
    const titlePattern = new RegExp(titlePatternString)
    titleMatch = !!titlePattern.exec(pullRequest.title)
  }

  if (titleMatch && bodyMatch) {
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
