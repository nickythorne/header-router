var should = require('chai').should;
var assert = require('chai').assert;
var headerRouter = require('../lib/headerRouter');

describe('router', function() {

    it('matches using single value predicate', function() {

        var routeHandlerCalled = false;
        headerRouter.newRule('content-type')
            .addPredicate({ value : 'text/html'})
            .routeTo(function(req, res, next) {
                routeHandlerCalled = true;
            });

        headerRouter.route()({ headers : { 'content-type' : 'text/html' } });
        assert.ok(routeHandlerCalled, 'Route handler called');

    });

    it('does not match when value predicate is case sensitive', function() {

        var routeHandlerCalled = false;
        headerRouter.newRule('token-bearer')
            .addPredicate({ value : 'john doe', caseSensitive : true })
            .routeTo(function(req, res, next) {
                routeHandlerCalled = true;
            });

        headerRouter.route()({ headers : { 'token-bearer' : 'John Doe' } });
        assert.notOk(routeHandlerCalled, 'Route handler not called');

    });

    it('matches single contains predicate', function() {

        var routeHandlerCalled = false;
        headerRouter.newRule('x-forwarded-with')
            .addPredicate({ contains : 'domain.com' })
            .routeTo(function(req, res, next) {
                routeHandlerCalled = true;
            });

        headerRouter.route()({ headers : { 'x-forwarded-with' : 'domain: http://www.domain.com; ' } });
        assert.ok(routeHandlerCalled, 'Route handler called');

    });

    it('matches single regex predicate', function() {

        var routeHandlerCalled = false;
        headerRouter.newRule('content-type')
            .addPredicate({ pattern : /(json)/ })
            .routeTo(function(req, res, next) {
                routeHandlerCalled = true;
            });

        headerRouter.route()({ headers : { 'content-type' : 'application/json; charset: utf8' } });
        assert.ok(routeHandlerCalled, 'Route handler called');

    });

    it('does not match using an invalid single regex', function() {

        var routeHandlerCalled = false;
        headerRouter.newRule('content-type')
            .addPredicate({ pattern : /(json)/ })
            .routeTo(function(req, res, next) {
                routeHandlerCalled = true;
            });

        headerRouter.route()({ headers : { 'content-type' : 'text/html; charset: utf8' } });
        assert.notOk(routeHandlerCalled, 'Route handler not called');

    });

    it('matches using multiple value predicates', function() {

        var routeHandlerCalled = false;
        headerRouter.newRule('accept-charset')
            .addPredicate({ value : 'ISO-8859' })
            .addPredicate({ value : 'UTF-8'})
            .addPredicate({ value : 'ASCII' })
            .routeTo(function(req, res, next) {
                routeHandlerCalled = true;
            });

        headerRouter.route()({ headers : { 'accept-charset' : 'UTF-8' } });
        assert.ok(routeHandlerCalled, 'Route handler not called');

    });

    it('matches using multiple mixed predicates', function() {

        var routeHandlerCalled = false;
        headerRouter.newRule('x-forwarded-host')
            .addPredicate({ pattern : /(maliciourdomain.com)/ })
            .addPredicate({ contains : 'badsite.net'})
            .addPredicate({ contains : 'happydomain.me'})
            .addPredicate({ value : 'evilattacker.org' })
            .routeTo(function(req, res, next) {
                routeHandlerCalled = true;
            });

        headerRouter.route()({ headers : { 'x-forwarded-host' : 'happydomain.me' } });
        assert.ok(routeHandlerCalled, 'Route handler not called');

    });

    it('continues router chain if no matches', function() {

        var routeHandlerCalled = false;
        headerRouter.newRule('x-forwarded-host2')
            .addPredicate({ value : 'evilattacker.org' })
            .routeTo(function(req, res, next) {

                var t = 7;
            });

        headerRouter.route()({ headers : { 'x-forwarded-host2' : 'happydomain.me' } }, null, function() {
            routeHandlerCalled = true;
        });

        assert.ok(routeHandlerCalled, 'Route handler not called');


    })

});