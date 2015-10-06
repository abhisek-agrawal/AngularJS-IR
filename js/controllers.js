/*
 * Calaca - Search UI for Elasticsearch
 * https://github.com/romansanchez/Calaca
 * http://romansanchez.me
 * @rooomansanchez
 * 
 * v1.1.1
 * MIT License
 */

/* Calaca Controller
 *
 * On change in search box, search() will be called, and results are bind to scope as results[]
 *
*/
Calaca.controller('calacaCtrl', ['calacaService', '$scope', '$location', '$http', function(results, $scope, $location, $http){

        //Init empty array
        $scope.results = [];

        //Init offset
        $scope.offset = 0;

        //Errors and Messages from php call
        $scope.errors = [];
        $scope.msgs = [];

        var paginationTriggered;

        //On search, reinitialize array, then perform search and load results
        $scope.search = function(m){
            $scope.results = [];
            $scope.offset = m == 0 ? 0 : $scope.offset;//Clear offset if new query
            $scope.loading = m == 0 ? false : true;//Reset loading flag if new query

            if(m == -1 && paginationTriggered) {
                if ($scope.offset - maxResultsSize >= 0 ) $scope.offset -= maxResultsSize;
            }     
            if(m == 1 && paginationTriggered) {
                $scope.offset += maxResultsSize;
            }
            $scope.paginationLowerBound = $scope.offset + 1;
            $scope.paginationUpperBound = ($scope.offset == 0) ? maxResultsSize : $scope.offset + maxResultsSize;
            $scope.loadResults(m);

            $scope.errors.splice(0, $scope.errors.length); // remove all error messages
            $scope.msgs.splice(0, $scope.msgs.length);

        };

        //Load search results into array
        $scope.loadResults = function(m) {
            results.search($scope.query, m, $scope.offset).then(function(a) {

                // Modified function by Abhi

                var abhiList = $scope.query.split(" ");
                var tag = "abhi";
                var regex = RegExp(abhiList.join('|'), 'gi');
                var replacement = '<'+ tag +'>$&</'+ tag +'>';

                //Load results
                var i = 0;
                for(;i < a.hits.length; i++){
                    a.hits[i].text = a.hits[i].text.replace(regex, replacement);
                    $scope.results.push(a.hits[i]);
                }

                //Set time took
                $scope.timeTook = a.timeTook;

                //Set total number of hits that matched query
                $scope.hits = a.hitsCount;

                //Pluralization
                $scope.resultsLabel = ($scope.hits != 1) ? "results" : "result";

                //Check if pagination is triggered
                paginationTriggered = $scope.hits > maxResultsSize ? true : false;

                //Set loading flag if pagination has been triggered
                if(paginationTriggered) {
                    $scope.loading = true;
                }
            });
        };

        $scope.paginationEnabled = function() {
            return paginationTriggered ? true : false;
        }

        // Modified control by Abhisek

        $scope.rank = function(url, numRank) {

            $scope.errors.splice(0, $scope.errors.length); // remove all error messages
            $scope.msgs.splice(0, $scope.msgs.length);

            //alert("Query: "+$scope.query+ "\nAssessor: Abhisek Agrawal\nRank: " +numRank);

            $http.post('http://localhost/Calaca-master/js/post.php', {'query': $scope.query, 'assessor': "Abhisek Agrawal", 'url': url, 'rank': numRank}
            ).success(function(data, status, headers, config) {
                    if (data.msg != '') {
                        $scope.msgs.push(data.msg);
                    } else {
                        $scope.errors.push(data.error);
                    }
                }).error(function(data, status) { // called asynchronously if an error occurs or server returns response with an error status.
                    $scope.errors.push(status);
            });
        };


    }]
);

// Added a new filter for highlighting the query words

Calaca.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});