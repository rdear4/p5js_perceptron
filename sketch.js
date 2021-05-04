let canvasWidth = 950
let canvasHeight = 700

//Colors
let purple
let red
let blue
let white
let grey

const pointRadius = 10

let arrayOfPoints = []  //Array of points to later be classified

let grid
let perceptron
let perceptronLineFn
let userLineFn

class Perceptron {

    constructor(_x, _y, _width, _height) {

        this.x = _x
        this.y = _y
        this.width = _width
        this.height = _height
        this.devMode = true
        this.weights = [random(-1, 1), random(-1, 1), random(-1, 1)]


        this.inputBoxDimensions = {width: 50, height: 30}
        this.input1BoxPosition = {x: this.width/16, y: this.height/2 - 50 - this.inputBoxDimensions.height}
        this.input2BoxPosition = {x: this.width/16, y: this.height/2 + 50}

        this.initialized = false

        this.learningRate = 0.2

        this.input0 = undefined
        this.input1 = undefined
        this.outputFill = color(0,0,0,0)

        this.isTraining = false
        this.guessCorrect = true
        this.fillColor = color(0,0,0,0)

        this.pulseRate = 30
        

    }

    show() {

        push()

        translate(this.x, this.y)

        
        // push()

        // noFill()
        // stroke(purple)
        // strokeWeight(1)
        // rect(0, 0, this.width, this.height)

        // pop()
        
            

        //Draw the main perceptron body
        if (this.initialized) {
            push()
            noFill()
            strokeWeight(map(sin(frameCount/20), -1, 1, 8, 10))
            stroke(color(blue.levels[0], blue.levels[1], blue.levels[2], map(sin(frameCount/this.pulseRate), -1, 1, 0, 255)))
            // console.log(frameCount, map(sin(frameCount/50), -1, 1, 0, 255))
            // console.log(blue[0], blue[1], blue[2], blue[4])
            this.fillColor = color(blue.levels[0], blue.levels[1], blue.levels[2], map(cos(frameCount/this.pulseRate), -1, 1, 0, 255))
            
            circle(this.width/2, this.height/2, 90)
            pop()
        }
        

        push()
        fill(this.fillColor)
        strokeWeight(4)
        stroke(white)

        circle(this.width/2, this.height/2, 90)

        

        //Draw the inputs Label
        push()
        
        let labelYValue = 50

        textSize(16)
        fill(white)
        noStroke()
        textAlign(CENTER)
        
        text("Inputs", this.input1BoxPosition.x + this.inputBoxDimensions.width/2, labelYValue)

        //Draw the Perceptron Label

        text("Perceptron", this.width/2, labelYValue)


        //Draw the output label

        text("Output", this.width - this.input1BoxPosition.x - this.inputBoxDimensions.width/2, labelYValue)
        
        pop()

        //Draw input one box
        push()
        noFill()
        strokeWeight(3)
        rect(this.input1BoxPosition.x, this.input1BoxPosition.y, this.inputBoxDimensions.width, this.inputBoxDimensions.height, 5, 5, 5, 5)
        pop()

        if (this.input0 !== undefined) {
            
            push()
            fill(red)
            noStroke()
            textAlign(CENTER, CENTER)
            console.log()
            text(this.input0, this.input1BoxPosition.x + this.inputBoxDimensions.width/2, this.input1BoxPosition.y + this.inputBoxDimensions.height/2)
            pop()
        }

        //Add input 1 label
        push()
        fill(red)
        noStroke()
        textAlign(RIGHT,CENTER)
        textSize(20)
        stroke(red)
        strokeWeight(2)
        text("X", this.input1BoxPosition.x - 10, this.input1BoxPosition.y + this.inputBoxDimensions.height/2)
        text("Y", this.input1BoxPosition.x - 10, this.input2BoxPosition.y + this.inputBoxDimensions.height/2)
        // text('X', 0, 0)
        
        pop()
        
        push()
        let arrow_length = 90
        //Translate to the middle right side of the first box
        translate(this.input1BoxPosition.x+this.inputBoxDimensions.width+10, this.input1BoxPosition.y+this.inputBoxDimensions.height/2)
        rotate(QUARTER_PI/2)


        line(0, 0, arrow_length, 0)
        line(arrow_length-15, -10, arrow_length, 0)
        line(arrow_length-15, 10, arrow_length, 0)
        
        pop()

        //Draw the second input box
        push()
        noFill()
        rect(this.input2BoxPosition.x, this.input2BoxPosition.y, this.inputBoxDimensions.width, this.inputBoxDimensions.height, 5, 5, 5, 5)

        translate(this.input2BoxPosition.x+this.inputBoxDimensions.width+10, this.input2BoxPosition.y+this.inputBoxDimensions.height/2)

        rotate(-QUARTER_PI/2)

        

        line(0, 0, arrow_length, 0)
        line(arrow_length-15, -10, arrow_length, 0)
        line(arrow_length-15, 10, arrow_length, 0)

        pop()

        

        if (this.input1 !== undefined) {
            
            push()
            fill(red)
            noStroke()
            textAlign(CENTER, CENTER)
            console.log()
            text(this.input1, this.input2BoxPosition.x + this.inputBoxDimensions.width/2, this.input2BoxPosition.y + this.inputBoxDimensions.height/2)
            pop()
            
        }

        //Draw the output arrow

        line(this.width/2 + 60, this.height/2, this.width/2 + 60 + arrow_length * .85, this.height/2)
        line(this.width/2 + 60 + arrow_length * .85 - 15, this.height/2 - 10, this.width/2 + 60 + arrow_length * .85, this.height/2)
        line(this.width/2 + 60 + arrow_length * .85 - 15, this.height/2 + 10, this.width/2 + 60 + arrow_length * .85, this.height/2)

        //Draw the output box

        push()
        fill(this.outputFill)
        rect(this.width - this.input2BoxPosition.x - this.inputBoxDimensions.width, this.height/2 - this.inputBoxDimensions.height/2, this.inputBoxDimensions.width, this.inputBoxDimensions.height, 5, 5, 5, 5)

        pop()

        //Draw Wrong and Correct Indicators - ONLY IF THE PERCEPTRON IS TRAINING



        if (this.isTraining) {

            let lineLengths = 10
            if (this.guessCorrect) {
                push()
                fill('lime')
                noStroke()
                circle(this.width - this.input2BoxPosition.x - this.inputBoxDimensions.width/2, this.height/2 - 70, 50)

                noFill()
            
                stroke('white')
                strokeWeight(5)
                
                translate(this.width - this.input2BoxPosition.x - this.inputBoxDimensions.width/2, this.height/2 - 70)
                rotate(PI/10)
                line(-lineLengths, 5, 0, lineLengths*1.3)
                line(0, lineLengths*1.3, +lineLengths, -lineLengths)

                pop()

            } else {

                push()
                noStroke()
                fill('red')
                circle(this.width - this.input2BoxPosition.x - this.inputBoxDimensions.width/2, this.height/2 + 70, 50)

                noFill()
                stroke('white')
                strokeWeight(5)
                
                translate(this.width - this.input2BoxPosition.x - this.inputBoxDimensions.width/2, this.height/2 + 70)
                line(-lineLengths, -lineLengths, lineLengths, lineLengths)
                line(-lineLengths, lineLengths, lineLengths, -lineLengths)
                pop()

                
                
            }

        }
        
        

        

        

        

        //Draw the Bias weight line
        push()

        strokeWeight(3)
        
        // line(this.input1BoxPosition.x, 350, );
        stroke(white)
        let point1 = {x:this.input1BoxPosition.x-50, y: 350}
        let point2 = {x: this.input1BoxPosition.x, y: 360}
        let point3 = {x: this.input1BoxPosition.x + 50, y: 360}
        let point4 = {x: this.input1BoxPosition.x + 100, y: 350}
        let point5 = {x: this.input1BoxPosition.x + 140, y: 330}
        let point6 = {x: this.input1BoxPosition.x + 165, y: 305}
        let point7 = {x: 210, y:270}
        let point8 = {x: 220, y: 220}
        curve(point1.x, point1.y, point2.x, point2.y, point3.x, point3.y, point4.x, point4.y)
        curve(point2.x, point2.y, point3.x, point3.y, point4.x, point4.y, point5.x, point5.y)
        curve(point3.x, point3.y, point4.x, point4.y, point5.x, point5.y, point6.x, point6.y)
        curve(point4.x, point4.y, point5.x, point5.y, point6.x, point6.y, point7.x, point7.y)
        curve(point5.x, point5.y, point6.x, point6.y, point7.x, point7.y, point8.x, point8.y)
        // stroke('lime')
        // point(point1.x, point1.y)
        // point(point2.x, point2.y)
        // point(point3.x, point3.y)
        // point(point4.x, point4.y)
        // point(point5.x, point5.y)
        // point(point6.x, point6.y)
        // point(point7.x, point7.y)
        // point(point8.x, point8.y)
        push()
        translate(point7.x, point7.y)
        rotate(-QUARTER_PI * 1.6)
        line(0, 0, -20, 10)
        line(0, 0, -20, -10)
        pop()
        // curve(this.input1BoxPosition.x, 350, this.input1BoxPosition.x, 350, )
        
        pop()
        
        // Draw weight 0
        noStroke()
        fill(blue)
        textSize(13)
        textAlign(LEFT, CENTER)
        
        text(this.initialized ? this.weights[0].toFixed(4) : "", 110, 130)

        //Draw weight 1 
        text(this.initialized ? this.weights[1].toFixed(4) : "", 110, 270)
        text(this.initialized ? this.weights[2].toFixed(4) : "", point2.x, point2.y - 15)

        fill(white)
        text("Weight 0", 110, 110)
        text("Weight 1", 110, 290)

        text("Bias Weight", point2.x, point2.y - 35)
        pop()

        // stroke(blue)
        // strokeWeight(4)
        // line(0, this.height/2, this.width, this.height/2)

        pop()

    }

