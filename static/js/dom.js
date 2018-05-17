// It uses data_handler.js to visualize elements
let dom = {
    init: function () {
        let afterLoad = function () {
            createBoardForm();
            createCardBtn();
            shareBoardBtn();
            dom.resizeTextareas();
        };
        this.loadBoards(afterLoad);
    },

    loadBoards: function (callback) {
        // retrieves boards and makes showBoards called
        let boards = dataHandler.getBoards();
        if (boards) {
            setTimeout(function () {
                document.getElementById("boards").innerHTML = "";
                dom.showBoards(boards, callback);
            }, 500);
        }
    },

    showBoards: function (boards, callback) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        // Top level container for all boards
        let boardsListContainer = document.getElementById("boards");

        boards.forEach((board) => {

            let boardContainer = dom.buildBoard(board);
            boardsListContainer.appendChild(boardContainer);

            let statuses = dataHandler.getStatuses();

            statuses.forEach((status) => {

                let listsContainer = document
                    .getElementById("board-" + board.id)
                    .getElementsByClassName("row")[0];
                let listContainer = dom.buildList(status, board.id);
                listsContainer.appendChild(listContainer);
            });

            let boardBar = boardContainer.firstChild;
            boardBar.addEventListener("click", function () {
                dom.hideBoards(boards, board.id);
                dom.toggleViewBoard(board.id);
            });

            let buttonAddCard =
                document.getElementById("add-card-" + board.id);
            let buttonShareBoard =
                document.getElementById("share-board-" + board.id);
            buttonAddCard.addEventListener("click", function (event) {
                event.stopPropagation();
            });
            buttonShareBoard.addEventListener("click", function (event) {
                event.stopPropagation();
            });

            dom.loadCards(board.id);
        });
        callback();
    },

    buildBoard: function (board) {
        // Container for a single board
        var boardContainer = document.createElement("div");
        boardContainer.id = "board-" + board.id;
        boardContainer.className = "board-container";

        // Top bar to control board
        let boardBar = document.createElement("div");
        boardBar.className = "board-bar";
        let boardHeader = document.createElement("h2");
        let boardTitle = document.createTextNode(board.title);
        let dropIcon = document.createElement("i");
        dropIcon.className = "fas fa-caret-down fa-2x arrow";

        boardContainer.appendChild(boardBar);
        boardBar.appendChild(boardHeader);
        boardBar.appendChild(dropIcon);

        boardHeader.appendChild(boardTitle);

        // Add new card button
        let buttonAddCard = document.createElement("button");
        buttonAddCard.id = "add-card-" + board.id;
        buttonAddCard.className = "btn-hidden";
        buttonAddCard.innerHTML = "<i class=\"fas fa-plus\"></i> &nbsp;New card";
        buttonAddCard.setAttribute("data-board-id", board.id);

        boardBar.appendChild(buttonAddCard);

        let modalAddCart = document.getElementById("myModal2"),
            addCardCloseBtn = document.getElementsByClassName("close")[1];

        buttonAddCard.addEventListener("click", function () {
            let submitBtn = document.getElementById("create-task");
            document.getElementById("new-task-boardId").value = board.id;
            submitBtn.onclick = function () {
                let input = document.getElementById("new-task-title");
                let select = parseInt(document.getElementById("new-task-status").value);
                dataHandler.createNewCard(input.value, board.id, select);
            };
            displayForm(modalAddCart, addCardCloseBtn);
        });

        // Add new share board button
        let buttonShareBoard = document.createElement("button");
        buttonShareBoard.id = "share-board-" + board.id;
        buttonShareBoard.className = "btn-hidden";
        buttonShareBoard.innerHTML = "<i class=\"fas fa-share-alt\"></i> &nbsp;Share board";
        buttonShareBoard.setAttribute("data-board-id", board.id);

        boardBar.appendChild(buttonShareBoard);

        let modalShareBoard = document.getElementById("myModal3"),
            shareBoardCloseBtn= document.getElementsByClassName("close")[2];

        buttonShareBoard.addEventListener("click", function () {
            document.getElementById("share-boardId").value = board.id;
            displayForm(modalShareBoard, shareBoardCloseBtn);
        });

        // Add delete board button
        let deleteBoardBtn = document.createElement("button");
        deleteBoardBtn.id = "delete-board" + board.id;
        deleteBoardBtn.className = "btn-hidden";
        deleteBoardBtn.innerHTML = "<i class=\"fas fa-trash-alt\"></i> &nbsp;Delete board";
        deleteBoardBtn.setAttribute("data-board-id", board.id);
        deleteBoardBtn.addEventListener("click", function () {
            dataHandler.removeBoard(board.id)
            board = document.getElementById(`board-${board.id}`)
            board.remove()
        })

        boardBar.appendChild(deleteBoardBtn);

        buttonShareBoard.addEventListener("click", function () {
            displayForm(modalShareBoard, shareBoardCloseBtn);
        });

        // Board detailed container with statuses and cards
        let boardDetails = document.createElement("div");
        boardDetails.className = "board-details";
        boardDetails.style.height = 0;
        boardContainer.appendChild(boardDetails);

        if (board.is_active) {
            boardContainer.classList.add("open");
            boardDetails.style.height = null;
        }

        // Lists container
        let listsContainer = document.createElement("div");
        listsContainer.className = "row";
        boardDetails.appendChild(listsContainer);

        return boardContainer;
    },

    buildList: function (list, board_id) {
        // List container
        var listContainer = document.createElement("div");
        listContainer.className = "col-s-3";
        listContainer.setAttribute("data-board", board_id);
        listContainer.setAttribute("data-list", list.id);

        // List header
        let listHeader = document.createElement("h3");
        listHeader.className = "list-title";
        let listTitle = document.createTextNode(list.name);

        // Cards container
        let cardsContainer = document.createElement("div");
        cardsContainer.id = "board-" + board_id + "-list-" + list.id;
        cardsContainer.className = "cards-container";
        cardsContainer.setAttribute("data-board", board_id);
        cardsContainer.setAttribute("data-list", list.id);
        cardsContainer.setAttribute("ondrop", "drop(event)");
        cardsContainer.setAttribute("ondragover", "allowDrop(event)");

        listContainer.appendChild(listHeader);
        listContainer.appendChild(cardsContainer);
        listHeader.appendChild(listTitle);

        return listContainer;
    },

    buildCard: function (card) {
        let cardContainer = document.createElement("div");
        cardContainer.id = "card-" + card.id;
        cardContainer.className = "card";
        cardContainer.setAttribute("draggable", "true");
        cardContainer.setAttribute("ondragstart", "drag(event)");
        let cardText = document.createElement("textarea");
        cardText.className = "edit-card";
        cardText.setAttribute("rows", "1");
        let cardTitle = document.createTextNode(card.title);

        // Save edit button
        let submitCardButton = document.createElement("button");
        submitCardButton.className = "btn-submit";
        submitCardButton.innerHTML = "Save";

        // Delete button
        let deleteCardButton = document.createElement("button");
        deleteCardButton.className = "btn-delete";
        deleteCardButton.innerHTML = "Delete";

        cardContainer.appendChild(cardText);
        cardText.appendChild(cardTitle);
        cardContainer.appendChild(submitCardButton);
        cardContainer.appendChild(deleteCardButton);

        return cardContainer;
    },

    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        let cards = dataHandler.getCardsByBoardId(boardId);
        if (cards) {
            this.showCards(cards);
        }
    },

    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let board_id = cards[0].board_id;
        let cardsContainers = document
            .getElementById("board-" + board_id)
            .getElementsByClassName("cards-container");
        [].forEach.call(cardsContainers, (cardsContainer) => {
            cards.forEach((card) => {
                if (card.status_id === parseInt(cardsContainer.dataset.list)) {
                    let cardContainer = dom.buildCard(card);
                    cardsContainer.appendChild(cardContainer);

                    let cardText = cardContainer
                        .getElementsByTagName("textarea")[0];
                    let submitCardButton = cardContainer
                        .getElementsByClassName("btn-submit")[0];
                    cardText.addEventListener("focus", () => {
                        submitCardButton.style.display = "inline-block";
                    });
                    cardText.addEventListener("blur", () => {
                        submitCardButton.style.display = "none";
                    });
                    cardContainer.addEventListener("dragstart", () => {
                        submitCardButton.style.display = "none";
                    });
                    let deleteCardButton = cardContainer
                        .getElementsByClassName("btn-delete")[0];
                    cardText.addEventListener("focus", () => {
                        deleteCardButton.style.display = "inline-block";
                    });
                    cardText.addEventListener("blur", () => {
                        deleteCardButton.style.display = "none";
                    });
                    cardContainer.addEventListener("dragstart", () => {
                        deleteCardButton.style.display = "none";
                    });

                }
            });
            window.addEventListener("dragstart", () => {
                let height = cardsContainer.offsetHeight + 40;
                cardsContainer.style.height = height + "px";
                cardsContainer.classList.add("dragarea");
            });
            window.addEventListener("dragend", () => {
                cardsContainer.style.height = null;
                cardsContainer.classList.remove("dragarea");
            });
        });

    },
    // here comes more features
    toggleViewBoard: function (boardId) {
        let board = dataHandler.getBoard(boardId);

        let boardContainer = document.getElementById("board-" + boardId);
        let boardDetails = boardContainer.getElementsByClassName("board-details")[0];

        board.is_active = !board.is_active;
        boardContainer.classList.toggle("open");

        if (board.is_active) {
            expandSection(boardDetails);
        } else {
            collapseSection(boardDetails);
        }
    },

    hideBoards: function (boards, board_id) {
        boards.forEach(board => {
            if (board.is_active && board.id !== board_id) {
                dom.toggleViewBoard(board.id);
            }
        });
    },

    createBoardForm: function () {
        document.getElementById("new-board").addEventListener("click", function () {
            dom.buildModal(dom.modals[0], () => {
                let modal = document.getElementById("myModal");
                let closeBtn = modal.getElementsByClassName("close")[0];

                dom.displayForm(modal, closeBtn);
            });
        });
    },

    createCardForm: function () {
        document.querySelectorAll(".btn-hidden").forEach((cardBtn) => {
            cardBtn.addEventListener("click", function () {
                dom.buildModal(dom.modals[1], () => {
                    let modal = document.getElementById("myModal");
                    let closeBtn = modal.getElementsByClassName("close")[0];

                    dom.displayForm(modal, closeBtn);
                });
            });
        });
    },

    modals: [
        {
            "type": "board",
            "title": "Create new board",
            "label": "Board title",
            "caption": "* Required (minimum 3 characters)",
        },
        {
            "type": "card",
            "title": "Create new card",
            "label": "Card title",
            "caption": "* Required",
        }
    ],

    buildModal: function (modalData, callback) {
        let modalContent = document.getElementById("myModal")
            .getElementsByClassName("modal-content")[0];
        // Clear existing modal data
        modalContent.innerHTML = "";

        // Build header with title
        let modalHTML = [
            `<h2>${modalData.title}</h2>`,
            `<label for="new-title">${modalData.label}</label>`,
            `<input type="text" name="new-title" id="new-${modalData.type}-title">`,
            `<span class="input-caption">${modalData.caption}</span>`
        ];
        modalContent.innerHTML = modalHTML.join();
        modalHTML = [
            `<div class="row-btn">`,
            `<button id="create-${modalData.type}" disabled>Create</button>`,
            `<button class="close btn-flat">Cancel</button>`,
            `</div>`
        ];
        modalContent.innerHTML += modalHTML.join();

        if (callback) {
            callback();
        }
    },

    displayModal: function (modal, closeBtn) {
        // let modal = document.getElementById("myModal");
        // let closeBtn = document.getElementsByClassName("close")[0];
        modal.style.display = "block";

        closeBtn.onclick = function () {
            modal.style.display = "none";
        };

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    },

    hideModal: function (modalId) {
        let modal = document.getElementById(modalId);
        modal.style.display = "none";

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    },

    validateInput: function (modalData, inLength) {
        document.getElementById("new-" + modalData.type + "-title")
            .addEventListener("input", function () {
                let input = document.getElementById("new-board-title").value;
                let submitBtn = document.getElementById("create-board");
                let caption = document.getElementsByClassName("input-caption");
                let captionText = caption.innerHTML;

                if (input.length >= inLength) {
                    submitBtn.disabled = false;
                    caption.innerHTML = "&nbsp;";

                    submitBtn.onclick = function () {
                        dataHandler.createNewBoard(input);
                    };
                } else {
                    submitBtn.disabled = true;
                    submitBtn.onclick = function () {
                    };
                    caption.innerHTML = captionText;
                }
            });

    },

    resizeTextareas: function () {
        var tx = document.getElementsByTagName("textarea");
        for (var i = 0; i < tx.length; i++) {
            tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
            tx[i].addEventListener("input", setHeightOnInput, false);
        }
    },

};


