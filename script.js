const studentsInput = document.getElementById("students");
const daylightInput = document.getElementById("daylight");
const manualInput = document.getElementById("manual");

const activeDevices = document.getElementById("activeDevices");
const energyStatus = document.getElementById("energyStatus");
const energyDescription = document.getElementById("energyDescription");

const lightCard = document.getElementById("lightCard");
const fanCard = document.getElementById("fanCard");

const activityLog = document.getElementById("activityLog");

let previousState = "";

function logActivity(title, description) {
    const item = document.createElement("li");

    const dot = document.createElement("span");
    dot.className = "activity-dot";

    const content = document.createElement("div");

    const heading = document.createElement("strong");
    heading.text
