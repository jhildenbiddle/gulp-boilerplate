// Packages
// =============================================================================
var chai   = require('chai'),
    expect = chai.expect;

// Tests
// =============================================================================
describe('Demo Test', function() {
    describe('Values should equal themselves', function() {
        it('1 should equal 1', function() {
            expect(1).to.equal(1);
        });
        it('1 should not equal 2', function() {
            expect(1).to.not.equal(2);
        });
    });
});
