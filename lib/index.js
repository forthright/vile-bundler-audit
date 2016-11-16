"use strict";

var path = require("path");
var _ = require("lodash");
var vile = require("@forthright/vile");

var Gemfile = "Gemfile";
var bundle_audit_to_json = path.join(__dirname, "..", "lib_ruby", "bundle_audit_to_json.rb");

var BEFORE_JSON = /^[^\[]*/gi;
var AFTER_JSON = /[^\]]*$/gi;

var to_json = function to_json(string) {
  return _.attempt(JSON.parse.bind(null, string));
};

var to_message = function to_message(advisory) {
  var title = advisory.title;
  var gem = advisory.gem;
  if (!gem) return title;

  var version = advisory.version;
  var gem_info = gem + " v" + version + " ";
  var id = advisory.cve ? "CVE-" + advisory.cve : "OSV-" + advisory.osvdb;
  var id_info = gem_info + "(" + id + ")\n";
  var patched = _.get(advisory, "patched_versions", []).join(", ");
  var unaffected = _.get(advisory, "unaffected_versions", []).join(", ");
  return "" + id_info + (title + "\n") + ("Patched: " + (patched || "not yet") + "\n") + ("Unaffected: " + (unaffected || "none"));
};

var is_package_warning = function is_package_warning(advisory) {
  return _.has(advisory, "gem");
};

var signature = function signature(advisory) {
  return is_package_warning(advisory) ? "bundler-audit::" + advisory.gem + "::" + advisory.version + "::" + ("" + (advisory.cve || advisory.osvdb || advisory.title)) : "bundler-audit::" + advisory.title;
};

var link_or_id = function link_or_id(advisory) {
  return _.get(advisory, "url", _.get(advisory, "cve", _.get(advisory, "osvdb")));
};

var into_vile_issues = function into_vile_issues(advisories) {
  return advisories.map(function (advisory) {
    var struct = {
      type: vile.SEC,
      path: Gemfile,
      message: to_message(advisory),
      title: _.get(advisory, "title"),
      signature: signature(advisory)
    };

    if (is_package_warning(advisory)) {
      _.merge(struct, {
        security: {
          package: _.get(advisory, "gem"),
          version: _.get(advisory, "version"),
          advisory: link_or_id(advisory),
          patched: _.get(advisory, "patched_versions", []),
          unaffected: _.get(advisory, "unaffected_versions", [])
        }
      });
    }

    return vile.issue(struct);
  });
};

// HACK: seems there is some logging inside bundle-audit
var sanitize_invalid_json_output = function sanitize_invalid_json_output(stdout) {
  return stdout.replace(BEFORE_JSON, "").replace(AFTER_JSON, "");
};

var bundle_audit = function bundle_audit(plugin_config) {
  var update_db = _.get(plugin_config, "update_db", false);
  var ignore_advisories = _.get(plugin_config, "ignore_advisories", []);
  var args = [bundle_audit_to_json, update_db.toString(), ignore_advisories.join(",")];
  return vile.spawn("ruby", { args: args }).then(function (data) {
    var stdout = sanitize_invalid_json_output(_.get(data, "stdout", ""));
    var issues = stdout ? to_json(stdout) : [];
    return issues;
  });
};

var punish = function punish(plugin_data) {
  return bundle_audit(_.get(plugin_data, "config", {})).then(into_vile_issues);
};

module.exports = {
  punish: punish
};