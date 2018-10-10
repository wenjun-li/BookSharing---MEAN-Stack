(function () {
    angular
        .module("WjlProject")
        .factory("BookService", BookService);

    function BookService($http) {
        var api = {
            addBook: addBook,
            findBookWithoutCurUserId: findBookWithoutCurUserId,
            findAllBooks: findAllBooks,
            findBookById: findBookById,
            findAllBookWithKeyword: findAllBookWithKeyword,
            findBookByName: findBookByName,
            findBookByAuthor: findBookByAuthor,
            findBookByISBN: findBookByISBN,
            findBookByOwnerId: findBookByOwnerId,
            updateBook: updateBook,
            deleteBookById: deleteBookById,
            deleteBookByOwnerId: deleteBookByOwnerId,
            findBooksByIds: findBooksByIds,
            findBookDetailsFromGoogle: findBookDetailsFromGoogle,
            adminUpdateBook: adminUpdateBook
        };
        return api;

        function adminUpdateBook(bookId, newBook) {
            return $http.put("/api/admin/bookUpdate/" + bookId, newBook)
                .then(function (response) {
                    return response.data;
                });
        }

        function findBookDetailsFromGoogle(isbn) {
            return $http.get("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn)
                .then(function (response) {
                    return response.data;
                });
        }


        function findBooksByIds(bookIds) {
            return $http.get("/api/books?bookIds=" + bookIds)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllBookWithKeyword(keyword) {
            return $http.get("/api/book?searchText=" + keyword)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllBooks() {
            return $http.get("/api/book/")
                .then(function (response) {
                    return response.data;
                });
        }
        
        function findBookWithoutCurUserId(userId) {
            return $http.get("/api/book/withoutOwner/" + userId)
                .then(function (response) {
                    return response.data;
                });
        }

        function findBookByOwnerId(ownerId) {
            return $http.get("/api/book/owner/" + ownerId)
                .then(function (response) {
                    return response.data;
                });
        }
        
        function addBook(book) {
            return $http.post("/api/book/", book)
                .then(function (response) {
                    return response.data;
                });
        }

        function findBookById(bookId) {
            return $http.get("/api/book/" + bookId)
                .then(function (response) {
                    return response.data;
                });
        }

        function findBookByISBN(isbn) {
            return $http.get("/api/book?isbn=" + isbn)
                .then(function (response) {
                    return response.data;
                });
        }

        function findBookByAuthor(author) {
            return $http.get("/api/book?author=" + author)
                .then(function (response) {
                    return response.data;
                });
        }

        function findBookByName(bookName) {
            return $http.get("/api/book?bookName=" + bookName)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateBook(bookId, newBook) {
            return $http.put("/api/book/" + bookId, newBook)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteBookById(bookId) {
            return $http.delete('/api/book/' + bookId)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteBookByOwnerId(ownerId) {
            return $http.delete('/api/book/owner/' + ownerId)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();