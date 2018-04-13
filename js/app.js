
let r;
let g;
let b;

//Variables para tensorflow
let model;
let ultimaPrediccion = 0;
//Constantes para nuestra elección
const OUTPUT_WHITE = 1;
const OUTPUT_BLACK = 0;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 400;


function setup(){
  createCanvas(CANVAS_WIDTH,CANVAS_HEIGHT);

  //Creamos nuestro modelo
  model = tf.sequential();
  model.add(tf.layers.dense({units: 1, inputShape:[3]}));

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});


  pickColor();
}


async function pickColor(){
  r = random(255);
  g = random(255);
  b = random(255);
  let input = tf.tensor2d([r/255,g/255,b/255], [1,3])
  let output =  await model.predict(input).data();
  if(output>0.5){
    ultimaPrediccion = OUTPUT_WHITE;
  }else{
    ultimaPrediccion = OUTPUT_BLACK;
  }
}


function entrenarModelo(output){
  let x = tf.tensor2d([r/255,g/255,b/255], [1,3]);
  // console.log("x:");
  // x.print();
  let y =  tf.tensor2d([output], [1,1]);
  // console.log("y:");
  // y.print();
  model.fit(x,y,{epochs:30}).then(()=>{
    console.log("Entrenado!");
  });
}

function mousePressed(){
  if(mouseX > CANVAS_WIDTH/2){
    entrenarModelo(OUTPUT_WHITE);
  }else{
    entrenarModelo(OUTPUT_BLACK);
  }
  pickColor();
}

function draw(){
  background(r,g,b);
  textSize(32);
  fill(0)
  let texto_black = text('BLACK',CANVAS_WIDTH/4 - 50, CANVAS_HEIGHT / 2);
  fill(255)
  let texto_white = text('WHITE', CANVAS_WIDTH/2 + CANVAS_WIDTH/4 - 40, CANVAS_HEIGHT / 2);
  if(ultimaPrediccion == OUTPUT_WHITE)
  {
    fill(255);
  }else{
    fill(0);
  }

  strokeWeight(0);
  ellipse((CANVAS_WIDTH * ultimaPrediccion)/2 + CANVAS_WIDTH/4, CANVAS_HEIGHT / 2 + 25, 25, 25);

  strokeWeight(8);
  fill(0)
  line(CANVAS_WIDTH/2, 0, CANVAS_WIDTH/2, CANVAS_HEIGHT);
}
