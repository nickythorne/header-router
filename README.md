Header Based Routing
====================

`header-router` is a Node.js express module for routing requests based on predefined header matching patterns.

Installation
------------

    $ npm install header-router --save

Basic Usage
-----------

Header Router is designed to be used with express, however it may be suited to any other routing based framework.

The below example configures a single rule to match content-type headers that have a value of image/*.


    var router = require('express').Router();
    var headerRouter = require('header-router');

    headerRouter.newRule('content-type')
        .addPredicate({ pattern : /image\/(\w+)/ })
        .routeTo(function(req, res, next) {
            // process req.body image payload
            res.json({ success : true, type : 'image' });
        });

    router.use(headerRouter.route());


The `headerRouter.route()` method can also be used as a request handler directly, instead of middleware:

`router.put('/save', headerRouter.route());`

The advantage of using the `route()` as middleware, is that you can define a default handler if no request matches the pre-defined rules.

    var router = require('express').Router();
    var headerRouter = require('header-router');

    headerRouter.newRule('content-type')
        .addPredicate({ value :'application/json' })
        .routeTo(function(req, res, next) {
            //process json payload
            res.json({ success : true, type : 'json' });
        });

    router.use(headerRouter.route());

    router.save('/save', function(req, res, next) {
        // If not request doesn't have content-type: application/json, fallback to this handler
        res.json({ success : true, type : 'none' });
    });

