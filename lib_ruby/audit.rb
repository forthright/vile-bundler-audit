require "bundler/audit/scanner"

# TODO: support ignoring advisories
# TODO: submit JSON format output to bundler-audit gem and remove this
module Vile
  module Plugin
    module BundlerAudit
      extend self

      def check
        update_audit_database if update_db?
        audit
      end

      private_class_method def update_audit_database
        if Bundler::Audit::Database.update! == false
          raise Exception.new "Failed updating ruby-advisory-db!"
        end
      end

      private_class_method def audit
        issues = []

        Bundler::Audit::Scanner.new.scan(ignore: ignore_advisories) do |result|
          case result
          when Bundler::Audit::Scanner::InsecureSource
            issues.push source_uri_issue(result)
          when Bundler::Audit::Scanner::UnpatchedGem
            issues.push gem_issue(result)
          end
        end

        issues
      end

      private_class_method def update_db?
        ARGV[0] == "true"
      end

      private_class_method def ignore_advisories
        ARGV[1].to_s.split(",") || []
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
  end
end
