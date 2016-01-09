# vile-bundler-audit

A [vile](http://github.com/brentlintner/vile) plugin for
[bundler-audit]().

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

**TODO**

```yml
bundler-audit:
  config:
    update_db: false
    gemfile: alternative/path/Gemfile
    path: different/bundler/path
    retry: 3
    ignore: ["one", "two", "three"]
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
