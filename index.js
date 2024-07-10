let canvas = document.getElementById('wheel');
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
const RADIUS = width / 2 - 20;
let choices = ["Foo", "Bar"]
let raf;

const popupBG = document.querySelector('.popup-bg');
const removeBtn = document.getElementById("remove-el");
const resultDisplay = document.getElementById('winner');
const form = document.getElementById("options");

let wheelProperties = {
    'velocity': 0,
    'offset': 0,
    'acceleration': 0,
    'end': 0,
}

function drawTicker() {
    ctx.resetTransform();
    ctx.beginPath();
    ctx.moveTo(width / 2 + RADIUS - 20, height / 2);
    ctx.lineTo(width, height / 2 + 20);
    ctx.lineTo(width, height / 2 - 20);
    ctx.closePath();
    ctx.fillStyle = "gray";
    ctx.fill();
}

function drawWheel(offset) {
    const COLORS = ["red", "yellow", "green", "blue"];
    const TEXTCOLORS = ["white", "black", "white", "white"];

    slice_angle = 2 * Math.PI / choices.length;
    ctx.translate(width / 2, height / 2)
    ctx.rotate(offset - slice_angle);
    ctx.translate(width / -2, height / -2);
    for (let i = 0; i < choices.length; i++) {
        ctx.translate(width / 2, height / 2)
        ctx.rotate(slice_angle);
        ctx.translate(width / -2, height / -2);
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(width / 2 + RADIUS * Math.cos(slice_angle / 2), height / 2 + RADIUS * Math.sin(slice_angle / 2));
        ctx.arc(width / 2, height / 2, RADIUS, slice_angle / 2, slice_angle / -2, true);
        ctx.closePath()
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fill();

        ctx.font = "36px sans-serif";
        ctx.fillStyle = TEXTCOLORS[i % TEXTCOLORS.length];
        ctx.fillText(choices[i], width / 2 + 100, height / 2 + 18, RADIUS - 100);
    }
    ctx.resetTransform();
    drawTicker();
}

drawWheel(0);

function createInput(s) {
    const form = document.getElementById("options");
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.value = s;
    input.addEventListener("focusin", event => {
        if (tr.nextElementSibling == null) {
            createInput("");
        }
    });
    input.addEventListener("focusout", event => {
        let nodes = Array.prototype.slice.call( form.children );
        let idx = nodes.indexOf(tr);
        if (input.value == "") {
            tr.remove();
            choices.splice(idx, 1);
        }
        else {
            if (idx == choices.length) {
                choices.push(input.value);
            }
            else {
                choices[idx] = input.value;
            }
        }
        ctx.resetTransform();
        drawWheel(wheelProperties.offset);
    })
    td.appendChild(input);
    tr.appendChild(td);
    form.appendChild(tr);
    return tr;
}

function displayChoices() {
    choices.forEach(choice => {
        createInput(choice);
    })
    createInput("");
}

displayChoices();

function spin() {
    ctx.resetTransform();
    ctx.clearRect(0, 0, width, height);
    wheelProperties.velocity += wheelProperties.acceleration;
    if (wheelProperties.velocity >= 2 * Math.PI * 3 / 60) {
        wheelProperties.acceleration = 0;
    }

    wheelProperties.offset += wheelProperties.velocity;
    drawWheel(wheelProperties.offset);

    if (wheelProperties.offset > wheelProperties.end) {
        wheelProperties.acceleration = -0.0005;
    }
    if (wheelProperties.velocity <= 0) {
        wheelProperties.velocity = 0;
        wheelProperties.acceleration = 0;
        ctx.resetTransform();
        const slice_angle = 2 * Math.PI / choices.length;
        let idx = Math.floor(((wheelProperties.offset - slice_angle / 2) % (2 * Math.PI)) / slice_angle) * -1 + choices.length - 1;
        console.log(choices[idx]);
        window.cancelAnimationFrame(raf);
        wheelProperties.offset = wheelProperties.offset % (2 * Math.PI);
        
        resultDisplay.innerText = choices[idx];
        popupBG.style.visibility = "visible";
        if (choices.length > 1) {
            removeBtn.style.display = "inline-block";
        }
        else {
            removeBtn.style.display = "none";
        }
        console.log("Test");
        
        removeBtn.onclick = () => {
            form.removeChild(form.children[idx]);
            choices.splice(idx, 1);
            drawWheel(wheelProperties.offset);
            popupBG.style.visibility = "hidden";
            console.log("Removed!");

        }

        return;
    }
    raf = window.requestAnimationFrame(spin);
}

canvas.addEventListener("click", event => {
    if (wheelProperties.velocity == 0 && choices.length > 0) {
        wheelProperties.acceleration = 0.01;
        wheelProperties.end = Math.random() * 2 * Math.PI + 5 * 2 * Math.PI + wheelProperties.offset;
        spin();
    }
})

popupBG.addEventListener("click", event => {
    if (event.target == popupBG) {
        popupBG.style.visibility = "hidden";
    }
    
})

document.getElementById('close-popup').addEventListener("click", event => {
    popupBG.style.visibility = "hidden";
})