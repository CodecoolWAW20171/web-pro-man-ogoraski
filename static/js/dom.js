// It uses data_handler.js to visualize elements
let dom = {
    init: function() {
        this.loadBoards();
        createBoardForm();
        this.resizeTextareas();
    },

    loadBoards: function() {
        // retrieves boards and makes showBoards called
        let boards = dataHandler.getBoards();
        setTimeout(function() {
            document.getElementById("boards").innerHTML = "";
            dom.showBoards(boards);
        }, 500);
    },

    showBoards: function(boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        
        // Top level container for all boards
        let boardsListContainer = document.getElementById("boards");

        boards.forEach(board => {
            // Container for a single board
            let boardListElement = document.createElement("div");
            boardListElement.className = "board-container";
            boardListElement.id = "board-" + board.id;
            
            //Top bar to control board
            let boardBar = document.createElement("div");
            boardBar.className = "board-bar";
            let boardHeader = document.createElement("h2");
            let boardTitle = document.createTextNode(board.title);
            let dropIcon = document.createElement("i");
            dropIcon.className = "fas fa-caret-down fa-2x arrow";
            let buttonAddCard = document.createElement("button");
            buttonAddCard.id = "add-card-" + board.id;
            buttonAddCard.className = "btn-hidden";
            buttonAddCard.innerHTML = "<i class=\"fas fa-plus\"></i> &nbsp;New card";
            
            boardsListContainer.appendChild(boardListElement);
            boardListElement.appendChild(boardBar);
            boardBar.appendChild(boardHeader);
            boardBar.appendChild(dropIcon);
            boardBar.appendChild(buttonAddCard);
            boardHeader.appendChild(boardTitle);

            // Board detailed container with statuses and cards
            let boardDetails = document.createElement("div");
            boardDetails.className = "board-details";
            boardDetails.style.height = 0;
            boardListElement.appendChild(boardDetails);
            
            let statusesContainer = document.createElement("div");
            statusesContainer.className = "row";
            boardDetails.appendChild(statusesContainer);

            let statuses = dataHandler.getStatuses();

            statuses.forEach(status => {
                let statusContainer = document.createElement("div");
                statusContainer.id = "b-" + board.id + "-status-" + status.id;
                statusContainer.setAttribute("data-board", board.id);
                statusContainer.setAttribute("data-status", status.id);
                statusContainer.className = "col-s-3";
                let statusHeader = document.createElement("h3");
                statusHeader.className = "status-title";
                let statusTitle = document.createTextNode(status.name);
                
                let cardsContainer = document.createElement("div");
                cardsContainer.id = "b-" + board.id + "-cards-" + status.id;
                cardsContainer.setAttribute("data-board", board.id);
                cardsContainer.setAttribute("data-status", status.id);
                cardsContainer.setAttribute("ondrop", "drop(event)");
                cardsContainer.setAttribute("ondragover", "allowDrop(event)");
                cardsContainer.className = "cards-container";

                statusesContainer.appendChild(statusContainer);
                statusContainer.appendChild(statusHeader);
                statusContainer.appendChild(cardsContainer);
                statusHeader.appendChild(statusTitle);
            });

            boardBar.addEventListener("click", function() {
                dom.hideBoards(boards, board.id);
                dom.toggleViewBoard(board.id);
            });
            dom.loadCards(board.id);
        });
        dom.resizeTextareas();
        createTaskBtn();
    },

    loadCards: function(boardId) {
        // retrieves cards and makes showCards called
        let cards = dataHandler.getCardsByBoardId(boardId);
        if (cards) {
            this.showCards(cards);
        }
    },

    showCards: function(cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let statuses = dataHandler.getStatuses();

        statuses.forEach(status => {
            let cardsContainer = document
                .getElementById("b-" + cards[0].board_id + "-cards-" + status.id);
            
            cards.forEach(card => {
                if (card.status_id === status.id) {
                    let cardContainer = document.createElement("div");
                    cardContainer.id = "card-" + card.id;
                    cardContainer.className = "card";
                    cardContainer.setAttribute("draggable", "true");
                    cardContainer.setAttribute("ondragstart", "drag(event)");
                    let cardText = document.createElement("textarea");
                    cardText.className = "edit-card";
                    cardText.setAttribute("rows", "1");
                    let cardTitle = document.createTextNode(card.title);
                    let submitCardButton = document.createElement("button");
                    submitCardButton.className = "btn-submit";
                    submitCardButton.innerHTML = "Save";
                    
                    cardsContainer.appendChild(cardContainer);
                    cardContainer.appendChild(cardText);
                    cardText.appendChild(cardTitle);
                    cardContainer.appendChild(submitCardButton);

                    cardText.addEventListener("focus", () => {
                        submitCardButton.style.display = "block";
                    });
                    cardText.addEventListener("blur", () => {
                        submitCardButton.style.display = "none";
                    });
                }
            });

            let newCardContainer = document.createElement("div");
            newCardContainer.className = "card-new";
            newCardContainer.innerHTML = "&nbsp;";

            cardsContainer.appendChild(newCardContainer);

        });
    },
    // here comes more features
    toggleViewBoard: function(boardId) {
        let board = dataHandler.getBoard(boardId);
        
        let boardContainer = document.getElementById("board-" + boardId);
        let boardDetails = boardContainer.getElementsByClassName("board-details")[0];

        board.is_active = !board.is_active;
        boardContainer.classList.toggle("open");

        if(board.is_active) {
            expandSection(boardDetails);
        } else {
            collapseSection(boardDetails);
        }
    },

    hideBoards: function(boards, board_id) {
        boards.forEach(board => {
            if (board.is_active && board.id !== board_id) {
                dom.toggleViewBoard(board.id);
            }
        });
    },

    hideModal: function(){
        let modal = document.getElementById("myModal");
        modal.style.display = "none";
        
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    },

    addNewBoard: function() {
        document.getElementById("new-board-btn").addEventListener("click", function() {
            dataHandler.createNewBoard(prompt("board name:"));
            location.reload();
        });
    },

    resizeTextareas: function() {
        var tx = document.getElementsByTagName("textarea");
        for (var i = 0; i < tx.length; i++) {
            tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
            tx[i].addEventListener("input", OnInput, false);
        }        
    }
};


