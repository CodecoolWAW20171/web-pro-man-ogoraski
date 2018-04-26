// This function is to initialize the application
function init() {
    // init data
    dataHandler.init();
    // loads the boards to the screen
    dom.loadBoards();
    document.getElementById("new-board").addEventListener("click", function() {
        dataHandler.createNewBoard(prompt("board name:"));
    });

}

init();
