require "multi_json"
require_relative "audit"

puts MultiJson.dump Vile::Plugin::BundlerAudit.check
