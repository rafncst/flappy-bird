function flappyBird() {
    const barriers = new Barriers(700, 1200, 300, 400, countScore);
    const gameArea = document.querySelector("[wm-flappy]");
    const bird = new Bird(700);

    gameArea.appendChild(bird.element);
    barriers.pairs.forEach((e) => {
        gameArea.appendChild(e.element);
    });

    myInterval = setInterval(() => {
        barriers.animate();
        bird.animate();
        collided(bird, barriers)
    }, 20);
}

function collision(elemA, elemB) {
    const a = elemA.getBoundingClientRect();
    const b = elemB.getBoundingClientRect();

    const xAxis = a.left + a.width >= b.left && b.left + b.width >= a.left;
    const yAxis = a.top + a.height >= b.top && b.top + b.height >= a.top;

    return xAxis && yAxis;
}

function collided(bird, barriers) {
    let collided = false;

    barriers.pairs.forEach((pairOfBarriers) => {
        if (!collided) {
            const superior = pairOfBarriers.superior.element;
            const inferior = pairOfBarriers.inferior.element;

            collided =
                collision(bird.element, superior) ||
                collision(bird.element, inferior);
        }
        if (collided) {
            return clearInterval(myInterval);
        }
    });
}

function newElement(tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function countScore() {
    currentScore = parseInt(document.querySelector(".progress").innerHTML);
    document.querySelector(".progress").innerHTML = currentScore + 1;
}

function Barrier(reverse = false) {
    this.element = newElement("div", "barrier");

    const border = newElement("div", "border");
    const body = newElement("div", "body");

    this.element.appendChild(reverse ? body : border);
    this.element.appendChild(reverse ? border : body);

    this.setHeight = (height) => {
        body.style.height = `${height}px`;
    };
}

function PairOfBarriers(height, opening, x) {
    this.element = newElement("div", "pair-of-barriers");

    this.superior = new Barrier(true);
    this.inferior = new Barrier(false);

    this.element.appendChild(this.superior.element);
    this.element.appendChild(this.inferior.element);

    this.sortOpening = () => {
        const supHeight = Math.random() * (height - opening);
        const infHeight = height - opening - supHeight;
        this.superior.setHeight(supHeight);
        this.inferior.setHeight(infHeight);
    };

    this.getX = () => {
        x = parseInt(this.element.style.left.split("px")[0]);
        return x;
    };

    this.setX = (x) => {
        this.element.style.left = `${x}px`;
    };

    this.getWidth = () => {
        return this.element.clientWidth;
    };

    this.sortOpening();
    this.setX(x);
}

function Barriers(height, width, opening, space, notifyScore) {
    this.pairs = [
        new PairOfBarriers(height, opening, width),
        new PairOfBarriers(height, opening, width + space),
        new PairOfBarriers(height, opening, width + space * 2),
        new PairOfBarriers(height, opening, width + space * 3),
    ];

    const movement = 3;
    this.animate = () => {
        this.pairs.forEach((pair) => {
            pair.setX(pair.getX() - movement);

            if (pair.getX() < -130) {
                pair.setX(pair.getX() + space * this.pairs.length);
                pair.sortOpening();
            }

            const middle = width / 2;
            const crossedMiddle =
                pair.getX() + movement >= middle && pair.getX() < middle;
            if (crossedMiddle) {
                notifyScore();
            }
        });
    };
}

function Bird(gameHeight) {
    let flying = false;

    this.element = newElement("img", "bird");
    this.element.src = "imgs/bird.png";

    this.getY = () => {
        y = parseInt(this.element.style.bottom.split("px")[0]);
        return y;
    };

    this.setY = (y) => {
        this.element.style.bottom = `${y}px`;
    };

    window.onkeydown = (e) => {
        flying = true;
    };

    window.onkeyup = (e) => {
        flying = false;
    };

    this.animate = () => {
        const newY = this.getY() + (flying ? 8 : -5);
        const maxHeight = 563;

        if (newY <= 0) {
            this.setY(0);
        } else if (newY >= maxHeight) {
            this.setY(maxHeight);
        } else {
            this.setY(newY);
        }
    };

    this.setY(gameHeight / 2);
}

flappyBird();
