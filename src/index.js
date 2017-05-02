let path = require("path")
let _ = require("lodash")
let vile = require("vile")

const Gemfile = "Gemfile"
const bundle_audit_to_json = path.join(
  __dirname, "..", "lib_ruby", "bundle_audit_to_json.rb"
)

const BEFORE_JSON = /^[^\[]*/gi
const AFTER_JSON = /[^\]]*$/gi

let to_json = (string) =>
  _.attempt(JSON.parse.bind(null, string))

let to_message = (advisory) => {
  let title = advisory.title
  let gem = advisory.gem
  if (!gem) return title

  let version = advisory.version
  let gem_info = `${gem} v${version} `
  let id = advisory.cve ? `CVE-${advisory.cve}` : `OSV-${advisory.osvdb}`
  let id_info = `${gem_info}(${id})\n`
  let patched = _.get(advisory, "patched_versions", []).join(", ")
  let unaffected = _.get(advisory, "unaffected_versions", []).join(", ")
  return `${id_info}` +
          `${title}\n` +
          `Patched: ${patched || "not yet"}\n` +
          `Unaffected: ${unaffected || "none"}`
}

let is_package_warning = (advisory) =>
  _.has(advisory, "gem")

let signature = (advisory) =>
  is_package_warning(advisory) ?
    `bundler-audit::${advisory.gem}::${advisory.version}::` +
      `${advisory.cve || advisory.osvdb || advisory.title}` :
    `bundler-audit::${advisory.title}`

let link_or_id = (advisory) =>
  _.get(advisory, "url",
    _.get(advisory, "cve",
      _.get(advisory, "osvdb")))

let into_vile_issues = (advisories) =>
  advisories.map((advisory) => {
    let struct = {
      type: vile.SEC,
      path: Gemfile,
      message: to_message(advisory),
      title: _.get(advisory, "title"),
      signature: signature(advisory)
    }

    if (is_package_warning(advisory)) {
      _.merge(struct, {
        security: {
          package: _.get(advisory, "gem"),
          version: _.get(advisory, "version"),
          advisory: link_or_id(advisory),
          patched: _.get(advisory, "patched_versions", []),
          unaffected: _.get(advisory, "unaffected_versions", []),
        }
      })
    }

    return vile.issue(struct)
  })

// HACK: seems there is some logging inside bundle-audit
let sanitize_invalid_json_output = (stdout) =>
  stdout.replace(BEFORE_JSON, "")
        .replace(AFTER_JSON, "")

let bundle_audit = (plugin_config) => {
  let update_db = _.get(plugin_config, "update_db", false)
  let ignore_advisories = _.get(plugin_config, "ignore_advisories", [])
  let args = [
    bundle_audit_to_json,
    update_db.toString(),
    ignore_advisories.join(",")
  ]
  return vile
    .spawn("ruby", { args: args })
    .then((data) => {
      let stdout = sanitize_invalid_json_output(_.get(data, "stdout", ""))
      let issues = stdout ? to_json(stdout) : []
      return issues
    })
}

let punish = (plugin_data) =>
  bundle_audit(_.get(plugin_data, "config", {}))
    .then(into_vile_issues)

module.exports = {
  punish: punish
}