// Collapse and expand animations
function collapseSection(element) {
    var sectionHeight = element.scrollHeight;

    var elementTransition = element.style.transition;
    element.style.transition = "";

    requestAnimationFrame(function () {
        element.style.height = sectionHeight + "px";
        element.style.transition = elementTransition;

        requestAnimationFrame(function () {
            element.style.height = 0 + "px";
        });
    });
}


function expandSection(element) {
    var sectionHeight = element.scrollHeight;

    element.style.height = sectionHeight + "px";

    element.addEventListener("transitionend", function () {
        element.removeEventListener("transitionend", arguments.callee);

        element.style.height = null;
    });
}


function setHeightOnInput() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
}


// ------- Create functions --------

function createBoardForm() {
    document.getElementById("new-board").addEventListener("click", function () {
        let modal = document.getElementById("myModal"),
            closeBtn = document.getElementsByClassName("close")[0];

        displayForm(modal, closeBtn);
    });

    let input = document.getElementById("new-board-title");
    let submitBtn = document.getElementById("create-board");
    let caption = document.getElementsByClassName("input-caption")[0];

    enterClick(input, submitBtn);

    input.addEventListener("input", function () {
        if (input.value.length > 2) {
            submitBtn.disabled = false;
            caption.innerHTML = "&nbsp;";
        } else {
            submitBtn.disabled = true;
            caption.innerHTML = "* Required (minimum 3 characters)";
        }
    });

    submitBtn.onclick = function () {
        dataHandler.createNewBoard(input.value);
    };
}


