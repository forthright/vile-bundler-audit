"use strict";

var path = require("path");
var _ = require("lodash");
var vile = require("@brentlintner/vile");
var Gemfile = "Gemfile";
var bundle_audit_to_json = path.join(__dirname, "..", "bin", "bundle-audit-to-json");

var to_json = function to_json(string) {
  return _.attempt(JSON.parse.bind(null, string));
};

var to_message = function to_message(advisory) {
  var title = advisory.title;
  var gem = advisory.gem;
  if (!gem) return title;

  var version = advisory.version;
  var gem_info = gem ? gem + " v" + version + " " : "";
  var id = advisory.cve ? "CVE-" + advisory.cve : "OSV-" + advisory.osvdb;
  var id_info = id ? "(" + id + ")\n" : "";
  var patched = _.get(advisory, "patched_versions", []).join(", ");
  var unaffected = _.get(advisory, "unaffected_versions", []).join(", ");
  return "" + gem_info + id_info + (title + "\n") + ("Patched: " + (patched || "not yet") + "\n") + ("Unaffected: " + (unaffected || "none"));
};

var is_source_uri_warning = function is_source_uri_warning(advisory) {
  return !_.has(advisory, "gem");
};

// TODO: use vile.DEPENDENCY when available
var issue_type = function issue_type(advisory) {
  return is_source_uri_warning(advisory) ? vile.WARNING : vile.ERROR;
};

var into_vile_issues = function into_vile_issues(advisories) {
  return advisories.map(function (advisory) {
    return vile.issue(issue_type(advisory), Gemfile, to_message(advisory));
  });
};

var bundle_audit = function bundle_audit() {
  return vile.spawn(bundle_audit_to_json, { args: ["check"] }).then(function (stdout) {
    return stdout ? to_json(stdout) : [];
  });
};

var punish = function punish(plugin_data) {
  return bundle_audit().then(into_vile_issues);
};

module.exports = {
  punish: punish
};