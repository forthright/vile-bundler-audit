# vile-bundler-audit [![Circle CI](https://circleci.com/gh/forthright/vile-bundler-audit.svg?style=svg&circle-token=3b75ecc1b75f4ec0dfe397388cf40f3594c2944b)](https://circleci.com/gh/forthright/vile-bundler-audit)

[![score-badge](https://vile.io/api/v0/users/brentlintner/vile-bundler-audit/badges/score?token=uFywUmzZfbg6UboLzn6R)](https://vile.io/~brentlintner/vile-bundler-audit) [![security-badge](https://vile.io/api/v0/users/brentlintner/vile-bundler-audit/badges/security?token=uFywUmzZfbg6UboLzn6R)](https://vile.io/~/brentlintner/vile-bundler-audit) [![coverage-badge](https://vile.io/api/v0/users/brentlintner/vile-bundler-audit/badges/coverage?token=uFywUmzZfbg6UboLzn6R)](https://vile.io/~/brentlintner/vile-bundler-audit) [![dependency-badge](https://vile.io/api/v0/users/brentlintner/vile-bundler-audit/badges/dependency?token=uFywUmzZfbg6UboLzn6R)](https://vile.io/~/brentlintner/vile-bundler-audit)

A [vile](http://github.com/brentlintner/vile) plugin for [bundler-audit](https://github.com/rubysec/bundler-audit).

## Requirements

- [nodejs](http://nodejs.org)
- [npm](http://npmjs.org)
- [ruby](http://ruby-lang.org)
- [rubygems](http://rubygems.org)

## Installation

Currently, you need to have `bundler-audit` installed manually.

Example:

    npm i vile-bundler-audit
    gem install bundler-audit

Note: A good strategy is to use [bundler](http://bundler.io).

## Config

```yml
bundler-audit:
  config:
    update_db: true # defaults to false
    ignore_advisories: [ ".." ]
```

## Architecture

This project is currently written in Ruby and JavaScript.

- `bin` houses any shell based scripts
- `src` is es6+ syntax compiled with [babel](https://babeljs.io)
- `lib` generated js library
- `lib_ruby` ruby shim code

## Hacking

    cd vile-bundler-audit
    npm install
    npm run dev
    npm test-all
