const MaxSpeed = 5;

var ants = [];
var aliveAnts = 0;
var mouseSize = 75;

var generation = 0;
var averageFitness = 0;
var globalBestFitness = 0;

var scoreText;

var antColor = (150, 150, 150);
var backColor = (153, 225, 255);

var popLength = NaN; //seconds, leave as NaN if you want it to go on for ever
var popSize = 50; // ants
var matingPoolSize = Math.round(popSize / 2);



function setup() {
    angleMode(DEGREES);
    let canvas = createCanvas(600, 600);
    scoreText = createDiv('').size(100, 100);
    generationText = createDiv('').size(100, 100);
    fitText = createDiv('').size(1000, 200);
    bestFit = createDiv('').size(1000,300);



    for (let i = 0; i < popSize; i++) ants.push(new Ant());
    aliveAnts = ants.length;

}

function draw() {
    background(153, 225, 255);

    fill(antColor);

    let aliveCount = 0;
    for (let i = 0; i < ants.length; i++) {
        ants[i].Update();
        ants[i].Draw();
        if (ants[i].alive) aliveCount++;
    }

    aliveAnts = aliveCount;

    if (mouseIsPressed) fill(255, 0, 0);
    else fill(255, 0, 0, 50);
    ellipse(mouseX, mouseY, mouseSize, mouseSize)

    scoreText.html('Ants alive: ' + aliveAnts);
    generationText.html('Generation: ' + generation);
    fitText.html('Average fitness: ' + averageFitness);
    bestFit.html('Best fitness: ' + globalBestFitness);

    scoreText.position(width + 50, 50);
    generationText.position(width + 50, 75);
    fitText.position(width + 50, 100);
    bestFit.position(width+ 50, 125);

    let run = 0;
    for (let i = 0; i < ants.length; i++) {
        run += ants[i].fitness;
        if (ants[i].fitness > globalBestFitness) globalBestFitness = ants[i].fitness;
    }

    averageFitness = (run / ants.length);

    if (frameCount % (popLength * 60) == 0) {
        makeNewPop(ants);
    }

    if (aliveAnts == 0) {
        makeNewPop(ants);
    }
}

//takes last generation and their fitnesses and makes a new generation
function makeNewPop(oldAnts) {
    generation++;
    matingPool = [];
    newGen = [];
    for (let i = 0; i < matingPoolSize; i++) matingPool.push(pickAnt(oldAnts));

    for (let i = 0; i < popSize; i++) {
        let parent1 = random(matingPool);
        let parent2 = random(matingPool);

        let childbrain = NeuralNetwork.crossover(parent1.brain, parent2.brain);
        newGen.push(new Ant(childbrain));
    }
    ants = newGen;
}

function getFits(ants) {
    let fits = []
    for (let i = 0; i < ants.length; i++) {
        fits.push(ants[i].fitness);
    }
}

function pickAnt(ants) {
    var index = 0;
    var r = random(1);
    while (r > 0) {
        r -= ants[index].fitness;
        index += 1;
    }
    index -= 1;

    return new Ant(ants[index].brain);
}
