// This function is to initialize the application
function init() {
    // init data
    dataHandler.init();
    // loads the boards to the screen
    // dom.loadBoards();
    // createBoardForm();
    dom.init();
    if (document.getElementById( "registerBtn" )) {
        document.getElementById( "registerBtn" ).addEventListener("click", function() {
        if (this.innerHTML == "Register"){
            this.innerHTML = "Log in";
            document.getElementById( "loginBtn" ).innerHTML = "Register";
            document.getElementById( "formTitle" ).innerHTML = "Register";
            document.getElementById( "signin" ).setAttribute("action", "/register");
        }
        else {
            this.innerHTML = "Register";
            document.getElementById( "loginBtn" ).innerHTML = "Log in";
            document.getElementById( "formTitle" ).innerHTML = "Log in";
            document.getElementById( "signin" ).setAttribute("action", "/signin");
        }

    });
    }
}

init();

