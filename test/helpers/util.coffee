Promise = require "bluebird"
bundler_audit_json = require "./../fixtures/bundler-audit-json"

setup = (vile) ->
  vile.spawn.returns new Promise (resolve) ->
    resolve(JSON.stringify bundler_audit_json)

issues = [
  {
    path: "Gemfile",
    title: "Issue with libxml2"
    signature: "bundler-audit::nokogiri::1.6.7::2015-5312"
    security: {
      package: "nokogiri"
      version: "1.6.7"
      advisory: "https://groups.google.com/forum/..."
      patched: [">= 1.6.7.1"]
      unaffected: ["< 1.6.0", "1.4.0"]
    }
    message: "nokogiri v1.6.7 (CVE-2015-5312)\nIssue with libxml2" +
          "\nPatched: >= 1.6.7.1\nUnaffected: < 1.6.0, 1.4.0"
    type: "security"
  }
  {
    path: "Gemfile"
    title: "You are screwed"
    signature: "bundler-audit::fubar::1.0.0::osvdb-id"
    security: {
      package: "fubar"
      version: "1.0.0"
      advisory: "osvdb-id"
      patched: []
      unaffected: []
    }
    message: "fubar v1.0.0 (OSV-osvdb-id)\nYou are screwed" +
          "\nPatched: not yet\nUnaffected: none"
    type: "security"
  }
  {
    path: "Gemfile"
    title: "Some title"
    signature: "bundler-audit::no-ids::1.0.0::Some title"
    message: "no-ids v1.0.0 (OSV-undefined)\nSome title" +
          "\nPatched: not yet\nUnaffected: none"
    type: "security"
    security: {
      package: "no-ids"
      version: "1.0.0"
      patched: []
      unaffected: []
    }
  }
  {
    path: "Gemfile"
    title: "Insecure Source URI: http://foo.bar"
    signature: "bundler-audit::Insecure Source URI: http://foo.bar"
    message: "Insecure Source URI: http://foo.bar"
    type: "security"
  }
]

module.exports =
  issues: issues
  setup: setup
