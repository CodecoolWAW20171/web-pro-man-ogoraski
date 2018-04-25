// It uses data_handler.js to visualize elements
let dom = {
    loadBoards: function() {
        // retrieves boards and makes showBoards called
        let boards = dataHandler.getBoards();
        setTimeout(function() {
            document.getElementById("loading").style.display = "none";
            dom.showBoards(boards);
        }, 500);
    },
    showBoards: function(boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boardsListContainer = document.getElementById("boards");

        boards.forEach(board => {
            let boardListElement = document.createElement("div");
            boardListElement.className = "board-container";
            boardListElement.id = "board-" + board.id;
            let boardBar = document.createElement("div");
            boardBar.className = "board-bar";
            let boardHeader = document.createElement("h3");
            let boardTitle = document.createTextNode(board.title);
            let dropIcon = document.createElement("i");
            dropIcon.className = "fas fa-caret-down fa-2x";
            
            boardsListContainer.appendChild(boardListElement);
            boardListElement.appendChild(boardBar);
            boardBar.appendChild(boardHeader);
            boardBar.appendChild(dropIcon);
            boardHeader.appendChild(boardTitle);

            let boardDetails = document.createElement("div");
            boardDetails.className = "board-details";
            boardListElement.appendChild(boardDetails);
            
            let statusesContainer = document.createElement("div");
            statusesContainer.className = "row";
            boardDetails.appendChild(statusesContainer);

            let statuses = dataHandler.getStatuses();

            statuses.forEach(status => {
                let stausHeader = document.createElement("div");
                stausHeader.id = "status-" + status.id;
                stausHeader.className = "col-3 status-title";
                let statusTitle = document.createTextNode(status.name);
                statusesContainer.appendChild(stausHeader);
                stausHeader.appendChild(statusTitle);
            });

            boardBar.addEventListener("click", function() {
                dom.toggleViewBoard(board.id);
            });
        });
    },
    loadCards: function(boardId) {
        // retrieves cards and makes showCards called
        
    },
    showCards: function(cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
    toggleViewBoard: function(boardId) {
        let board = dataHandler.getBoard(boardId);
        let boardContainer = document.getElementById("board-" + board.id);
        let boardDetails = boardContainer.getElementsByClassName("board-details")[0];
        board.is_active = !board.is_active;
        boardContainer.classList.toggle("open");
        if (board.is_active) {
            boardDetails.style.display = "block";
        } else {
            boardDetails.style.display = "none";
        }
    },
};
