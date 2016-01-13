let path = require("path")
let _ = require("lodash")
let vile = require("@brentlintner/vile")
const Gemfile = "Gemfile"
const bundle_audit_to_json = path.join(
  __dirname, "..", "lib_ruby", "bundle_audit_to_json.rb"
)

let to_json = (string) =>
  _.attempt(JSON.parse.bind(null, string))

let to_message = (advisory) => {
  let title = advisory.title
  let gem = advisory.gem
  if (!gem) return title

  let version = advisory.version
  let gem_info = gem ? `${gem} v${version} ` : ""
  let id = advisory.cve ? `CVE-${advisory.cve}` : `OSV-${advisory.osvdb}`
  let id_info = id ? `(${id})\n` : ""
  let patched = _.get(advisory, "patched_versions", []).join(", ")
  let unaffected = _.get(advisory, "unaffected_versions", []).join(", ")
  return `${gem_info}${id_info}` +
          `${title}\n` +
          `Patched: ${patched || "not yet"}\n` +
          `Unaffected: ${unaffected || "none"}`
}

let is_source_uri_warning = (advisory) =>
  !_.has(advisory, "gem")

// TODO: use vile.DEPENDENCY when available
let issue_type = (advisory) =>
  is_source_uri_warning(advisory) ?
    vile.WARNING : vile.ERROR

let into_vile_issues = (advisories) =>
  advisories.map((advisory) =>
    vile.issue(
      issue_type(advisory),
      Gemfile,
      to_message(advisory)
    )
  )

let bundle_audit = () =>
  vile
    .spawn("ruby", { args: [ bundle_audit_to_json, "check" ] })
    .then((stdout) => stdout ? to_json(stdout) : [])

let punish = (plugin_data) =>
  bundle_audit()
    .then(into_vile_issues)

module.exports = {
  punish: punish
}
