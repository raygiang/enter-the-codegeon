function MazeBuilder() {
	ChallengeCanvas.call(this);

	this.hasPlayer = false;
	this.hasGoal = false;

	this.boardArray = new Array(this.heightInTiles);
	for(let i=0; i<this.boardArray.length; i++) {
		this.boardArray[i] = new Array(this.widthInTiles);
	}

	this.updateGrid = function(hoveredX, hoveredY) {
		let gridX = Math.floor(hoveredX / this.gridSize);
		let gridY = Math.floor(hoveredY / this.gridSize);

		this.canvasRefresh();
		this.context.fillStyle = "rgb(255,255,0,0.1)";
		this.context.fillRect(gridX * this.gridSize, gridY * this.gridSize, this.gridSize, this.gridSize);
	};

	this.renderObstacles = function(boardArray) {
		for(let i=0; i<boardArray.length; i++) {
			let innerArray = boardArray[i];
			for(let j=0; j<innerArray.length; j++) {
				this.context.fillStyle = "orange";
				if(boardArray[i][j] === "obs") {
					this.context.fillRect(
						j * this.gridSize, 
						i * this.gridSize,
						this.gridSize,
						this.gridSize
					);
				}
			}
		}
	};

	this.renderWinningSquare = () => {
		this.context.fillStyle = "blue";
		this.context.fillRect(
			this.winningSquare.column * this.gridSize, 
			this.winningSquare.row * this.gridSize,
			this.gridSize,
			this.gridSize
		);
	};

	// method used to resize the canvas and redraw the grid accordingly
	this.canvasRefresh = function() {
		if(window.innerWidth < 1200) {
			this.canvas.width = window.innerWidth / 2;
		}
		else {
			this.canvas.width = 1200 / 2;
		}

		this.gridSize = this.canvas.width / this.widthInTiles;
		if(this.player) {
			this.player.gridSize = this.gridSize;
		}

		this.canvas.height = this.gridSize * this.heightInTiles;

		this.drawGrid();

		this.renderObstacles(this.boardArray);

		if(this.winningSquare) this.renderWinningSquare();

		if(this.player) this.renderPlayer();
	};

	this.checkWinnable = (boardArray, moveList) => {
		let result;
		let newMoveList;
		let solution = [];

		if(boardArray[this.player.yPosition][this.player.xPosition] === "win") {
			return moveList;
		}

		for(let i=0; i<4; i++) {
			let moveDistance = 0;
			switch(i) {
				case 0:
					newMoveList = [...moveList, 1];
					break;
				case 1:
					newMoveList = [...moveList, 2, 1];
					this.player.spriteSheetY = (this.player.spriteSheetY + i) % 4;
					break;
				case 2:
					newMoveList = [...moveList, 2, 2, 1];
					this.player.spriteSheetY = (this.player.spriteSheetY + i) % 4;
					break;
				case 3:
					newMoveList = [...moveList, 0, 1];
					this.player.spriteSheetY = (this.player.spriteSheetY + i) % 4;
					break;
			}

			switch(this.player.spriteSheetY) {
				case 0:
					while(this.player.yPosition - moveDistance > 0 && 
							boardArray[this.player.yPosition - moveDistance - 1][this.player.xPosition] !== "obs" &&
							boardArray[this.player.yPosition - moveDistance][this.player.xPosition] !== "win") {
						moveDistance++;
					}
					this.player.yPosition = this.player.yPosition - moveDistance;

					if(boardArray[this.player.yPosition][this.player.xPosition] !== true) {
						if(boardArray[this.player.yPosition][this.player.xPosition] !== "win") {
							boardArray[this.player.yPosition][this.player.xPosition] = true;
						}
						result = this.checkWinnable(boardArray, newMoveList);
						if(result) {
							if(solution.length === 0 || result.length < solution.length) { solution = result };
						}
						if(boardArray[this.player.yPosition][this.player.xPosition] !== "win") {
							boardArray[this.player.yPosition][this.player.xPosition] = null;
						}
					}

					this.player.yPosition = this.player.yPosition + moveDistance;

					break;
				case 1:
					while(this.player.xPosition + moveDistance < this.widthInTiles - 1 && 
							boardArray[this.player.yPosition][this.player.xPosition + moveDistance + 1] !== "obs" &&
							boardArray[this.player.yPosition][this.player.xPosition + moveDistance] !== "win") {
						moveDistance++;
					}
					this.player.xPosition = this.player.xPosition + moveDistance;

					if(boardArray[this.player.yPosition][this.player.xPosition] !== true) {
						if(boardArray[this.player.yPosition][this.player.xPosition] !== "win") {
							boardArray[this.player.yPosition][this.player.xPosition] = true;
						}
						result = this.checkWinnable(boardArray, newMoveList);
						if(result) {
							if(solution.length === 0 || result.length < solution.length) { solution = result };
						}
						if(boardArray[this.player.yPosition][this.player.xPosition] !== "win") {
							boardArray[this.player.yPosition][this.player.xPosition] = null;
						}
					}

					this.player.xPosition = this.player.xPosition - moveDistance;
					
					break;
				case 2:
					while(this.player.yPosition + moveDistance < this.heightInTiles - 1 && 
							boardArray[this.player.yPosition + moveDistance + 1][this.player.xPosition] !== "obs" &&
							boardArray[this.player.yPosition + moveDistance][this.player.xPosition] !== "win") {
						moveDistance++;
					}
					this.player.yPosition = this.player.yPosition + moveDistance;

					if(boardArray[this.player.yPosition][this.player.xPosition] !== true) {
						if(boardArray[this.player.yPosition][this.player.xPosition] !== "win") {
							boardArray[this.player.yPosition][this.player.xPosition] = true;
						}
						result = this.checkWinnable(boardArray, newMoveList);
						if(result) {
							if(solution.length === 0 || result.length < solution.length) { solution = result };
						}
						if(boardArray[this.player.yPosition][this.player.xPosition] !== "win") {
							boardArray[this.player.yPosition][this.player.xPosition] = null;
						}
					}

					this.player.yPosition = this.player.yPosition - moveDistance;
					
					break;
				case 3:
					while(this.player.xPosition - moveDistance > 0 && 
							boardArray[this.player.yPosition][this.player.xPosition - moveDistance - 1] !== "obs" &&
							boardArray[this.player.yPosition][this.player.xPosition - moveDistance] !== "win") {
						moveDistance++;
					}
					this.player.xPosition = this.player.xPosition - moveDistance;

					if(boardArray[this.player.yPosition][this.player.xPosition] !== true) {
						if(boardArray[this.player.yPosition][this.player.xPosition] !== "win") {
							boardArray[this.player.yPosition][this.player.xPosition] = true;
						}
						result = this.checkWinnable(boardArray, newMoveList);
						if(result) {
							if(solution.length === 0 || result.length < solution.length) { solution = result };
						}
						if(boardArray[this.player.yPosition][this.player.xPosition] !== "win") {
							boardArray[this.player.yPosition][this.player.xPosition] = null;
						}
					}

					this.player.xPosition = this.player.xPosition + moveDistance;
					
					break;
			}
			this.player.spriteSheetY = (this.player.spriteSheetY + (4-i)) % 4;
		}

		return solution.length === 0 ? false : solution;
	};

	this.checkSubmittable = () => {
		return this.hasPlayer && this.hasGoal;
	};

	this.addObject = (objectType, hoveredX, hoveredY, messages) => {
		let gridX = Math.floor(hoveredX / this.gridSize);
		let gridY = Math.floor(hoveredY / this.gridSize);

		if(objectType === "3") {
			if(!this.boardArray[gridY][gridX]) {
				messages.innerHTML = "Nothing to remove here!";
				messages.style.color = "red";
			}
			else if(this.boardArray[gridY][gridX] === "win") {
				this.boardArray[gridY][gridX] = null;
				this.winningSquare = null;
				this.hasGoal = false;
				messages.innerHTML = "Goal square has been removed!";
				messages.style.color = "green";
				this.canvasRefresh();
			}
			else if(this.boardArray[gridY][gridX] === "player") {
				this.boardArray[gridY][gridX] = null;
				this.player = null;
				this.hasPlayer = false;
				messages.innerHTML = "Player starting spot has been removed!";
				messages.style.color = "green";
				this.canvasRefresh();
			}
			else {
				this.boardArray[gridY][gridX] = null;
				messages.innerHTML = "Obstacle has been removed!";
				messages.style.color = "green";
				this.canvasRefresh();
			}
		}
		else if(this.boardArray[gridY][gridX]) {
			messages.innerHTML = "This spot is already taken";
			messages.style.color = "red";
		}
		else {
			switch(objectType) {
				case "0":
					if(this.winningSquare) this.boardArray[this.winningSquare.row][this.winningSquare.column] = null;
					this.winningSquare = {
						row: gridY,
						column: gridX
					};
					this.boardArray[gridY][gridX] = "win";
					messages.innerHTML = "Goal square has been added!";
					messages.style.color = "green";
					this.hasGoal = true;
					this.canvasRefresh();
					break;
				case "1":
					if(this.player) this.boardArray[this.player.yPosition][this.player.xPosition] = null;
					this.initializePlayer(gridX, gridY);
					this.boardArray[gridY][gridX] = "player";
					messages.innerHTML = "Player has been added!";
					messages.style.color = "green";
					this.canvasRefresh();
					this.hasPlayer = true;
					break;
				case "2":
					this.boardArray[gridY][gridX] = "obs";
					messages.innerHTML = "Obstacle has been added!";
					messages.style.color = "green";
					this.canvasRefresh();
					break;
			}
		}
	};
}