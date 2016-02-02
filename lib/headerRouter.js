var HeaderRuleBuilder = require('./headerRuleBuilder');

var HeaderRouter = function() {
    this.headerRules = {};
};

HeaderRouter.prototype.newRule = function(header) {
    return new HeaderRuleBuilder(header, this);
};

HeaderRouter.prototype.route = function(request, response, next) {

    var requestHeaders = request.headers;
    var rulesHeaderKeys = Object.keys(this.headerRules);

    for(var i = 0; i < rulesHeaderKeys.length; i++) {

        var ruleData = this.headerRules[rulesHeaderKeys[i]];
        var requestHeader = requestHeaders[ruleData.headerName];

        if(requestHeader && ruleMatches(ruleData.predicates, requestHeader)) {
            ruleData.handler(request, response, next);
            return;
        }

    }

    if(next) next();

};

function ruleMatches(rulePredicates, requestHeader) {

    for(var i = 0; i < rulePredicates.length; i++) {

        var matches = false;
        var predicate = rulePredicates[i];

        if(predicate.value) {
            matches = (predicate.caseSensitive) ?
                (requestHeader === predicate.value) :
                (requestHeader.toLowerCase() === predicate.value.toLowerCase());
        }

        if(!matches && predicate.contains) {
            matches = (predicate.caseSensitive) ?
                (requestHeader.indexOf(predicate.contains) > -1) :
                (requestHeader.toLocaleString().indexOf(predicate.contains) > -1);
        }

        if(!matches && predicate.pattern) {
            matches = predicate.pattern.test(requestHeader);
        }

        if(matches) {
            return true;
        }

    }

}

module.exports = new HeaderRouter();