# vile-bundler-audit [![Circle CI](https://circleci.com/gh/forthright/vile-bundler-audit.svg?style=shield&circle-token=3b75ecc1b75f4ec0dfe397388cf40f3594c2944b)](https://circleci.com/gh/forthright/vile-bundler-audit) [![score-badge](https://vile.io/api/v0/projects/vile-bundler-audit/badges/score?token=USryyHar5xQs7cBjNUdZ)](https://vile.io/~brentlintner/vile-bundler-audit) [![coverage-badge](https://vile.io/api/v0/projects/vile-bundler-audit/badges/coverage?token=USryyHar5xQs7cBjNUdZ)](https://vile.io/~brentlintner/vile-bundler-audit) [![dependency-badge](https://vile.io/api/v0/projects/vile-bundler-audit/badges/dependency?token=USryyHar5xQs7cBjNUdZ)](https://vile.io/~brentlintner/vile-bundler-audit)

A [Vile](http://github.com/brentlintner/vile) plugin for auditing your Gemfile for
known vulnerabilities and insecure sources (via [bundler-audit](https://github.com/rubysec/bundler-audit)).

## Requirements

- [Node.js](http://nodejs.org)
- [Ruby](http://ruby-lang.org)

## Installation

Currently, you need to have `bundler-audit` installed manually.

Example:

    npm i vile-bundler-audit
    gem install bundler-audit

## Usage

    vile a -p bundler-audit

## Config

```yaml
bundler-audit:
  config:
    update_db: true # defaults to false
    ignore_advisories: [ ".." ]
```

## Versioning

This project uses [Semver](http://semver.org).

## Licensing

This project is licensed under the [MPL-2.0](LICENSE) license.

Any contributions made to this project are made under the current license.

## Contributions

Current list of [Contributors](https://github.com/forthright/vile-bundler-audit/graphs/contributors).

Any contributions are welcome and appreciated!

All you need to do is submit a [Pull Request](https://github.com/forthright/vile-bundler-audit/pulls).

1. Please consider tests and code quality before submitting.
2. Please try to keep commits clean, atomic and well explained (for others).

### Issues

Current issue tracker is on [GitHub](https://github.com/forthright/vile-bundler-audit/issues).

Even if you are uncomfortable with code, an issue or question is welcome.

### Code Of Conduct

By participating in this project you agree to our [Code of Conduct](CODE_OF_CONDUCT.md).

### Maintainers

- Brent Lintner - [@brentlintner](http://github.com/brentlintner)

## Architecture

This project is currently written in Ruby and JavaScript.

- `bin` houses any shell based scripts
- `src` is es6+ syntax compiled with [Babel](https://babeljs.io)
- `lib` generated js library
- `lib_ruby` ruby shim code

## Developing

    cd vile-bundler-audit
    npm install
    gem install rspec
    npm run dev
    npm test-all