    guess(x, y) {

        this.input0 = x
        this.input1 = y 


        let result = this.weights[0] * x + this.weights[1] * y + this.weights[2]

        if (result >= 0) {
            this.outputFill = 'red'
            return 1
        } else {
            this.outputFill = 'blue'
            return -1
        }

    }

    train(inputs, answer) {

        let guess = this.guess(inputs[0], inputs[1])
        
        if (guess === answer) {

            this.guessCorrect = true
        } else {

            this.guessCorrect = false

        }

        let error = answer - guess
        // console.log(this.weights, inputs, answer, guess, error)
        for (let i = 0; i < 3; i++) {

            this.weights[i] += error * inputs[i] * this.learningRate

        }
    }


}

class Clickable {

    constructor(_x, _y, _width, _height, _callback) {

        this.x = _x
        this.y = _y
        this.height = _height
        this.width = _width

        this.hasMouseFocus = false

        this.cb = _callback

    }



    wasClicked(xClick, yClick) {
        console.log
        
        // console.log(`x1: ${this.x} x: ${xClick} x2: ${this.x + this.width} y1: ${this.y} y: ${yClick} y2: ${this.y + this.height}`)

        if (xClick > this.x && xClick < this.x + this.width && yClick > this.y && yClick < this.y + this.height) {

            this.cb(this)

        }

    }
}

