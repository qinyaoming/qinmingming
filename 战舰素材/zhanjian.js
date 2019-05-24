var view = {
  displayMessage: function (msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  },
  //displaySunk: function (location) {
    //var cell = document.getElementById(location);
    //cell.setAttribute("class", "issunked");
  //}
};


view.displayMessage("欢迎来到战舰游戏！");


var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  ships: [{locations: [0, 0, 0], hits: ["", "", ""], issunked: "" },
          {locations: [0, 0, 0], hits: ["", "", ""], issunked: "" },
          {locations: [0, 0, 0], hits: ["", "", ""], issunked: "" }],
  fire: function (guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("你击中了战舰!");
        if (this.isSunk(ship)) {
          view.displayMessage("击中了!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("打不到！");
    return false;
  },


  isSunk: function (ship) {
    var count = 0
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        count++
      }
    }
    if (count > this.shipLength * 0.66) {
      return true;
    } 
      return false;
  },


  generateShipLocations: function () {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },


  generateShip: function () {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },


  collision: function (locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
};


  var controller = {
    guesses: 0,
    processGuess: function (event) {
      var location = event.target.id;
      if (location) {
        this.guesses++;
        var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        alert("你击中了所有的战舰! Game over!");
      }
    }
  }
};



function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board.");
  } else {
    firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);
    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.");
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
      alert("Oops, that's off the board!");
    } else {
      return row + column;
    }
  }
  return null;
};


function init() {
  var theTD = document.getElementsByTagName("td");
  console.log(theTD)
  for (var i = 0; i < theTD.length; i++) {
    theTD[i].onclick = controller.processGuess;
  }

  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  model.generateShipLocations();
}


function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);
  console.log(model.ships)
  guessInput.value = "";
};


function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
};


window.onload = init;