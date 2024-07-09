let canvas = document.getElementById('wheel');
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;

function drawWheel(choices, offset) {
    const COLORS = ["red", "yellow", "green", "blue"];
    const TEXTCOLORS = ["white", "black", "white", "white"];
    const RADIUS = width / 2 - 20;
    slice_angle = 2 * Math.PI / choices.length;
    ctx.rotate(offset);
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

drawWheel(["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot"], 0);