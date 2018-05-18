// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
let dataHandler = {
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _loadData: function () {
        // it is not called from outside
        // loads data from local storage, parses it and put into this._data property
        // let jsonString = localStorage.getItem(this.keyInLocalStorage);

        // if (jsonString != null) {
        //     this._data = JSON.parse(jsonString);
        // } else {
        //     this._data = {
        //         "statuses": [],
        //         "boards": [],
        //         "cards": []
        //     };
        // }
        if (document.getElementById("username")) {
            let xhr = new XMLHttpRequest();
            let username = document.getElementById("username").value;

            xhr.open("GET", "/api/data/" + username, true);
            xhr.addEventListener('load', function (event) {
                dataHandler._data = JSON.parse(event.target.response)
                dom.init()
            })
            xhr.send();
        }
    },

    init: function () {
        this._loadData();
    },

    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards
        let boards = this._data.boards;

        if (typeof(boards) === "undefined") {
            return null;
        } else {
            if (callback) {
                return callback(boards);
            } else {
                return boards;
            }
        }
    },

    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
        let board = this.getBoards(function (boards) {
            for (let i = 0; i < boards.length; i++) {
                if (boards[i].id === boardId) {
                    if (callback) {
                        return callback(boards[i]);
                    } else {
                        return boards[i];
                    }
                }
            }
        });
        if (board) {
            return board;
        } else {
            return null;
        }
    },

    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        let statuses = this._data.statuses;

        if (typeof(statuses) === "undefined") {
            return null;
        } else {
            if (callback) {
                return callback(statuses);
            } else {
                return statuses;
            }
        }
    },

    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
        let status = this.getStatuses(function (statuses) {
            for (let i = 0; i < statuses.length; i++) {
                if (statuses[i].id == statusId) {
                    if (callback) {
                        return callback(statuses[i]);
                    } else {
                        return statuses[i];
                    }
                }
            }
        });
        if (status) {
            return status;
        }
        else {
            return null;
        }
    },

    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        let cards = this._data.cards,
            results = [];

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].board_id == boardId) {
                results.push(cards[i]);
            }
        }

        if (results.length == 0) {
            return null;
        }
        else {
            if (callback) {
                return callback(results);
            }
            else {
                return results;
            }
        }
    },

    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
        let cards = this._data.cards;

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].id == cardId) {
                if (callback) {
                    return callback(cards[i]);
                }
                else {
                    return cards[i];
                }
            }
        }

        return null;
    },

    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        let boards = this._data.boards;
        let lastId;

        if (boards.length > 0) {
            lastId = boards[boards.length - 1].id + 1;
        } else {
            lastId = 1;
        }

        boards.forEach(board => {
            board.is_active = false;
        });

        boards.push({
            "id": lastId,
            "title": boardTitle,
            "is_active": true
        });

        if (callback) {
            return callback(this._data);
        }
    },

    createNewCard: function (cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
        let cards = this._data.cards;
        let lastId;

        if (cards.length > 0) {
            lastId = cards[cards.length - 1].id + 1;
        } else {
            lastId = 1;
        }

        this._data.boards.forEach(board => {
            if (board.id === parseInt(boardId)) {
                board.is_active = true;
            } else {
                board.is_active = false;
            }
        });

        cards.push({
            "id": lastId,
            "title": cardTitle,
            "board_id": boardId,
            "status_id": statusId,
            "order": this.getLastCardsOrder(boardId)
        });

        if (callback) {
            return callback(this._data);
        }
    },

    // here comes more features
    getLastCardsOrder(boardId) {
        return this.getCardsByBoardId(boardId, function (cards) {
            let lastOrder = 0;

            for (let i = 0; i < cards.length; i++) {
                if (lastOrder < cards[i].order) {
                    lastOrder = cards[i].order;
                }
            }
            lastOrder++;

            if (lastOrder) {
                return lastOrder;
            }
            else {
                return 1;
            }

        });
    },

    updateCard: function (id, newTitle, newStatus, callback) {
        // creates new card, saves it and calls the callback function with its data
        let card = this.getCard(id);
        let cards = this._data.cards;
        cards[parseInt(id) - 1] = {
            "id": parseInt(id),
            "title": newTitle,
            "board_id": parseInt(card.board_id),
            "status_id": parseInt(newStatus),
            "order": card.order
        };

        if (callback) {
            return callback(this._data);
        }
        // DB
        let xhttp = new XMLHttpRequest();
        let data = {'newTitle': newTitle, 'newStatus': newStatus, 'id': id}
        let dataJson = JSON.stringify(data)
        xhttp.open("POST", "/update", true);
        xhttp.send(dataJson);
    },

    shareBoard: function (data) {
        var XHR = new XMLHttpRequest();
        var FD = new FormData();

        for (name in data) {
            FD.append(name, data[name]);
        }

        XHR.addEventListener('load', function (event) {
            document.getElementById('share-board-info').innerHTML = "Board shared!";
            document.getElementById('share-board-info').style.display = "table";
        });

        XHR.open('POST', '/share-board');
        XHR.send(FD);
    },
    removeBoard(boardID) {
        board = this.getBoard(boardID)
        index = this._data.boards.indexOf(board)
        if (index > -1) {
            this._data.boards.splice(index, 1);
        }

        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", `/delete-board/${boardID}`, true);
        xhttp.send();
    },
    removeCard(cardID) {
        card = this.getCard(cardID)
        index = this._data.cards.indexOf(card)
        if (index > -1) {
            this._data.cards.splice(index, 1);
        }
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", `/delete-card/${cardID}`, true);
        xhttp.send();
    }
};