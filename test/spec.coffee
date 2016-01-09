path = require "path"
mimus = require "mimus"
bundler_audit = mimus.require "./../lib", __dirname, []
chai = require "./helpers/sinon_chai"
util = require "./helpers/util"
vile = mimus.get bundler_audit, "vile"
expect = chai.expect

BUNDLE_AUDIT_TO_JSON = path.normalize path.join(
  __dirname, "..", "bin", "bundle-audit-to-json"
)

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
              BUNDLE_AUDIT_TO_JSON,
              args: [ "check" ]
            )
            done()
