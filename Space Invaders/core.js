
    function startFunc() {
      	var player;
      	var rotationDegree = 0;
      	var SPEED = 4;
	var moveRight = true;
	var aliensXRow = 11;	
	var numAliens = 32;
	var alienDim = 25;
	var HSPACEALIENS = 12;
	var VSPACEALIENS = 10;
	var ALIENSPEED = 20;
	var DEFAULTTICK = 29;
	var tick = DEFAULTTICK; 
	var screenWidth = 500;
	var screenHeight = 500;
	var PLAYERBULLETSPEED = 9;
	var ALIENBULLETSPEED = 5;
	var timeToShoot = 0;
      	var fps = document.getElementById("fps");
      	var aliens = new jaws.SpriteList();
      	var aliensBullet = undefined;
	var playerBullet = undefined;

	function getRandomInt () {
		min = 0;
		max = aliens.length - 1;
		console.log("Aliens Shooting: I will destroy your planet!");
    		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	function setupAliens() {
		var row = 0;
		var z = 0;
		playerBullet = undefined;
		aliensBullet = undefined;
		for (var i = 0;i<=numAliens;i++) {
			if(i%aliensXRow==0)
				row++;
			z = i%aliensXRow;
			aliens.push(new jaws.Sprite({image: "alieno.png", 
					x: (z*(alienDim+HSPACEALIENS)),
					y:((row*(20+VSPACEALIENS))+50), anchor: "top_left"}));
		}
	}


	function aliensStepDown() {
		for(var i = 0;i<aliens.length;i++) {
			aliens.at(i).y += 18;
		}	
	}

	function aliensShoot() {
		if(aliensBullet == undefined) {
			rndInt = getRandomInt();
			aliensBullet = new jaws.Sprite({image:"proiettile.png",
				x: (aliens.at(rndInt).x + 30),y: (aliens.at(rndInt).y) + 30, anchor: "top_left"}); 
		}
	}

	function playerShoot() {
		if(playerBullet==undefined)
			playerBullet = new jaws.Sprite({image:"proiettile.png",x: (player.x + 18),y: player.y,anchor: "top_left"});
	}

	function anyPlayerBulletCollisions() {
		if(playerBullet.y < 0 ) /// è uscito dallo schermo
			return true;
		return false;
	}

	function anyAlienBulletCollisions() {
		if(aliensBullet.y > screenHeight)
			return true;
		return false;
	}

	function moveBullets() {
		if(playerBullet!=undefined) { //Tank shooted a bullet!
			playerBullet.y -= PLAYERBULLETSPEED;
			if(anyPlayerBulletCollisions()) {
				playerBullet = undefined;
			}
		}
		if(aliensBullet!=undefined) {
			aliensBullet.y += ALIENBULLETSPEED;
			if(anyAlienBulletCollisions()) {
				aliensBullet = undefined;
			}
		}
	}

	function drawBullets() {
		if(playerBullet!=undefined) {
			playerBullet.draw();
		}
		if(aliensBullet!=undefined) {
			aliensBullet.draw();
		}
	}

	
      	function moveAliens() {
		tick --;
		if (tick > 0)
			return;
		tick = DEFAULTTICK;
		timeToShoot++;
		if(timeToShoot == 5) {
			timeToShoot = 0;
			aliensShoot();
		}
		if(moveRight) {
			for (var i = 0;i<aliens.length;i++) {
				aliens.at(i).x+=ALIENSPEED ;	
			}
		} else {
			for (var i = 0;i<aliens.length;i++) {
				aliens.at(i).x-=ALIENSPEED ;	
			}
		}

		//any aliens arrive to the border
		for(var i = 0;i<aliens.length;i++) {
			if(aliens.at(i).x<15 || aliens.at(i).x>screenWidth-40) {
				moveRight = moveRight?false:true;
				aliensStepDown();
				break;
			}
		}
	}

	function drawAliens() {
		aliens.draw();
	}

      /* Called once when a game state is activated. Use it for one-time setup code. */
      this.setup = function() {
	player = new jaws.Sprite({image: "carro.png", x: 220, y: 450, anchor: "top_left" }) ;
      	setupAliens();
        jaws.context.mozImageSmoothingEnabled = false;  // non-blurry, blocky retro scaling
        jaws.preventDefaultKeys(["up", "down", "left", "right", "space"]);
      }

      /* update() will get called each game tick with your specified FPS. Put game logic here. */
      this.update = function() {
        if(jaws.pressed("left"))  { player.x-=SPEED; }
        if(jaws.pressed("right")) { player.x+=SPEED; }
        if(jaws.pressed("up"))    { playerShoot();}
        if(jaws.pressed("down"))  { }
        //forceInsideCanvas(player)
	if(playerCollide()){
		player.x = 10000;
		DEFAULTTICK = 5;
	}
	aliens.removeIf(removeIfCollide); 
	aliens.updateLength();
	changeSpeed();
        fps.innerHTML = jaws.game_loop.fps ;
	moveAliens();
	moveBullets();
      }
	
	function changeSpeed() {
		if(aliens.lengt > 26)
			return;
		if(aliens.length >18)
			DEFAULTTICK = aliens.length;
/*		if(aliens.length < 25 && DEFAULTTICK > 25) {
			DEFAULTTICK = 20;
		}*/
	}
      function playerCollide() {
		if(aliensBullet == undefined)
			return false;
		if(player.rect().collideRect(aliensBullet.rect())) {
			aliensBullet = undefined;
			return true;
		}
		return false;
      }

      function removeIfCollide(item) {
		if(playerBullet == undefined)
			return false;
		if(item.rect().collideRect(playerBullet.rect())) {
			playerBullet=undefined;	
			return true;
      		}
		return false;
	}
      /* Directly after each update draw() will be called. Put all your on-screen operations here. */
      this.draw = function() {
        jaws.context.clearRect(0,0,jaws.width,jaws.height);
     /*   jaws.context.lineWidth = 1;
	jaws.context.moveTo(0,5);
	jaws.context.lineTo(jaws.width,5);
	jaws.context.stroke();
	jaws.context.moveTo(499,5);
	jaws.context.lineTo(499,499);
	jaws.context.stroke();
	jaws.context.moveTo(0,5);
	jaws.context.lineTo(0,499);
	jaws.context.stroke();
	jaws.context.moveTo(0,500);
        jaws.context.lineTo(jaws.width,500);
        jaws.context.strokeStyle = "black";
        jaws.context.stroke();*/
        
        jaws.log(player);
        player.draw();
	drawAliens();
	drawBullets();
      }
    
      /* Force given item's x/y to stay within canvas borders */
      function forceInsideCanvas(item) {
        if(item.x < 0)                  { item.x = 0  }
        if(item.right > jaws.width)     { item.x = jaws.width - item.width }
        if(item.y < 0)                  { item.y = 0 }
        if(item.bottom  > jaws.height)  { item.y = jaws.height - item.height }
      }
    }
    
    jaws.onload = function() {
      	jaws.assets.add("carro.png");
	jaws.assets.add("alieno.png");
	jaws.assets.add("proiettile.png");
	jaws.start(startFunc);  // Our convenience function jaws.start() will load assets, call setup and loop update/draw in 60 FPS
    }

