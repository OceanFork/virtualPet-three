var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var gameState;
var readState;
var sadDog,gardenDog,sleepDog,toiletDog;
var foodObj;
var currentTime;

function preload(){
sadDog=loadImage("virtual pet images/DogImg.png");
happyDog=loadImage("virtual pet images/dogImg1.png");
sleepDog = loadImage("virtual pet images/Bed Room.png");
gardenDog =  loadImage("virtual pet images/Garden.png");
toiletdog = loadImage("virtual pet Images/Wash Room.png")
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
 
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
 
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
    readState=database.ref('GameState');
      readState.on("value",function(data){
    GameState=data.val();
  });


  
  
  


  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
currentTime = hour();
console.log(currentTime);

if(currentTime==(lastFed+1)){
 update("Playing");
 foodObj.garden();
}else if(currentTime==(lastFed+2)){
update("toilet");
foodObj.washroom();
}else if(currentTime >(lastFed+2) && currentTime <=(lastFed+5)){
  update("sleeping");
  foodObj.bedroom();
}else{
  update("hungry");
  foodObj.display();
}
if(update != "hungry"){
dog.remove();
addFood.hide();
feed.hide();
}
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
database.ref('/').update({
GameState:state
});
}