// Collapse and expand animations
function collapseSection(element) {
    var sectionHeight = element.scrollHeight;
  
    var elementTransition = element.style.transition;
    element.style.transition = "";
    
    requestAnimationFrame(function() {
        element.style.height = sectionHeight + "px";
        element.style.transition = elementTransition;
      
        requestAnimationFrame(function() {
            element.style.height = 0 + "px";
        });
    });
}


function expandSection(element) {
    var sectionHeight = element.scrollHeight;
    
    element.style.height = sectionHeight + "px";
  
    element.addEventListener("transitionend", function() {
        element.removeEventListener("transitionend", arguments.callee);
      
        element.style.height = null;
    });   
}


function OnInput() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
}


// ------- Create functions --------
function createBoardForm() {
    document.getElementById("new-board").addEventListener("click", function() {
        let modal = document.getElementById("myModal"),
            closeBtn = document.getElementsByClassName("close")[0];
        
        displayForm(modal, closeBtn);
    });

    document.getElementById("new-board-title").addEventListener("input", function() {
        let input = document.getElementById("new-board-title").value;
        let submitBtn = document.getElementById("create-board");
        let caption = document.getElementById("input-caption");

        if (input.length > 2) {
            submitBtn.disabled = false;
            caption.style.display = "none";

            submitBtn.onclick = function() {
                dataHandler.createNewBoard(input);
                location.reload();
            };
        } else {
            submitBtn.disabled = true;
            submitBtn.onclick = function() {};
            caption.style.display = "block";
        }
    });
}


function createTaskBtn() {
    let modal = document.getElementById("myModal2"),
        closeBtn = document.getElementsByClassName("close")[1];

    document.querySelectorAll(".btn-hidden").forEach(function(cardBtn) {
        cardBtn.addEventListener("click", function() {
            document.getElementById("new-task-boardId").value = parseInt(cardBtn.id.slice(9));
            
            displayForm(modal, closeBtn);
        });
    });

    document.getElementById("new-task-title").addEventListener("input", function(){
        let input = document.getElementById("new-task-title").value,
            submitBtn = document.getElementById("create-task"),
            caption = document.getElementById("input-caption"),
            select = parseInt(document.getElementById("new-task-status").value),
            boardId = parseInt(document.getElementById("new-task-boardId").value);

        if (input.length > 2) {
            submitBtn.disabled = false;
            caption.style.display = "none";
            submitBtn.onclick = function() {
                dataHandler.createNewCard(input, boardId, select);
                location.reload();
            };
        } else {
            submitBtn.disabled = true;
            submitBtn.onclick = function() {};
            caption.style.display = "block";
        }
    });
}


function displayForm(modal, closeBtn) {
    modal.style.display = "block";
    
    closeBtn.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
    
}


// Drag and drop
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}


function drop(ev) {
    ev.preventDefault();
    if (ev.target.classList.contains("card-new")) {
        let cardId = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(cardId));
        let newStatus = ev.target.parentElement.dataset.status;
        let id = cardId.slice(5);
        let newTitle = ev.target.getElementsByClassName("edit-card")[ev.target.getElementsByClassName("edit-card").length-1].value
        dataHandler.updateCard(id, newTitle, newStatus);

    };
    
}


function allowDrop(ev) {
    ev.preventDefault();
}
