require "json"
require_relative "audit"

puts JSON.dump Vile::Plugin::BundlerAudit.check
