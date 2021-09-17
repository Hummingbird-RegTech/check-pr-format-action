# Pull Request Pattern Check

This action verifies content in a PR body and title before allowing merging. This can be useful if you
expect a link to an external site, or certain explicit content.

## Inputs

### `github_token`

**Required** A Github OAuth2 access token.

### `body_pattern`

**Optional** The Regular Expression string to match against the PR body.

### `title_pattern`

**Optional** The Regular Expression string to match against the PR title.

### `success_message`

**Required** The message to emit on success.

### `failure_message`

**Required** The message to emit on failure.

## Outputs

None.

## Example usage

```
- name: Foo Check
  uses: Hummingbird-RegTech/check-pr-body-action@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    body_pattern: '(foo|FOO)+'
    title_pattern: '(foo|FOO)+'
    failure_message: 'No FOO!'
    success_message: 'Bar!'
```
