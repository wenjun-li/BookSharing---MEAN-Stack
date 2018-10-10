(function () {
    angular
        .module("WjlProject")
        .factory("RequestService", RequestService);

    function RequestService($http) {
        var api = {
            createRequest: createRequest,
            findRequestById: findRequestById,
            findRequestByLender: findRequestByLender,
            findRequestByBorrower: findRequestByBorrower,
            findRequestByBookId: findRequestByBookId,
            updateRequest: updateRequest,
            deleteRequestById: deleteRequestById,
            findRequestsByBookIds: findRequestsByBookIds,
            findAllRequests: findAllRequests
        };
        return api;

        function findRequestByBookId(bookId) {
            return $http.get("/api/request/book/" + bookId)
                .then(function (response) {
                    return response.data;
                });
        }
        
        function findAllRequests() {
            return $http.get("/api/request/")
                .then(function (response) {
                    return response.data;
                });
        }

        function findRequestsByBookIds(bookIds) {
            return $http.get("/api/requests?bookIds=" + bookIds)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateRequest(requestId, newRequest) {
            return $http.put("/api/request/" + requestId, newRequest)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteRequestById(requestId) {
            return $http.delete('/api/request/' + requestId)
                .then(function (response) {
                    return response.data;
                });
        }

        function findRequestByBorrower(borrowerId) {
            return $http.get("/api/request/borrower/" + borrowerId)
                .then(function (response) {
                    return response.data;
                });
        }

        function findRequestByLender(lenderId) {
            return $http.get("/api/request/lender/" + lenderId)
                .then(function (response) {
                    return response.data;
                });
        }

        function createRequest(newRequest) {
            return $http.post("/api/request/", newRequest)
                .then(function (response) {
                    return response.data;
                });
        }

        function findRequestById(requestId) {
            return $http.get("/api/request/" + requestId)
                .then(function (response) {
                    return response.data;
                });
        }

    }
})();