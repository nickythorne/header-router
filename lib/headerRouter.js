var HeaderRuleBuilder = require('./headerRuleBuilder');

var HeaderRouter = function() {
    this.headerRules = {};
};

HeaderRouter.prototype.newRule = function(header) {
    return new HeaderRuleBuilder(header, this);
};

HeaderRouter.prototype.route = function(request, response, next) {

    var headerRules = this.headerRules;

    return function(request, response, next) {

        var requestHeaders = request.headers;
        var rulesHeaderKeys = Object.keys(headerRules);

        for(var i = 0; i < rulesHeaderKeys.length; i++) {

            var headerName = rulesHeaderKeys[i];
            var ruleDataList = headerRules[headerName];
            var matchedRequestHeader = requestHeaders[headerName];

            if(matchedRequestHeader) {

                for(var j = 0; j < ruleDataList.length; j++) {

                    var ruleData = ruleDataList[j];
                    if(headerName && ruleMatches(ruleData.predicates, matchedRequestHeader)) {
                        ruleData.handler(request, response, next);
                        return;
                    }

                }

            }

        }

        if(next) next();

    };

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