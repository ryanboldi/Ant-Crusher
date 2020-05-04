class Ant {
    constructor(brain = NaN) {
        if (brain instanceof NeuralNetwork) {
            this.brain = brain;
        }
        else this.brain = new NeuralNetwork(6, 10, 4);
        //how fast the ant can accelerate in one time step
        this.accel = 10;
        //how fast (angle) the ant can rotate in one time step
        let turnStrength = 1;
        //mapped so division makes it larger
        this.turnStrength = map(turnStrength, 1, 6, 6, 1);

        this.diam = 10; //diameter of one section of the ant (1/3)
        this.alive = true; //boolean

        //position is initialised randomly, somewhere in the middle half of the screen (1/4 - > 3/4), just so ants dont spawn too close to the walls
        this.pos = createVector(random(width / 6, 5 * (width / 6)), random(height / 6, 5 * (height / 6)));

        //velocity is initialised randomly, then limited so that the ant does not exceed the max speed;
        this.vel = (createVector(random(-MaxSpeed, MaxSpeed), random(-MaxSpeed, MaxSpeed))).limit(MaxSpeed);

        //Brain of the ant's fitness
        this.fitness = 0;
    }

    Update() {

        //moves the ant based on its velocity each time step
        let inputs = [];
        let outputs = [];
        //distance from all four walls
        inputs[0] = map(this.pos.x, 0, width, -1, 1);
        inputs[1] = map(width - this.pos.x, 0, width, -1, 1);
        inputs[2] = map(this.pos.y, 0, height, -1, 1);
        inputs[3] = map(height - this.pos.y, 0, height, -1, 1);
        inputs[4] = map(Math.abs(mouseX - this.pos.x), 0, width, -1, 1);
        inputs[5] = map(Math.abs(mouseY - this.pos.y), 0, height, -1, 1);

        outputs = this.brain.predict(inputs);

        if (outputs[0] > 0.5) this.Turn(1, 0, 0, 0);
        if (outputs[1] > 0.5) this.Turn(0, 1, 0, 0);
        if (outputs[2] > 0.5) this.Turn(0, 0, 1, 0);
        if (outputs[3] > 0.5) this.Turn(0, 0, 0, 1);

        this.CheckCollision();
        this.pos.add(this.vel);
        if (this.alive) this.fitness++;
    }

    Draw() {
        if (this.alive) {
            //draws the ant, rotates to its heading so the ant is facing the direction it is moving in
            push();
            translate(this.pos.x, this.pos.y);
            rotate(this.vel.heading());
            ellipse(0, 0, this.diam, this.diam);
            fill(255, 155, 155);
            ellipse(this.diam, 0, this.diam, this.diam);
            fill(antColor);
            ellipse(-this.diam, 0, this.diam, this.diam);
            //rect(0, 0, 50, 50);

            pop();
            //push and pop just make it so we can return the center back to the original (0,0)
        }
    }

    //called whenever the ant wants to turn
    Turn(r, l, u, d) {
        //increases velocity by a multiple of 0.(acceleration)
        if (u === 1) this.vel.mult(1 + (this.accel / 100));
        //decreases velocity by same multiple
        if (d === 1) this.vel.mult(1 - (this.accel / 100));

        //rotates more if turnstrength is less, which is why i mapped it above (1 -> 6, 6-> 1)
        //i chose 33 as it has the most natural movement
        if (l === 1) this.vel.rotate(-33 / this.turnStrength);
        if (r === 1) this.vel.rotate(33 / this.turnStrength);

        //limits the velocity to max speed
        this.vel.limit(MaxSpeed);
    }

    //checks if the ant should die this frame
    CheckCollision() {
        let x = this.pos.x;
        let y = this.pos.y;

        //if its out of bounds on the x or y
        if (x > width || x < 0) this.alive = false;
        if (y > height || y < 0) this.alive = false;

        //if its mouseSize away from the mouse while it is pressed
        if (HumanControlled) {
            if (mouseIsPressed) {
                if ((Math.abs(mouseX - x)) < mouseSize / 2) {
                    if ((Math.abs(mouseY - y)) < mouseSize / 2) {
                        this.alive = false;
                    }
                }
            }
        } else {
            if ((Math.abs(MOUSEX - x)) < mouseSize / 2) {
                if ((Math.abs(MOUSEY - y)) < mouseSize / 2) {
                    this.alive = false;
                }
            }
        }
    }
}  