function createCardBtn() {
    /*let modal = document.getElementById("myModal2"),
        closeBtn = document.getElementsByClassName("close")[1];

    let buttons = document.getElementsByClassName("btn-hidden");

    [].forEach.call(buttons, (cardBtn) => {
        cardBtn.addEventListener("click", function() {
            document.getElementById("new-task-boardId").value = cardBtn.dataset.boardId;
            console.log(document.getElementById("new-task-boardId").value);
            displayForm(modal, closeBtn);
        });
    });*/

    let input = document.getElementById("new-task-title");
    let submitBtn = document.getElementById("create-task");
    let caption = document.getElementsByClassName("input-caption")[1];

    enterClick(input, submitBtn);

    input.addEventListener("input", function () {
        if (input.value.length > 2) {
            submitBtn.disabled = false;
            caption.innerHTML = "&nbsp;";
        } else {
            submitBtn.disabled = true;
            caption.innerHTML = "* Required (minimum 3 characters)";
        }
    });


}


function shareBoardBtn() {
    let input = document.getElementById("share-with-username");
    let submitBtn = document.getElementById("share-board");
    let caption = document.getElementsByClassName("input-caption")[2];

    enterClick(input, submitBtn);

    input.addEventListener("input", function () {
        if (input.value.length > 2) {
            submitBtn.disabled = false;
            caption.innerHTML = "&nbsp;";
        } else {
            submitBtn.disabled = true;
            caption.innerHTML = "* Required (minimum 3 characters)";
        }
    });

    submitBtn.addEventListener("click", function () {
        let board_id = document.getElementById("share-boardId").value,
            data = {"username": input.value, "board_id": board_id};
        dataHandler.shareBoard(data);
    });
}


function displayForm(modal, closeBtn) {
    modal.style.display = "block";

    closeBtn.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

}


// Drag and drop
function drag(ev) {
    var dt = ev.dataTransfer;
    dt.setData("text", ev.target.id);
}


function drop(ev) {
    ev.preventDefault();
    if (ev.target.classList.contains("dragarea")) {
        let cardId = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(cardId));
        let newStatus = ev.target.parentElement.dataset.list;
        let id = cardId.slice(5);
        let newTitle = ev.target.getElementsByClassName("edit-card")[ev.target.getElementsByClassName("edit-card").length - 1].value;
        dataHandler.updateCard(id, newTitle, newStatus);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}


function enterClick(elem, btn) {
    elem.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            btn.click();
        }
    });
}