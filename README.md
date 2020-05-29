# Pull Request Body Pattern Check

This action verifies content in a PR body before allowing merging. This can be useful if you
expect a link to an external site, or certain explicit content.

## Inputs

### `github_token`

**Required** A Github OAuth2 access token.

### `body_pattern`

**Required** The Regular Expression string to match against the PR body.

### `success_message`

**Required** The message to emit on success.

### `failure_message`

**Required** The message to emit on failure.

## Outputs

None.

## Example usage

```
- name: Foo Check
  uses: ./.github/actions/soc-product-board-check
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    body_pattern: '(foo|FOO)+'
    failure_message: 'No FOO!'
    success_message: 'Bar!'
```
