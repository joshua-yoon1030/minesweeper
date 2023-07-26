var board = [];
var rows = 16;
var columns = 16;

var minesCount = 30;
var minesLocation = [];

var tilesClicked = 0;
var flagsClicked = 0;
var flagEnabled = false;

var gameOver = false;

window.onload = function() {
    startGame();
}

function setMines(){
    let minesLeft = minesCount;
    while(minesLeft> 0){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)){
            minesLocation.push(id);
            minesLeft -=1;
        }
    }
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

    for(let r = 0; r < rows; r++){
        let row = [];
        for(let c = 0; c < columns; c++){
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            tile.addEventListener("auxclick", rightClickTile);
            tile.addEventListener("contextmenu", event => event.preventDefault());
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

}

function setFlag(){
    if(flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else{
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    console.log("default");
    if(gameOver || this.classList.contains("tile-clicked")){
        return;
    }
    let tile = this;
    if (flagEnabled){
        if (tile.innerText == ""){
            tile.innerText = "🚩";
            flagsClicked += 1
        }
        else if (tile.innerText == "🚩"){
            tile.innerText = "";
            flagsClicked -= 1
        }
        document.getElementById("mines-count").innerText = (minesCount - flagsClicked).toString();
        return;
    }
    if(tile.innerText == "🚩"){
        return;
    }

    if(minesLocation.includes(tile.id)){
        alert("Game over");
        gameOver = true;
        revealMines();
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r,c);
}

function clickTileTargeted(r,c){
    console.log("special");
    if( r < 0 || r >= rows || c < 0 || c>= columns){
        return;
    }
    if(gameOver || board[r][c].classList.contains("tile-clicked")){
        return;
    }
    if(board[r][c].innerText == "🚩"){
        return;
    }

    if(minesLocation.includes(board[r][c].id)){
        alert("Game over");
        gameOver = true;
        revealMines();
        return;
    }

    checkMine(r,c);
}


function rightClickTile(){
    if(gameOver){
        return;
    }

    let tile = this;

    if(!this.classList.contains("tile-clicked")){
        if (tile.innerText == ""){
            tile.innerText = "🚩";
            flagsClicked += 1
        }
        else if (tile.innerText == "🚩"){
            tile.innerText = "";
            flagsClicked -= 1
        }
        document.getElementById("mines-count").innerText = (minesCount - flagsClicked).toString();
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    let flagsFound = 0;
    
    flagsFound += isFlag(r-1, c-1);
    flagsFound += isFlag(r-1, c);
    flagsFound += isFlag(r-1, c+1);

    flagsFound += isFlag(r, c-1);
    flagsFound += isFlag(r, c+1);

    flagsFound += isFlag(r+1, c-1);
    flagsFound += isFlag(r+1, c);
    flagsFound += isFlag(r+1, c+1);

    if(flagsFound.toString() == tile.innerText){
        clickTileTargeted(r-1, c-1);
        clickTileTargeted(r-1, c);
        clickTileTargeted(r-1, c+ 1);

        clickTileTargeted(r, c-1);
        clickTileTargeted(r, c+1);

        clickTileTargeted(r+1, c-1);
        clickTileTargeted(r+1, c);
        clickTileTargeted(r+1, c+ 1);
    }

}

function isFlag(r,c){
    if( r < 0 || r >= rows || c < 0 || c>= columns){
        return 0;
    }
    if(board[r][c].innerText == "🚩"){
        return 1;
    } 
    return 0;
}

function revealMines() {
    for (let r = 0; r < rows; r ++){
        for (let c = 0; c < columns; c++){
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)){
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r,c){
    if( r < 0 || r >= rows || c < 0 || c>= columns){
        return;
    }

    if(board[r][c].classList.contains("tile-clicked") || board[r][c].innerText == "🚩"){
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;
    
    minesFound += checkTile(r-1, c-1);
    minesFound += checkTile(r-1, c);
    minesFound += checkTile(r-1, c+1);

    minesFound += checkTile(r, c-1);
    minesFound += checkTile(r, c+1);

    minesFound += checkTile(r+1, c-1);
    minesFound += checkTile(r+1, c);
    minesFound += checkTile(r+1, c+1);


    // Case of find something near

    if(minesFound > 0){
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    //case of nothing found
    else {
        checkMine(r-1, c-1);
        checkMine(r-1, c);
        checkMine(r-1, c+ 1);

        checkMine(r, c-1);
        checkMine(r, c+1);

        checkMine(r+1, c-1);
        checkMine(r+1, c);
        checkMine(r+1, c+ 1);
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }

}

function checkTile(r,c){
    if( r < 0 || r >= rows || c < 0 || c >= columns){
        return 0;
    }

    if (minesLocation.includes(r.toString() + "-" + c.toString())) { 
        return 1;
    }

    return 0;

}