Promise = require "bluebird"
bundler_audit_json = require "./../fixtures/bundler-audit-json"

setup = (vile) ->
  vile.spawn.returns new Promise (resolve) ->
    resolve(JSON.stringify bundler_audit_json)

issues = [
  {
    file: "Gemfile",
    msg: "nokogiri v1.6.7 (CVE-2015-5312)\nIssue with libxml2" +
          "\nPatched: >= 1.6.7.1\nUnaffected: < 1.6.0, 1.4.0",
    type: "error",
    where: { end: {}, start: {} },
    data: {}
  }
  {
    file: "Gemfile",
    msg: "fubar v1.0.0 (OSV-something)\nYou are screwed" +
          "\nPatched: not yet\nUnaffected: none",
    type: "error",
    where: { end: {}, start: {} },
    data: {}
  }
  {
    file: "Gemfile",
    msg: "Insecure Source URI: http://foo.bar\n" +
          "Patched: not yet\nUnaffected: none",
    type: "warn",
    where: { end: {}, start: {} },
    data: {}
  }
]

module.exports =
  issues: issues
  setup: setup
