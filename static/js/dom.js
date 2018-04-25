// It uses data_handler.js to visualize elements
let dom = {
    loadBoards: function() {
        // retrieves boards and makes showBoards called
        this.showBoards(dataHandler.getBoards());
    },
    showBoards: function(boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let div = document.getElementById("boards");
        
        boards.forEach(board => {
            let button = document.createElement("BUTTON");
            let text = document.createTextNode(board.title); 
            button.appendChild(text);
            button.id = "board" + board.id;
            
            div.appendChild(button);
        });
    },
    loadCards: function(boardId) {
        // retrieves cards and makes showCards called
        this.showCards(dataHandler.getCardsByBoardId(boardId));
    },
    showCards: function(cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let status = document.getElementById("statuses");
        
        cards.forEach(card => {
            let div = document.createElement("div");
            let text = document.createTextNode(card.title); 
            div.appendChild(text);
            div.id = "card" + card.id;
            
            status.appendChild(div);
        });
    },
    // here comes more features
    ShowBoard: function(boardId) {
    }
}
