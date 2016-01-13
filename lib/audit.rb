require "bundler/audit/scanner"
require "manowar"

define "Vile::Plugin"

# TODO: support ignoring advisories
# TODO: support updating database automatically
# TODO: submit JSON format output to bundler-audit gem and remove this
module Vile::Plugin::BundlerAudit
  extend self

  def check
    bundler_audit
  end

  private_class_method def bundler_audit
    issues = []

    Bundler::Audit::Scanner.new.scan do |result|
      case result
      when Bundler::Audit::Scanner::InsecureSource
        issues.push source_uri_issue(result)
      when Bundler::Audit::Scanner::UnpatchedGem
        issues.push gem_issue(result)
      end
    end

    issues
  end

  private_class_method def source_uri_issue result
    {
      title: "Insecure Source URI: #{result.source}"
    }
  end

  private_class_method def gem_issue result
    advisory = result.advisory
    gem = result.gem

    {
      gem: gem.name,
      version: gem.version,
      title: advisory.title,
      url: advisory.url,
      cve: advisory.cve,
      osvdb: advisory.osvdb,
      patched_versions: advisory.patched_versions,
      unaffected_versions: advisory.unaffected_versions
    }
  end
end
