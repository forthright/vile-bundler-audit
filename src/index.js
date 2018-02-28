const path = require("path")
const _ = require("lodash")
const vile = require("vile")

const Gemfile = "Gemfile"

const BEFORE_JSON = /^[^\[]*/gi
const AFTER_JSON = /[^\]]*$/gi

const to_json = (string) =>
  _.attempt(JSON.parse.bind(null, string))

const bundle_audit_to_json = () => {
  const base_dir = _.has(process, "pkg.defaultEntrypoint") ?
    path.join(
      path.dirname(process.execPath),
      "node_modules",
      "vile-bundler-audit") :
    path.join(__dirname, "..")

  return path.join(base_dir, "lib_ruby", "bundle_audit_to_json.rb")
}

const to_message = (advisory) => {
  const title = advisory.title
  const gem = advisory.gem
  if (!gem) return title

  const version = advisory.version
  const gem_info = `${gem} v${version} `
  const id = advisory.cve ? `CVE-${advisory.cve}` : `OSV-${advisory.osvdb}`
  const id_info = `${gem_info}(${id})\n`
  const patched = _.get(advisory, "patched_versions", []).join(", ")
  const unaffected = _.get(advisory, "unaffected_versions", []).join(", ")
  return `${id_info}` +
          `${title}\n` +
          `Patched: ${patched || "not yet"}\n` +
          `Unaffected: ${unaffected || "none"}`
}

const is_package_warning = (advisory) =>
  _.has(advisory, "gem")

const signature = (advisory) =>
  is_package_warning(advisory) ?
    `bundler-audit::${advisory.gem}::${advisory.version}::` +
      `${advisory.cve || advisory.osvdb || advisory.title}` :
    `bundler-audit::${advisory.title}`

const link_or_id = (advisory) =>
  _.get(advisory, "url",
    _.get(advisory, "cve",
      _.get(advisory, "osvdb")))

const into_vile_issues = (advisories) =>
  advisories.map((advisory) => {
    const struct = {
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
const sanitize_invalid_json_output = (stdout) =>
  stdout.replace(BEFORE_JSON, "")
        .replace(AFTER_JSON, "")

const bundle_audit = (plugin_config) => {
  const update_db = _.get(plugin_config, "update_db", false)
  const ignore_advisories = _.get(plugin_config, "ignore_advisories", [])
  const args = [
    bundle_audit_to_json(),
    update_db.toString(),
    ignore_advisories.join(",")
  ]
  return vile
    .spawn("ruby", { args: args })
    .then((data) => {
      const stdout = sanitize_invalid_json_output(_.get(data, "stdout", ""))
      const issues = stdout ? to_json(stdout) : []
      return issues
    })
}

const punish = (plugin_data) =>
  bundle_audit(_.get(plugin_data, "config", {}))
    .then(into_vile_issues)

module.exports = {
  punish: punish
}
