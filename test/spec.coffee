path = require "path"
mimus = require "mimus"
bundler_audit = mimus.require "./../lib", __dirname, []
chai = require "./helpers/sinon_chai"
util = require "./helpers/util"
vile = mimus.get bundler_audit, "vile"
expect = chai.expect

BUNDLE_AUDIT_TO_JSON = path.normalize path.join(
  __dirname, "..", "lib_ruby", "bundle_audit_to_json.rb")

BUNDLE_AUDIT_TO_JSON_PKGD = path.normalize path.join(
  path.dirname(process.execPath),
  "node_modules",
  "vile-bundler-audit",
  "lib_ruby",
  "bundle_audit_to_json.rb")

# TODO: write system tests for spawn -> cli -> bundler
# TODO: don't use setTimeout everywhere (for proper exception throwing)

describe "bundler-audit", ->
  afterEach mimus.reset
  after mimus.restore
  beforeEach ->
    mimus.stub vile, "spawn"
    util.setup vile

  describe "#punish", ->
    it "converts bundler-audit json to issues", ->
      bundler_audit
        .punish {}
        .should.eventually.eql util.issues

    it "handles an empty response", ->
      vile.spawn.reset()
      vile.spawn.returns new Promise (resolve) -> resolve ""

      bundler_audit
        .punish {}
        .should.eventually.eql []

    it "calls bundler-audit in the cwd", (done) ->
      bundler_audit
        .punish {}
        .should.be.fulfilled.notify ->
          setTimeout ->
            vile.spawn.should.have.been.calledWith(
              "ruby",
              args: [ BUNDLE_AUDIT_TO_JSON, "false", "" ])
            done()
      return

    describe "when bundled with pkg", ->
      beforeEach ->
        process.pkg = { defaultEntrypoint: ".." }
      afterEach ->
        process.pkg = undefined

      it "uses an alternative lib_ruby path", (done) ->
        bundler_audit
          .punish config: update_db: true
          .should.be.fulfilled.notify ->
            setTimeout ->
              vile.spawn.should.have.been.calledWith(
                "ruby",
                args: [ BUNDLE_AUDIT_TO_JSON_PKGD, "true", "" ])
              done()
        return

    it "passes the update_db option", (done) ->
      bundler_audit
        .punish config: update_db: true
        .should.be.fulfilled.notify ->
          setTimeout ->
            vile.spawn.should.have.been.calledWith(
              "ruby",
              args: [ BUNDLE_AUDIT_TO_JSON, "true", "" ])
            done()
      return

    it "passes the ignore list", (done) ->
      bundler_audit
        .punish config: ignore_advisories: [ "foo", "bar" ]
        .should.be.fulfilled.notify ->
          setTimeout ->
            vile.spawn.should.have.been.calledWith(
              "ruby",
              args: [ BUNDLE_AUDIT_TO_JSON, "false", "foo,bar" ])
            done()
      return
