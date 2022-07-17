let divPlayer = document.getElementById('character');
const game = document.getElementById('game');

let gameWidth = 1000;
let gameHeight = 500;

// playerSize 18
let playerSize = 18;
divPlayer.style.width = playerSize + 'px';
divPlayer.style.height = playerSize + 'px';

game.style.width = `${gameWidth}px`;
game.style.height = `${gameHeight}px`;

var up = false,
    right = false,
    left = false

var character = Object();

let spacePress = false;

// acc .7, dec 1.1, airAcc .4, airDrag .5, airDragf .9, jumpForce -10, speed 5, termVel 60
let acceleration = .7;
let deceleration = 1.1;
let airAcceleration = .4;
let airDrag = .5;
let airDragf = .9;
let jumpForce = -10;
let speed = 5;
let termVel = 60;

let addPlatform;

function getConst() {
  playerSize = parseFloat(document.getElementById('playerSize').value);
  {
    divPlayer.style.width = playerSize + 'px';
    divPlayer.style.height = playerSize + 'px';
    character.y -= playerSize;
  }
  acceleration = parseFloat(document.getElementById('acceleration').value);
  deceleration = parseFloat(document.getElementById('deceleration').value);
  jumpForce = parseFloat(document.getElementById('jumpFORCE').value);
  speed = parseFloat(document.getElementById('speed').value);
  airAcceleration = parseFloat(document.getElementById('airAcceleration').value);
  airDrag = parseFloat(document.getElementById('airDrag').value);
  airDragf = parseFloat(document.getElementById('airDragf').value);
  termVel = parseFloat(document.getElementById('termVel').value);

  game.style.width = document.getElementById('gameWidth').value + 'px';
  game.style.height = document.getElementById('gameHeight').value + 'px';
  gameWidth = parseFloat(document.getElementById('gameWidth').value);
  gameHeight = parseFloat(document.getElementById('gameHeight').value);

  addPlatform = document.getElementById('addPlatform').value.split(",");
  platforms.push(addPlatform);
  createDivs();
}

// spawn?
character.x = 20;
character.y = gameHeight - playerSize;

character.grav = 0;
character.airVel = 0;
character.vel = 0;
character.isGrounded = false;

let platforms;


function createDivs (){
  platforms = [
    [0, gameHeight - 50, gameWidth, 50]
  ]
  for (let i = 0; i < platforms.length; i++)
  {
    plat = document.createElement('div');
    plat.style.position = 'absolute';
    plat.style.display = 'inline-block'
    plat.style.left = platforms[i][0] + 'px';
    plat.style.top = platforms[i][1] + 'px';
    plat.style.width = platforms[i][2] + 'px';
    plat.style.height = platforms[i][3] + 'px';
    plat.style.backgroundColor = 'blue';

    plat.setAttribute('id', `platform`);

    game.appendChild(plat);
  }
}
createDivs()

document.addEventListener('keydown',press)
function press(e){
  if (e.keyCode == 87)
  { 
    spacePress = true;
  }
  if (up === false && character.isGrounded === true)
  {
    if (e.keyCode === 87){
      up = true
      character.grav = jumpForce;
    }
    if (right)
    {
      character.airVel =  4;
    }
    else if (left)
    {
      character.airVel = -4;
    }
    else
    {
      character.airVel = 0;
    }
  }

  if (e.keyCode === 68){
    right = true
  }

  if (e.keyCode === 65){
    left = true
  }
}

document.addEventListener('keyup',release)
function release(e){
  if (e.keyCode === 87){
    spacePress = false;
  }
  if (e.keyCode === 68){
    right = false;
  }
  if (e.keyCode === 65){
    left = false;
  }
}

function jumping(){
  if (spacePress === true)
  {
    character.grav += airDrag;
  }
  else
  {
    character.grav += airDragf;
  }

  if (character.grav >= 0)
  {
    character.isGrounded = false;
    up = false;
  }
}

function addVelocity(){
  if (character.grav < termVel)
  {
    character.grav += .6;
  }
}

function gameLoop(){

  character.y += character.grav;

  if (up === false)
  {
    for (let i = 0; i < platforms.length; i++)
    {

      platX = platforms[i][0];
      platY = platforms[i][1];
      platXend = platforms[i][2];
      platYend = platforms[i][3];

      //console.log(platX, platY, platXend, platYend);
      if (platX <= character.x + (playerSize / 2) && character.x + (playerSize / 2) <= platX + platXend)
      {
        if (platY <= character.y + playerSize  && character.y + playerSize <= platY + platYend)
        {
          // if I add gravity to the characters y parameter, will it phaze through the ground?
          if (character.y + (character.grav) > platY - playerSize)
          {
            character.y = platY - playerSize;
          }
          // if not, add gravity to the characters y
          else
          {
            character.isGrounded = true;
          }
          character.grav = 0;
          character.isGrounded = true;
          break;
        }
        else
        {
          character.isGrounded = false;
        }
      }
      else
      {
        character.isGrounded = false;
      }
    }
  }

  if (up)
  {
    jumping();
  }
  if (character.isGrounded === false)
  { 
    addVelocity();
  }

  if (character.isGrounded === false || up)
  {
    if (left && character.vel > -speed)
    {
      character.vel -= airAcceleration;
    }
    if (right && character.vel < speed)
    {
      character.vel += airAcceleration;
    }

    if (character.x < gameWidth - playerSize && character.x > 0)
    {
      if ((character.x + character.vel) > gameWidth - playerSize)
      {
        character.vel = 0;
        character.x = gameWidth - playerSize -1;
      }
      else if ((character.x + character.vel) < 0)
      {
        character.vel = 0;
        character.x = 1
      }
      else
      {
        character.x = character.x + character.vel;
      }
    }

  }
  else
  {
    if (right && character.vel < speed)
    {
      character.vel += acceleration;
    }
    if (left && character.vel > -speed)
    {
      character.vel -= acceleration;
    }
    if (!(left || right))
    {
      if (character.vel > 0)
      {
        if (character.vel - deceleration < 0)
        {
          character.vel = 0;
        }
        else
        {
          character.vel -= deceleration;
        }
      }
      if (character.vel < 0)
      {
        if (character.vel + deceleration > 0)
        {
          character.vel = 0;
        }
        else
        {
          character.vel += deceleration;
        }
      }
    }
    if (character.x <= gameWidth - playerSize && character.x >= 0){
      if ((character.x + character.vel) > gameWidth - playerSize)
      {
        character.vel = 0;
        character.x = gameWidth - playerSize -1;
      }
      else if ((character.x + character.vel) < 0)
      {
        character.vel = 0;
        character.x = 1
      }
      else
      {
        character.x = character.x + character.vel;
      }
    }

  }
  
  document.getElementById('button').onclick = function() {
    getConst();
  }

  divPlayer.style.left = character.x +'px'
  divPlayer.style.top = character.y +'px'
  window.requestAnimationFrame(gameLoop)
}
window.requestAnimationFrame(gameLoop)