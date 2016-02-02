var HeaderRuleBuilder = function(headerName, router) {

    this.headerRule = {
        headerName : headerName.toLowerCase(),
        predicates : [],
        handler : null
    };

    this.addPredicate = function(predicateObject) {

        if(!(predicateObject.value || predicateObject.pattern || predicateObject.contains)) {
            throw Error('Invalid Header Rule Predicate. Supported predicate types are value or pattern.')
        }

        if(predicateObject.pattern && !(predicateObject.pattern instanceof RegExp)) {
            throw Error('Invalid Pattern predicate. Pattern needs to be a valid Regular Expression.')
        }

        this.headerRule.predicates.push(predicateObject);

        return this;
    };

    this.routeTo = function(routeHandler) {
        this.headerRule.handler = routeHandler;
        router.headerRules[this.headerRule.headerName] = this.headerRule;

        return router;
    };

    return this;

};

module.exports = HeaderRuleBuilder;