class Button extends Clickable {

    constructor(_x, _y, _w, _h, _label, _callback, _disabled = false) {

        super(_x, _y, _w, _h, _callback)

        this.label = _label
        
        this.fill = blue
        this.fillActive = purple
        this.labelFill = white

        this.disabled = _disabled
        if (this.disabled) {

            this.disable()
        }

    }

    disable() {

        this.disabled = true
        this.fill = color(130)
        this.labelFill = color(170)
    }

    enable() {

        this.disabled = false
        this.fill = blue
        this.labelFill = white
    }

    show() {

        push()
        translate(this.x, this.y)
        fill(this.hasMouseFocus ? this.fillActive : this.fill)
        noStroke()
        rect(0, 0, this.width, this.height, 10, 10, 10, 10)

        textAlign(CENTER, CENTER)

        fill(this.labelFill)
        text(this.label, this.width/2, this.height/2)
        pop()
    }
}

class Point extends Clickable {

    constructor(_x, _y, _f, _callback) {
        super(_x-10, _y-10, 20, 20, _callback)
        this.x = _x
        this.y = _y
        this.fill = _f
        this.classification = undefined
        this.guessFill = color(0,0,0,0)

    }

    show() {

        push()

        fill(this.guessFill)
        noStroke()
        circle(this.x, -this.y, 20)

        fill(this.fill)

        stroke('white')
        strokeWeight(2)

        circle(this.x, -this.y, 12)

        pop()

    }

}

