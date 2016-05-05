source "https://rubygems.org"

ruby "2.3.1"

group :default do
  gem "bundler-audit", "~> 0.5"
  gem "bundler", "~> 1.11"
  gem "multi_json", "~> 1.11"
end

group :development do
  gem "rubocop", require: false
  gem "reek", require: false
  gem "rubycritic", require: false
end

group :development, :test do
  gem "awesome_print"
  gem "pry"
  gem "pry-byebug"
  gem "rspec"
  gem "simplecov", require: false
  gem "simplecov-lcov", require: false
  gem "simplecov-html", require: false
end
