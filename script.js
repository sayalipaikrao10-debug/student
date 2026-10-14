const state = {
    auto: true,
    occupied: true,
    light: true,
    fan: true,
    brightness: 80,
    fanSpeed: "Medium",
    temperature: 25
};

const $ = id => document.getElementById(id);

let toastTimer;

function notify(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2400);
}

function addActivity(icon, title, detail) {
    const list = $("activityList");
    const item = document.createElement("div");

    item.className = "activity";

    const iconElement = document.createElement("span");
    iconElement.className = "activity-icon";
    iconElement.textContent = icon;

    const details = document.createElement("div");

    const strong = document.createElement("strong");
    strong.textContent = title;

    const small = document.createElement("small");
    small.textContent = detail;

    const time = document.createElement("time");
    time.textContent = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    details.append(strong, small);
    item.append(iconElement, details, time);

    list.prepend(item);

    while (list.children.length > 5) {
        list.lastElementChild.remove();
    }
}

function updateDashboard() {
    const lightPower = state.light
        ? Math.round(120 * state.brightness / 100)
        : 0;

    const fanPower = state.fan
        ? ({ Low: 25, Medium: 40, High: 60 }[state.fanSpeed])
        : 0;

    const totalPower = lightPower + fanPower;

    $("powerValue").textContent = totalPower;
    $("studentCount").textContent = state.occupied ? "24" : "0";

    $("occupancyText").textContent = state.occupied
        ? "● Classroom occupied"
        : "● Classroom empty";

    $("occupancyText").className = state.occupied
        ? "positive"
        : "muted";

    $("savingValue").textContent = state.occupied
        ? Math.max(0, Math.round((180 - totalPower) / 180 * 100))
        : 100;

    $("temperatureValue").textContent = state.temperature;

    $("lightState").textContent = state.light ? "ON" : "OFF";
    $("lightState").classList.toggle("off", !state.light);

    $("fanState").textContent = state.fan ? "ON" : "OFF";
    $("fanState").classList.toggle("off", !state.fan);

    $("brightness").textContent = state.brightness + "%";
    $("brightnessSlider").value = state.brightness;

    $("fanSpeed").textContent = state.fanSpeed;

    $("lightButton").textContent = state.light
        ? "Turn Lights OFF"
        : "Turn Lights ON";

    $("fanButton").textContent = state.fan
        ? "Turn Fan OFF"
        : "Turn Fan ON";

    $("presenceValue").textContent = state.occupied
        ? "Student detected"
        : "No student detected";

    $("presenceButton").textContent = state.occupied
        ? "Simulate Empty Room"
        : "Simulate Student Arrival";

    $("sensorState").textContent = state.occupied
        ? "OCCUPIED"
        : "NO PRESENCE";

    $("autoButton").textContent = state.auto
        ? "⚡ Auto Mode: ON"
        : "⚙ Manual Mode: ON";

    $("heroStatus").textContent = state.auto
        ? "● Automatic control enabled"
        : "● Manual control enabled";

    document.querySelectorAll("[data-speed]").forEach(button => {
        button.classList.toggle(
            "selected",
            button.dataset.speed === state.fanSpeed
        );
    });

    $("presenceButton").disabled = false;

    document.querySelector(".sensor-visual").style.opacity =
        state.occupied ? "1" : ".55";
}

function applyAutomaticControl() {
    if (!state.auto) return;

    if (!state.occupied) {
        state.light = false;
        state.fan = false;
    } else {
        state.light = true;
        state.fan = state.temperature >= 24;
    }
}

$("autoButton").addEventListener("click", () => {
    state.auto = !state.auto;

    applyAutomaticControl();
    updateDashboard();

    notify(state.auto
        ? "Automatic energy control enabled"
        : "Manual control enabled");

    addActivity(
        "⚙️",
        state.auto ? "Auto mode enabled" : "Manual mode enabled",
        "Control settings updated"
    );
});

$("lightButton").addEventListener("click", () => {
    if (state.auto) {
        notify("Switch to Manual Mode to control lights");
        return;
    }

    state.light = !state.light;
    updateDashboard();

    notify("Lights turned " + (state.light ? "ON" : "OFF"));

    addActivity(
        "💡",
        "Lighting switched " + (state.light ? "ON" : "OFF"),
        "Manual device control"
    );
});

$("fanButton").addEventListener("click", () => {
    if (state.auto) {
        notify("Switch to Manual Mode to control the fan");
        return;
    }

    state.fan = !state.fan;
    updateDashboard();

    notify("Fan turned " + (state.fan ? "ON" : "OFF"));

    addActivity(
        "🌀",
        "Fan switched " + (state.fan ? "ON" : "OFF"),
        "Manual device control"
    );
});

$("brightnessSlider").addEventListener("input", event => {
    if (state.auto) {
        notify("Switch to Manual Mode to adjust brightness");
        updateDashboard();
        return;
    }

    state.brightness = Number(event.target.value);

    if (state.brightness === 0) {
        state.light = false;
    } else {
        state.light = true;
    }

    updateDashboard();
});

document.querySelectorAll("[data-speed]").forEach(button => {
    button.addEventListener("click", () => {
        if (state.auto) {
            notify("Switch to Manual Mode to change fan speed");
            return;
        }

        state.fanSpeed = button.dataset.speed;
        state.fan = true;

        updateDashboard();

        notify("Fan speed set to " + state.fanSpeed);

        addActivity(
            "🌀",
            "Fan speed changed",
            "Speed: " + state.fanSpeed
        );
    });
});

$("presenceButton").addEventListener("click", () => {
    state.occupied = !state.occupied;

    applyAutomaticControl();
    updateDashboard();

    notify(state.occupied
        ? "Student arrival detected"
        : "Empty room detected");

    addActivity(
        "📡",
        state.occupied ? "Presence detected" : "Classroom empty",
        state.auto
            ? "Automatic device rules applied"
            : "Manual mode: devices unchanged"
    );
});

document.querySelectorAll(".nav").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".nav").forEach(nav => {
            nav.classList.remove("active");
        });

        button.classList.add("active");

        const target = button.dataset.target;

        if (target === "dashboard") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (target === "devices") {
            $("devices").scrollIntoView({ behavior: "smooth" });
        } else if (target === "energy") {
            $("energy").scrollIntoView({ behavior: "smooth" });
        }
    });
});

applyAutomaticControl();
updateDashboard();