class Graph {

    constructor(_x, _y, _w, _h, _showGrid = true) {

        this.x = _x
        this.y = _y
        this.width = _w
        this.height = _h

        this.showGrid = _showGrid
        this.numGridLines = 20;

        this.leftPoint = {x:-this.width/2, y: 0}
        this.rightPoint = {x: this.width/2, y: 0}

        this.points = []

        this.highlightPoint = false

        this.perceptronLineEndpoints = []

    }

    updatePerceptronLine(fofX) {

        let leftPoint = {
            x: -200,
            y: fofX(-200)
        }

        let rightPoint = {
            x: 200,
            y: fofX(200)
        }

        this.perceptronLineEndpoints = [leftPoint, rightPoint]

    }

    show() {

        push()

        // stroke(purple)
        // fill(0)
        translate(this.x + this.width/2, this.y+this.height/2)
        // rect(-this.width/2, -this.height/2, this.width, this.height)

        if (this.showGrid) {

            stroke(50)
            strokeWeight(1)

            //Draw vertical grid lines
            for (let i = 0; i < this.numGridLines - 1; i++) {

                let x = -this.width/2 + (this.width/this.numGridLines) * (i + 1);
                line(x, -this.height/2, x, this.height/2)

            }

            //Draw horizontal grid lines
            for (let j = 0; j < this.numGridLines-1; j++) {

                let y = -this.height/2 + (this.height/this.numGridLines) * (j + 1);
                line(-this.width/2, y, this.width/2, y)

            }

            for (let point of this.points) {

                point.show()
                // push()

                // fill(point.fill)
                // noStroke()
                // circle(point.x, -point.y, 20)

                // pop()

            }
        }

        //Draw the X and Y lines
        stroke(white)
        strokeWeight(2)

        line(0, -this.height/2, 0, this.height/2)
        line(-this.width/2, 0, this.width/2, 0)

        if (this.highlightPoint) {

            push()

            stroke('lime')
            strokeWeight(2)
            line(-this.width/2, -this.highlightPoint.y, this.width/2, -this.highlightPoint.y)
            line(this.highlightPoint.x, -this.height/2, this.highlightPoint.x, this.height/2)
            pop()

        }
        
        //Draw delineator line
        stroke(red)
        strokeWeight(2)

        line(this.leftPoint.x, this.leftPoint.y, this.rightPoint.x, this.rightPoint.y)

        //Draw the perceptron's idea of the delineator line
        if (this.perceptronLineEndpoints.length != 0) {
            push()
            stroke('lime')
            strokeWeight(2)
            line(this.perceptronLineEndpoints[0].x, this.perceptronLineEndpoints[0].y, this.perceptronLineEndpoints[1].x, this.perceptronLineEndpoints[1].y)
            pop()
        }

        pop()

    }

