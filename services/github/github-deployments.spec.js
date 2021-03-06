'use strict'

const { test, given } = require('sazerac')
const GithubDeployments = require('./github-deployments.service')

describe('GithubDeployments', function () {
  test(GithubDeployments.render, () => {
    given({
      state: 'SUCCESS',
    }).expect({
      message: 'success',
      color: 'brightgreen',
    })
    given({
      state: 'ERROR',
    }).expect({
      message: 'error',
      color: 'red',
    })
    given({
      state: 'IN_PROGRESS',
    }).expect({
      message: 'in progress',
      color: undefined,
    })
  })

  test(GithubDeployments.prototype.transform, () => {
    given({
      data: {
        repository: {
          deployments: {
            nodes: [],
          },
        },
      },
    }).expectError('Not Found: environment not found')
    given({
      data: {
        repository: {
          deployments: {
            nodes: [
              {
                latestStatus: null,
              },
            ],
          },
        },
      },
    }).expectError('Not Found: deployment has no status (yet)')
    given({
      data: {
        repository: {
          deployments: {
            nodes: [
              {
                latestStatus: {
                  state: 'SUCCESS',
                },
              },
            ],
          },
        },
      },
    }).expect({
      state: 'SUCCESS',
    })
  })
})
