const confettiCanvas = document.getElementById('confetti-canvas');
const jsConfetti = new JSConfetti({confettiCanvas});

let canvas = document.getElementById('wheel');
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
const RADIUS = width / 2 - 20;
let choices = [{name: "Foo", weight: 1, start: 0, end: Math.PI}, 
               {name: "Bar", weight: 1, start: Math.PI, end: 2 * Math.PI}]
let raf;
let totalWeight;

const beepSound = new Audio('audio/beep.wav');

const popupBG = document.querySelector('.popup-bg');
const removeBtn = document.getElementById("remove-el");
const resultDisplay = document.getElementById('winner');
const form = document.getElementById("options");

const copyBtn = document.getElementById('copy-link');

let wheelProperties = {
    'velocity': 0,
    'offset': Math.PI / -2,
    'acceleration': 0,
    'end': 0,
}

function calculateSlices() {
    totalWeight = choices.reduce((partialSum, item) => partialSum + item.weight, 0);
    let slice_angle = choices[0].weight / totalWeight * 2 * Math.PI;
    choices[0].start = 0;
    choices[0].end = slice_angle;
    for (let i = 1; i < choices.length; i++) {
        slice_angle = choices[i].weight / totalWeight * 2 * Math.PI;
        choices[i].start = choices[i-1].end;
        choices[i].end = choices[i].start + slice_angle;
    }
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

    ctx.translate(width / 2, height / 2)
    ctx.rotate(offset);
    ctx.translate(width / -2, height / -2);
    for (let i = 0; i < choices.length; i++) {
        const slice_angle = choices[i].end - choices[i].start;

        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(width / 2 + RADIUS, height / 2);
        ctx.arc(width / 2, height / 2, RADIUS, 0, slice_angle);
        ctx.closePath()
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fill();

        ctx.translate(width / 2, height / 2)
        ctx.rotate(slice_angle / 2);
        ctx.translate(width / -2, height / -2);

        const text_offset = 100;
        let font_size = Math.min(text_offset * Math.sin(slice_angle / 2) * 2, 36);
        if (slice_angle % Math.PI == 0) {
            font_size = 36;
        }
        ctx.font = `${font_size}px sans-serif`;
        ctx.fillStyle = TEXTCOLORS[i % TEXTCOLORS.length];
        ctx.fillText(choices[i].name, width / 2 + text_offset, height / 2 + font_size / 2, RADIUS - text_offset);

        ctx.translate(width / 2, height / 2)
        ctx.rotate(slice_angle / 2);
        ctx.translate(width / -2, height / -2);
    }
    ctx.resetTransform();
    drawTicker();
}

function createInput(s, w) {
    const form = document.getElementById("options");
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.required = true;
    input.value = s;

    const weightTd = document.createElement("td");
    const weightInput = document.createElement("input");
    weightInput.type = "number";
    weightInput.min = 1;
    weightInput.required = true;
    weightInput.value = w;
    weightInput.addEventListener("change", event => {
        let nodes = Array.prototype.slice.call(form.children);
        let idx = nodes.indexOf(tr);
        if (choices.length <= idx) {
            if (!weightInput.checkValidity()) {
                weightInput.value = 1;
            }
            return;
        }
        if (!weightInput.checkValidity()) {
            weightInput.value = choices[idx].weight;
        }
        choices[idx].weight = Number(weightInput.value);
        calculateSlices();
        ctx.resetTransform();
        ctx.clearRect(0, 0, width, height);
        drawWheel(wheelProperties.offset);

        copyBtn.href = `${window.location.origin}${window.location.pathname}?choices=${
            btoa(JSON.stringify(choices.map(item => ({name: item.name, weight: item.weight}))))}`;
    });
    weightInput.addEventListener("keypress", event => {
        if (event.key == "Enter") {
            tr.nextElementSibling.querySelector('input').focus();
        }
    })

    input.addEventListener("focusin", event => {
        if (tr.nextElementSibling == null) {
            createInput("", 1);
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
                choices.push({name: input.value, weight: Number(weightInput.value)});
            }
            else {
                choices[idx].name = input.value;
            }
        }
        calculateSlices();
        ctx.resetTransform();
        ctx.clearRect(0, 0, width, height);
        drawWheel(wheelProperties.offset);
        
        copyBtn.href = `${window.location.origin}${window.location.pathname}?choices=${
            btoa(JSON.stringify(choices.map(item => ({name: item.name, weight: item.weight}))))}`;
    })
    input.addEventListener("keypress", event => {
        if (event.key == "Enter") {
            tr.nextElementSibling.querySelector('input').focus();
        }
    })

    td.appendChild(input);
    weightTd.appendChild(weightInput);
    tr.appendChild(td);
    tr.appendChild(weightTd);
    form.appendChild(tr);
    return tr;
}

function displayChoices() {
    choices.forEach(choice => {
        createInput(choice.name, choice.weight);
    })
    createInput("", 1);
}

// Import wheel (if applicable)
let params = new URLSearchParams(window.location.search);
if (params.get('choices')) {
    console.log(atob(params.get('choices')));
    choices = JSON.parse(atob(params.get('choices')));
}

displayChoices();
calculateSlices();
drawWheel(wheelProperties.offset);

function spin() {
    let slice = Math.floor(wheelProperties.offset % (Math.PI * 2) / (2 * Math.PI / Math.max(totalWeight, 2)));

    ctx.resetTransform();
    ctx.clearRect(0, 0, width, height);
    wheelProperties.velocity += wheelProperties.acceleration;
    if (wheelProperties.velocity >= 2 * Math.PI * 3 / 60) {
        wheelProperties.acceleration = 0;
    }

    wheelProperties.offset += wheelProperties.velocity;
    drawWheel(wheelProperties.offset);

    let newSlice = Math.floor(wheelProperties.offset % (Math.PI * 2) / (2 * Math.PI / Math.max(totalWeight, 2)));
    if (newSlice != slice) {
        beepSound.play();
    }

    if (wheelProperties.offset > wheelProperties.end) {
        wheelProperties.acceleration = -0.0005;
    }
    if (wheelProperties.velocity <= 0) {
        wheelProperties.velocity = 0;
        wheelProperties.acceleration = 0;
        ctx.resetTransform();
        wheelProperties.offset %= 2 * Math.PI;
        for (let i = 0; i < choices.length; i++) {
            const rotation_angle = Math.PI * 2 - wheelProperties.offset;
            if (rotation_angle > choices[i].start && 
                rotation_angle <= choices[i].end
            ) {
                resultDisplay.innerText = choices[i].name;
                popupBG.style.visibility = "visible";
                if (choices.length > 1) {
                    removeBtn.style.display = "inline-block";
                }
                else {
                    removeBtn.style.display = "none";
                }
                jsConfetti.addConfetti();
                
                removeBtn.onclick = () => {
                    form.removeChild(form.children[i]);
                    choices.splice(i, 1);
                    calculateSlices();
                    drawWheel(wheelProperties.offset);
                    popupBG.style.visibility = "hidden";
        
                }
                return;
            }
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

copyBtn.href = window.location.href;

copyBtn.addEventListener("click", event => {
    event.preventDefault();
    navigator.clipboard.writeText(copyBtn.href);
    window.location.href = copyBtn.href;
})