    updateLeft(newY) {

        this.leftPoint = {x: this.leftPoint.x, y: newY - this.y - this.height/2}
    }

    updateRight(newY) {

        this.rightPoint = {x: this.rightPoint.x, y: newY - this.y - this.height/2}
    }

    addPoint(aPoint) {

        this.points.push(aPoint)
    }

}

class Slider extends Clickable {

    constructor(_x, _y, _isLeft, _changed, _min, _max, _callback) {
        super(_x, _y, 40, 30, _callback)
        // this.x = _x
        // this.y = _y
        this.isLeft = _isLeft
        this.positionChanged = _changed
        // this.width = 50
        // this.height = 30
        this.max = _max
        this.min = _min

    }

    show() {

        if (this.hasMouseFocus) {
            
            this.y = mouseY - this.height/2

            if (this.y > this.max-this.height/2) {
                this.y = this.max - this.height/2
            }

            if (this.y < this.min-this.height/2) {
                this.y = this.min-this.height/2
            }

            this.positionChanged(this.y + this.height/2)
             
        }

        push()
        translate(this.x, this.y)
        
        fill(blue)
        noStroke()
        

        if (this.isLeft) {
            rect(0,0,this.width-this.height/2, this.height, 5, 0, 0, 5)
            triangle(this.width-this.height/2, 0, this.width, this.height/2, this.width - this.height/2, this.height)
        } else {
            triangle(0, this.height/2, this.height/2, 0, this.height/2, this.height)
            rect(this.height/2, 0, this.width - this.height/2, this.height, 0, 5, 5, 0)
        }
        
        
        pop()

    }
}

class lineFunctionDisplay {

    constructor(_x, _y, _x1, _y1, _x2, _y2) {

        this.x = _x
        this.y = _y
        this.leftPoint = {x: _x1, y: _y1}
        this.rightPoint = {x: _x2, y: _y2}
        this.slope = 0
        this.b = 0

        this.calc()

    }

    updateLeft(newY) {

        this.leftPoint.y = -newY

        
        this.calc()
    }

    updateRight(newY) {

        this.rightPoint.y = -newY
        this.calc()
    }

    calc() {

        this.slope = (this.leftPoint.y - this.rightPoint.y) / (this.leftPoint.x - this.rightPoint.x)
        this.b = this.rightPoint.y - (this.slope * this.rightPoint.x)

        
    }

    show() {

        // console.log("Showing")
        push()

        translate(this.x, this.y)
        // noFill()
        // stroke(blue)
        // rect(0,0,300, 100)
        noStroke()
        fill(white)
        textSize(40)
        // textAlign(CENTER, CENTER)
        
        // text("y = mx + b", 150, 50)
        text(`y = ${this.slope.toFixed(2)}x ${(this.b > 0) ? " + " : " - "}${Math.abs(this.b).toFixed(2)}`, 0, 0)
        // text(`${this.slope}x `, 40, )

        pop()

    }
}

let clickableItems = []

let leftSlider
let rightSlider

let classifyButton
let initializeButton
let trainButton
let trainButtonSlow
let classifyWithPerceptronButton
let classifyWithPerceptronButtonSlow

