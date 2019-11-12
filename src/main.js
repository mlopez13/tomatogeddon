
// Library import.
import mlopez13 from "../mlopez13/index.js";
const {
	CanvasRenderer,
	Container,
	KeyControls,
	Sprite,
	Text,
	Texture} = mlopez13;

// Canvas setup.
const w = 640;
const h = 300;
const renderer = new CanvasRenderer(w, h);
document.querySelector("#board").appendChild(renderer.view);

// GAME OBJECTS.

// (1) Scene.
const scene = new Container();

// Load textures.
const textures = {
	background: new Texture("res/images/bg.png"),
	bullet: new Texture("res/images/bullet.png"),
	ship: new Texture("res/images/ship.png"),
	tomato: new Texture("res/images/tomato.png")
};

// Load controls.
const controls = new KeyControls();

// (2) Player.
const ship = new Sprite(textures.ship);
ship.pos.x = 100;
ship.pos.y = h/2 - 15;
ship.update = function(dt, t) {
	const {pos} = this;
	pos.x += controls.x*dt*200;
	pos.y += controls.y*dt*200;
	if (pos.x < 0) pos.x = 0;
	if (pos.x > w - 30) pos.x = w - 30;
	if (pos.y < 0) pos.y = 0;
	if (pos.y > h - 30) pos.y = h - 30;
};

// (3) Bullets.

const bullets = new Container();

function fireBullet(x, y) {
	const bullet = new Sprite(textures.bullet);
	bullet.pos.x = x;
	bullet.pos.y = y;
	bullet.update = function(dt) {
		this.pos.x += 400*dt;
	};
	bullets.add(bullet);
}

// (4) Tomatoes.

const tomatoes = new Container();

function spawnTomato(x, y, speed) {
	const tomato = new Sprite(textures.tomato);
	tomato.pos.x = x;
	tomato.pos.y = y;
	tomato.update = function(dt) {
		this.pos.x += speed*dt;
	};
	tomatoes.add(tomato);
};

// (5) Score.
const score = new Text("SCORE: 0", {
	font: "15px courier",
	fill: "#ffffff"
});
score.pos.x = 10;
score.pos.y = 10;

// (6) GAME OVER.
function doGameOver() {
	const gameOverMessage = new Text("GAME TOMATOVER.", {
		font: "50pt courier",
		fill: "red",
		align: "center"
	});
	gameOverMessage.pos.x = w/2;
	gameOverMessage.pos.y = h/2 - 50;
	
	scene.add(gameOverMessage);
	scene.remove(ship);
	gameOver = true;
}

// Add everything.
scene.add(new Sprite(textures.background));
scene.add(ship);
scene.add(bullets);
scene.add(tomatoes);
scene.add(score);



// - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - -
// GAME LOOP.

let dt = 0;
let last = 0;

// Bullet control.
let lastShot = 0;

// Tomato spawn control.
let lastSpawn = 0;
let spawnSpeed = 1.0;

// Score control.
let scoreAmount = 0;
let gameOver = false;

function loopy(ms) {
	requestAnimationFrame(loopy);
	
	const t = ms / 1000;
	dt = t - last;
	last = t;
	
	if (!gameOver && controls.action && t - lastShot > 0.15) {
		lastShot = t;
		fireBullet(ship.pos.x + 10, ship.pos.y);
	}
	
	bullets.children.forEach(bullet => {
		if (bullet.pos.x > w) {
			bullet.dead = true;
		}
	});
	
	// Tomato spawn.
	if (t - lastSpawn > spawnSpeed) {
		lastSpawn = t;
		const speed = - 50 - Math.random()*Math.random()*100;
		const position = Math.random()*(h - 30);
		spawnTomato(w, position, speed);
		
		spawnSpeed = spawnSpeed < 0.05 ? 0.6 : spawnSpeed*0.97 + 0.001;
	}
	
	// Bullet and tomato collision.
	tomatoes.children.forEach(tomato => {
		bullets.children.forEach(bullet => {
			const dx = tomato.pos.x - bullet.pos.x;
			const dy = tomato.pos.y - bullet.pos.y;
			if (Math.sqrt(dx*dx + dy*dy) < 30) {
				tomato.dead = true;
				bullet.dead = true;
				scoreAmount ++;
				score.text = "SCORE: " + scoreAmount;
			}
		});
		
		if (tomato.pos.x < -30) {
			if (!gameOver) {
				doGameOver();
			}
			tomato.dead = true;
		}
	});
	
	scene.update(dt, t);
	renderer.render(scene);
}

// Start loop.
requestAnimationFrame(loopy);
