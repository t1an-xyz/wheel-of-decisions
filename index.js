let canvas = document.getElementById('wheel');
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
let choices = ["Foo", "Bar"]

function drawWheel(offset) {
    const COLORS = ["red", "yellow", "green", "blue"];
    const TEXTCOLORS = ["white", "black", "white", "white"];
    const RADIUS = width / 2 - 20;
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
            choices.splice(idx, idx);
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
        drawWheel(0);
    })
    td.appendChild(input);
    tr.appendChild(td);
    form.appendChild(tr);
    return tr;
}

function displayChoices() {
    const form = document.getElementById("options");
    choices.forEach(choice => {
        createInput(choice);
    })
    createInput("");
}

displayChoices();