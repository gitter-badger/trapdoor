var assert = require('chai').assert;
var hello = require('../index.js').hello;

describe("Hello", function() {
    describe("#helloWorld()", function() {
        assert.equal("Hello, world!", hello.helloWorld());
        assert.equal("Bonjour, tout le monde!", hello.helloWorld("Bonjour", "tout let monde"));
    });
});