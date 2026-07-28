// =======================================
// いきものマスター Ver2
// app.js
// =======================================

import { getSave } from "./system/storage.js";

import { showHome } from "./screens/home.js";
import { showCamera } from "./screens/camera.js";
import { showCatalog } from "./screens/catalog.js";

import { showSpirit } from "./screens/spirit.js";

const screen = document.getElementById("screen");

const screens = {
    home: showHome,
    camera: showCamera,
    catalog: showCatalog,

    spirit: showSpirit
};

startApp();

function startApp() {

    getSave();

    createNavigation();

    openScreen("home");

}

function createNavigation() {

    const buttons =
        document.querySelectorAll("#bottomNav button");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            openScreen(button.dataset.screen);

        });

    });

}

export function openScreen(name) {

    document
        .querySelectorAll("#bottomNav button")
        .forEach(button =>
            button.classList.remove("active")
        );

    document
        .querySelector(`[data-screen="${name}"]`)
        ?.classList.add("active");

    screen.innerHTML = "";

    if (screens[name]) {

        screens[name](screen);

    } else {

        screen.innerHTML = `
            <div class="card">
                <h2>準備中</h2>
                <p>${name} はまだ作成中です。</p>
            </div>
        `;

    }

}