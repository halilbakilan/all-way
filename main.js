function startGame() {
    gameArea.start();
    elements.rulesDraw();
    counter.calc(counter.possibility);
}

let combination = {
    width: 4,
    height: 3
}

let style = {
    size: 100,
    rules: {
        color: "#cfcfcf",
        border: 1
    },
    ball: {
        color: "#000000"
    }
};

let gameArea = {
    element: document.createElement("canvas"),
    clear: function() {
        this.context.clearRect(0, 0, style.size * combination.width, style.size * combination.height);
        gameArea.context.fill();
    },
    create: function() {
        this.element.width = style.size * combination.width;
        this.element.height = style.size * combination.height;
        this.element.style.cssText = `border: solid ${style.rules.border}px ${style.rules.color}; margin: 50px auto; display: block;`;
        this.context = this.element.getContext("2d");
        this.draw();
    },
    draw: function() {
        document.body.insertBefore(this.element, document.body.childNodes[0]);
    },
    start: function() {
        this.create();
    }
};

let elements = {
    rulesDraw: function() {
        gameArea.context.fillStyle = style.rules.color;
        for (let i = 1; i < combination.width; i++) {
            gameArea.context.fillRect((style.size * combination.width / combination.width) * i, 0, 1, style.size * combination.height);
        }
        for (let i = 1; i < combination.height; i++) {
            gameArea.context.fillRect(0, (style.size * combination.height / combination.height) * i, style.size * combination.width, 1);
        }
    },
    ballDraw: function() {
        
        let i = 0;
        let t = 0;
        
        let interval = setInterval(function() {


            gameArea.context.beginPath();
            if(i == -1){
                i++;
                gameArea.clear();
                elements.rulesDraw();
            }

            gameArea.context.font = "15px arial";
            gameArea.context.fillStyle = style.ball.color;

            gameArea.context.arc((style.size / 8 * (counter.possibility[t][i].x * 8)) - (style.size / 2), (style.size / 8 * (counter.possibility[t][i].y * 8)) - (style.size / 2), style.size * 2 / 4 - 20, 0, 2 * Math.PI);
            gameArea.context.fill();
            
            gameArea.context.strokeStyle = "white";
            gameArea.context.strokeText(i + 1, (style.size / 8 * (counter.possibility[t][i].x * 8)) - (style.size / 2), (style.size / 8 * (counter.possibility[t][i].y * 8)) - (style.size / 2) );
            

            
            i++;
            
            if(i == counter.possibility[t].length){
                t++;
                i = -1;
                if(t == counter.possibility.length){
                    clearInterval(interval);
                }
            }
        }, 100);
    }
};

let counter = {

    centerX: null,
    centerY: null,
    next: undefined,

    possibility: [[{ x: 2, y: 2 }]],
    possibilityCopy: [],
    possibilityAll: [],
    possibilityAllCopy: [], 
    conservative: [],
    deleteIndex: [],

    copy: function(aObject) {
        if (!aObject) {
            return aObject;
        }
        let v;
        let bObject = Array.isArray(aObject) ? [] : {};
        for (const k in aObject) {
            v = aObject[k];
            bObject[k] = (typeof v === "object") ? this.copy(v) : v;
        }
        return bObject;
    },
    calc: function(array){
        this.deleteIndex = [];
        array.forEach((element, i) => {
            this.centerX = element[element.length -1].x;
            this.centerY = element[element.length -1].y;
            this.next = false;
            for(let t = 1; t < 5; t++){
                this.possibilityCopy = this.copy(element);
                
                if(t === 1 && this.centerX > 1 && this.possibilityCopy.filter(e => (e.x === this.centerX - 1) && (e.y === this.centerY)).length == 0){
                    this.next = true;
                    this.possibilityCopy.push({ x: this.centerX - 1, y: this.centerY });
                    this.possibilityAll.push(this.possibilityCopy);
                }
                if(t === 2 && this.centerX < combination.width && this.possibilityCopy.filter(e => (e.x === this.centerX + 1) && (e.y === this.centerY)).length == 0){
                    this.next = true;
                    this.possibilityCopy.push({ x: this.centerX + 1, y: this.centerY });
                    this.possibilityAll.push(this.possibilityCopy);     
                }
                if(t === 3 && this.centerY > 1 && this.possibilityCopy.filter(e => (e.x === this.centerX) && (e.y === this.centerY - 1)).length == 0){
                    this.next = true;
                    this.possibilityCopy.push({ x: this.centerX, y: this.centerY - 1 });
                    this.possibilityAll.push(this.possibilityCopy);
                }
                if(t === 4 && this.centerY < combination.height && this.possibilityCopy.filter(e => (e.x === this.centerX) && (e.y === this.centerY + 1)).length == 0){
                    this.next = true;
                    this.possibilityCopy.push({ x: this.centerX, y: this.centerY + 1 });
                    this.possibilityAll.push(this.possibilityCopy);
                }
            }
            if(this.next === true){
                this.deleteIndex.push(i);
            }
            this.conservative = this.copy(this.possibilityAll);
            this.possibilityAll = [];
            this.possibilityAllCopy = [...this.possibilityAllCopy, ...this.conservative];   
        });
        this.possibility = this.possibility.filter(
            function(e, i) {
                return this.indexOf(i) < 0;
            },
            this.deleteIndex
        );
        this.possibility = [...this.possibility, ...this.possibilityAllCopy];
        this.possibilityAllCopy = [];
        if(this.deleteIndex.length > 0){
            
            this.calc(this.possibility);
        }
        else {
            elements.ballDraw();
            // this.possibility = this.possibility.splice(-1,100);
        }
    }
};

 