function setup() {

    let buttonWidth = 150
    let buttonHeight = 50
    
    let renderer = createCanvas(canvasWidth, canvasHeight)
    renderer.parent("sketch-container");

    //Set the colors

    purple = color('#7200CE')
    red = color('#E4572E')
    blue = color('#058ED9')
    white = color('#FBFCFF')
    grey = color('#cacaca')

    grid = new Graph(40, 50, 400, 400)

    perceptron = new Perceptron(500, 50, 450, 400)

    userLineFn = new lineFunctionDisplay(0, 500, -200, 0, 200, 0)

    perceptronLineFn = new lineFunctionDisplay(500, 500, -200, 0, 200, 0)

    leftSlider = new Slider(0, 250-15, true, (y) => {
        grid.updateLeft(y)
        userLineFn.updateLeft(y-250)
    }, 50, 450, (el) => {
        el.hasMouseFocus = true
    })

    rightSlider = new Slider(440, 250-15, false, (y) => {
        grid.updateRight(y)
        userLineFn.updateRight(y-250)
    }, 50, 450, (el) => {
        el.hasMouseFocus = true
    })

    classifyButton = new Button(0, 550, buttonWidth, buttonHeight, "Classify Points", (el) => {

        el.hasMouseFocus = true

        //Classify points
        
        for (let point of grid.points) {
            
            point
            
            if (userLineFn.slope * point.x + userLineFn.b - point.y >= 0) {

                point.fill = 'red'
                point.classification = 1

            } else {

                point.fill = 'blue'
                point.classification = -1

            }

            
        }

        initializeButton.enable()

    })

    

    initializeButton = new Button(buttonWidth + 20, 550, buttonWidth, buttonHeight, "Initialize Perceptron", (el) => {

        if (!el.disabled) {

            el.hasMouseFocus = true
            perceptron.initialized = true

            perceptronLineFn.slope = -perceptron.weights[0]/perceptron.weights[1]
            perceptronLineFn.b = -perceptron.weights[2]/perceptron.weights[1]

            grid.updatePerceptronLine((x) => { return (-perceptronLineFn.slope * x) - perceptronLineFn.b})

            classifyWithPerceptronButton.enable()
            classifyWithPerceptronButtonSlow.enable()
            trainButton.enable()
            trainButtonSlow.enable()

        }

    }, true)

    trainButtonSlow = new Button(500, 550 + buttonHeight + 20, buttonWidth, buttonHeight, "Train Perceptron\n(SLOW)", (el) => {

        if (!el.disabled) {

            perceptron.pulseRate = 10

            el.hasMouseFocus = true

            perceptron.isTraining = true
            
            // let point = 0;
            
            // let animateInterval = setInterval(() => {
            
            pointCounter = 0
            
            let trainingAnimation = setInterval(() => {

                // for (let aPoint of grid.points) {

                    // if (point >= grid.points.length) {
                    //     clearInterval(animateInterval)
                    //     grid.highlightPoint = false
                    //     return
                    // }
        
                    
                    // aPoint = grid.points[point]
                    // grid.highlightPoint = aPoint 
                let aPoint = grid.points[pointCounter % grid.points.length]

                perceptron.train([aPoint.x, aPoint.y, 1], aPoint.classification)
        
                    // point++
                    

                // }

                if (pointCounter % grid.points.length/2 === 0) {

                    perceptronLineFn.slope = -perceptron.weights[0]/perceptron.weights[1]
                    perceptronLineFn.b = -perceptron.weights[2]/perceptron.weights[1]

                    grid.updatePerceptronLine((x) => { return (-perceptronLineFn.slope * x) - perceptronLineFn.b})
                    
                }

                pointCounter++
                // console.log(pointCounter)

                if (pointCounter >= grid.points.length * 20) {
                    clearInterval(trainingAnimation)
                    perceptron.isTraining = false
                    console.log("Done Training")

                    perceptronLineFn.slope = -perceptron.weights[0]/perceptron.weights[1]
                    perceptronLineFn.b = -perceptron.weights[2]/perceptron.weights[1]

                    grid.updatePerceptronLine((x) => { return (-perceptronLineFn.slope * x) - perceptronLineFn.b})

                    perceptron.pulseRate = 30
                }

            }, 1)


        }

    
    }, true)

    trainButton = new Button(500, 550, buttonWidth, buttonHeight, "Train Perceptron", (el) => {

        if (!el.disabled) {

            el.hasMouseFocus = true
            perceptron.isTraining = true
            
            // let point = 0;
            
            // let animateInterval = setInterval(() => {
            
            trainingCounter = 0


            for (let i = 0; i < 100; i++) {

                for (let aPoint of grid.points) {

                    // if (point >= grid.points.length) {
                    //     clearInterval(animateInterval)
                    //     grid.highlightPoint = false
                    //     return
                    // }
        
                    
                    // aPoint = grid.points[point]
                    // grid.highlightPoint = aPoint
        
                    perceptron.train([aPoint.x, aPoint.y, 1], aPoint.classification)
        
                    // point++
                    

                }

                perceptronLineFn.slope = -perceptron.weights[0]/perceptron.weights[1]
                perceptronLineFn.b = -perceptron.weights[2]/perceptron.weights[1]

                grid.updatePerceptronLine((x) => { return (-perceptronLineFn.slope * x) - perceptronLineFn.b})

                

                perceptron.isTraining = false

            }

        }

    }, true)

    classifyWithPerceptronButtonSlow = new Button(500 + buttonWidth + 20, 550 + 20 + buttonHeight, buttonWidth, buttonHeight, "Classify With Perceptron\n(SLOW)", (el) => {

        if (!el.disabled) {

            perceptron.pulseRate = 10
            el.hasMouseFocus = true

            let point = 0;

            let animateInterval = setInterval(() => {
                
                if (point >= grid.points.length) {
                    clearInterval(animateInterval)
                    grid.highlightPoint = false
                    perceptron.pulseRate = 30
                    return
                }

                
                aPoint = grid.points[point]
                grid.highlightPoint = aPoint

                aPoint.guessFill = (perceptron.guess(aPoint.x, aPoint.y) === 1) ? 'red' : 'blue'

                point++

                

            }, 50)

        }

    }, true)

    classifyWithPerceptronButton = new Button(500 + buttonWidth + 20, 550, buttonWidth, buttonHeight, "Classify With Perceptron", (el) => {

        if (!el.disabled) {

            el.hasMouseFocus = true

            for (let aPoint of grid.points) {

                aPoint.guessFill = (perceptron.guess(aPoint.x, aPoint.y) === 1) ? 'red' : 'blue'

            }

        }

    }, true)

    clickableItems.push(leftSlider)
    clickableItems.push(rightSlider)
    clickableItems.push(initializeButton)
    clickableItems.push(classifyButton)
    clickableItems.push(trainButton)
    clickableItems.push(classifyWithPerceptronButton)
    clickableItems.push(trainButtonSlow)
    clickableItems.push(classifyWithPerceptronButtonSlow)

    

    

    //create 100 random points
    // grid.addPoint(new Point(0, 0, color(255,100,0)))
    // grid.addPoint(new Point(0, -100, color(255,100,0)))
    // grid.addPoint(new Point(0, 100, color(255,100,0)))
    // grid.addPoint(new Point(-200+pointRadius/2, 0, color(0,255,0)))
    for (let i  = 0; i < 100; i++) {

        
        let aPoint = new Point(Math.floor((Math.random() * (grid.width - 2 * pointRadius)) - (200 - pointRadius)), Math.floor((Math.random() * (grid.height - 2 * pointRadius)) - 200 + pointRadius), color(132, 0, 255), (el) => {
            console.log("Clicked")
            console.log(el.x, el.y)
        })
        
        // arrayOfPoints.push(aPoint)

        grid.addPoint(aPoint)
    }
  }
  
  function draw() {
    background(0)
    
    // stroke(0)
    // strokeWeight(4)

    // rect(0,0, dWidth, dHeight)

    grid.show()

    // leftSlider.show()
    // rightSlider.show()

    perceptron.show()

    for (let control of clickableItems) {
        
        control.show()
    
    }

    userLineFn.show()
    perceptronLineFn.show()

    // noLoop()

}

function mousePressed() {

    for (let clickableObject of clickableItems) {

        clickableObject.wasClicked(mouseX, mouseY)

    }

    for (let point of grid.points) {

        point.wasClicked(mouseX, mouseY)

    }

}

function mouseReleased() {

    for (let clickableObject of clickableItems) {

        clickableObject.hasMouseFocus = false
    }
}