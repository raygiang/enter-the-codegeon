function Maze() {
	ChallengeCanvas.call(this);

	this.boardArray = new Array(this.heightInTiles);
	for (let i = 0; i < this.boardArray.length; i++) {
		this.boardArray[i] = new Array(this.widthInTiles);
	}

	this.moveDelay = 250;

	// Function to initialize the stage
	this.initializeStage = (playerSpot, goalSpot, obstacles) => {
		// Initialize Player
		this.initializePlayer(parseInt(playerSpot[1]), parseInt(playerSpot[0]));
		this.player.playerImage.onload = () => {
			this.renderPlayer();
		}

		// Initialize Goal
		this.winningSquare = {
			row: parseInt(goalSpot[0]),
			column: parseInt(goalSpot[1]),
		};
		this.boardArray[this.winningSquare.row][this.winningSquare.column] = "win";

		//Initialize Obstacles
		for(let obstacle of obstacles) {
			if(!Array.isArray(obstacle)) obstacle = obstacle.split(',');
			if(obstacle[0] !== "") this.boardArray[obstacle[0]][obstacle[1]] = 'obs';
		}

		this.canvasRefresh();

		// 0 = up, 1=right, 2=down, 3=left
		// Move forward until an obstacle or a wall is hit
		this.player.move = async () => {
			let moveDistance = 0;

			switch (this.player.spriteSheetY) {
				case 0:
					while (this.player.yPosition - moveDistance > 0 &&
						this.boardArray[this.player.yPosition - moveDistance - 1][this.player.xPosition] !== "obs" &&
						this.boardArray[this.player.yPosition - moveDistance][this.player.xPosition] !== "win") {
						moveDistance++;
					}
					for (let i = 0; i < moveDistance; i++) {
						setTimeout(() => {
							this.moveFrame();
							this.player.yPosition--;
							this.canvasRefresh();
						}, this.moveDelay * i)
					}
					break;
				case 1:
					while (this.player.xPosition + moveDistance < this.widthInTiles - 1 &&
						this.boardArray[this.player.yPosition][this.player.xPosition + moveDistance + 1] !== "obs" &&
						this.boardArray[this.player.yPosition][this.player.xPosition + moveDistance] !== "win") {
						moveDistance++;
					}
					for (let i = 0; i < moveDistance; i++) {
						setTimeout(() => {
							this.moveFrame();
							this.player.xPosition++;
							this.canvasRefresh();
						}, this.moveDelay * i)
					}
					break;
				case 2:
					while (this.player.yPosition + moveDistance < this.heightInTiles - 1 &&
						this.boardArray[this.player.yPosition + moveDistance + 1][this.player.xPosition] !== "obs" &&
						this.boardArray[this.player.yPosition + moveDistance][this.player.xPosition] !== "win") {
						moveDistance++;
					}
					for (let i = 0; i < moveDistance; i++) {
						setTimeout(() => {
							this.moveFrame();
							this.player.yPosition++;
							this.canvasRefresh();
						}, this.moveDelay * i)
					}
					break;
				case 3:
					while (this.player.xPosition - moveDistance > 0 &&
						this.boardArray[this.player.yPosition][this.player.xPosition - moveDistance - 1] !== "obs" &&
						this.boardArray[this.player.yPosition][this.player.xPosition - moveDistance] !== "win") {
						moveDistance++;
					}
					for (let i = 0; i < moveDistance; i++) {
						setTimeout(() => {
							this.moveFrame();
							this.player.xPosition--;
							this.canvasRefresh();
						}, this.moveDelay * i)
					}
					break;
			}

			return new Promise((resolve, reject) => {
				setTimeout(() => { resolve(true) }, this.moveDelay * moveDistance);
			});
		};
	};

	this.renderObstacles = () => {
		for (let i = 0; i < this.boardArray.length; i++) {
			let innerArray = this.boardArray[i];
			for (let j = 0; j < innerArray.length; j++) {
				this.context.fillStyle = "red";
				if (this.boardArray[i][j] === "obs") {
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
	this.canvasRefresh = function (customWidth = null) {
		if(customWidth) {
			this.canvas.width = customWidth;
		}
		else {
			if (window.innerWidth < 1200) {
				this.canvas.width = window.innerHeight / 1.5 < window.innerWidth / 2 ? window.innerHeight / 1.5 : window.innerWidth / 2;
			}
			else {
				this.canvas.width = window.innerHeight / 1.5 < 600 ? window.innerHeight / 1.5 : 600;
			}
		}

		this.gridSize = this.canvas.width / this.widthInTiles;
		if (this.player) {
			this.player.gridSize = this.gridSize;
		}

		this.canvas.height = this.gridSize * this.heightInTiles;

		this.drawGrid();

		this.renderObstacles(this.boardArray);

		if(this.winningSquare) this.renderWinningSquare();

		if(this.player) this.renderPlayer();
	};

	this.moveFrame = () => {
		if (this.player.currFrame === this.player.animationFrames.length - 1) {
			this.player.currFrame = 0;
		}
		else {
			this.player.currFrame++;
		}
	};

	// Rotate player left (1) or right (0)
	this.rotatePlayer = async (direction) => {
		// turn clockwise
		if (direction === 0) {
			this.player.spriteSheetY = (this.player.spriteSheetY + 1) % 4;
		}
		// turn counterclockwise
		if (direction === 1) {
			this.player.spriteSheetY--;
			if (this.player.spriteSheetY === -1) {
				this.player.spriteSheetY = 3;
			}
		}

		this.canvasRefresh();

		return new Promise((resolve, reject) => {
			setTimeout(() => { resolve(true) }, this.moveDelay);
		});
	};

	// Move player by executing a list of moves in a sequence
	this.movePlayer = async (moveList) => {
		let moveArray = [];

		for (let move of moveList) {
			switch (move) {
				case "0":
					await this.rotatePlayer(1);
					break;
				case "1":
					await this.player.move();
					break;
				case "2":
					await this.rotatePlayer(0);
					break;
			}
		}

		return true;
	};

	this.canvasRefresh();
}