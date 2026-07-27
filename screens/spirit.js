// =====================================
// screens/spirit.js
// =====================================

import { getSave } from "../system/storage.js";

export function showSpirit(screen) {

    const save = getSave();

    screen.innerHTML = `

        <div class="card">

            <h2>✨ 精霊</h2>

            <h3>${save.spirit.title}</h3>

            <p>レベル：${save.spirit.level}</p>

            <progress
                value="${save.spirit.exp}"
                max="100">
            </progress>

            <br><br>

            <button
                class="mainButton"
                id="changeSpirit">

                姿を見る

            </button>

        </div>

    `;

}