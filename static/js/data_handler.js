// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
let dataHandler = {
    keyInLocalStorage: "proman-data", // the string that you use as a key in localStorage to save your application data
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _loadData: function() {
        // it is not called from outside
        // loads data from local storage, parses it and put into this._data property
        let jsonString = localStorage.getItem(this.keyInLocalStorage);

        if (jsonString != null) {
            this._data = JSON.parse(jsonString);
        } else {
            this._data = {
                "statuses": [],
                "boards": [],
                "cards": []
            };
        }
    },
    _saveData: function() {
        // it is not called from outside
        // saves the data from this._data to local storage
        localStorage.setItem(this.keyInLocalStorage, JSON.stringify(this._data));
    },
    init: function() {
        this._loadData();
    },
    getBoards: function(callback) {
        // the boards are retrieved and then the callback function is called with the boards
        let boards = this._data.boards;

        // for (let i = 0; i < boards.length; i++) {
        //     boards.is_active = false;
        // }
        if (typeof(boards) === "undefined") {
            console.log("There's no boards");
            return null;
        } else {
            if (callback) {
                return callback(boards);
            } else {
                return boards;
            }
        }
    },
    getBoard: function(boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
        let board = this.getBoards(function(boards) {
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
            console.log("There's no board with id " + boardId);
            return null;
        }
    },
    getStatuses: function(callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        let statuses = this._data.statuses;

        if (typeof(statuses) === "undefined") {
            console.log("There's no statuses");
            return null;
        } else {
            if (callback) {
                return callback(statuses);
            } else {
                return statuses;
            }
        }
    },
    getStatus: function(statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
        let status = this.getStatuses(function(statuses) {
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
            console.log("There's no status with id " + statusId);
            return null;
        }
    },
    getCardsByBoardId: function(boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        let cards = this._data.cards,
            results = [];

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].board_id == boardId) {
                results.push(cards[i]);
            }
        }

        if (results.length == 0) {
            console.log("There's no cards in board with id " + boardId);
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
    getCard: function(cardId, callback) {
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

        console.log("There's no card with id " + cardId);
        return null;
    },
    createNewBoard: function(boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        let boards = this._data.boards,
            lastId = boards[boards.length-1].id + 1;

        boards.push({
            "id": lastId,
            "title": boardTitle,
            "is_active": false
        });
        
        this._saveData();
        if (callback) {
            return callback(this._data);
        }
    },
    createNewCard: function(cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
        let cards = this._data.cards,
            lastId = cards[cards.length-1].id + 1;

        cards.push({
            "id": lastId,
            "title": cardTitle,
            "board_id": boardId,
            "status_id": statusId,
            "order": this.getLastCardsOrder(boardId)
        });

        this._saveData();
        if (callback) {
            return callback(this._data);
        }
    },
    // here comes more features
    getLastCardsOrder(boardId) {
        return this.getCardsByBoardId(boardId, function(cards) {
            let lastOrder = 0; 

            for (let i = 0; i < cards.length; i++) {
                if (lastOrder < cards[i].order) {
                    lastOrder = cards[i].order;
                    console.log(lastOrder);
                }
            }
            lastOrder++;

            return lastOrder;
        });
    }
};