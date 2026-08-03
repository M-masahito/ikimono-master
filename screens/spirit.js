// =====================================
// screens/spirit.js Ver10
// =====================================

import { getSave } from "../system/storage.js";

export function showSpirit(screen) {

    const save = getSave();

    const discovered =
        save.discovered?.length ?? 0;

    const spiritName =
        save.spirit?.name ??
        "ふしぎなたまご";

    const spiritTitle =
        save.spirit?.title ??
        "たまご";

    const equippedSpiria =
        save.spirit?.equippedSpiria ??
        null;

    const spiria =
        save.spiria ?? [];

    screen.innerHTML = `

    <div class="card">

        <h2>✨ 精霊</h2>

        <h3>${spiritName}</h3>

        <p>
            称号：
            ${spiritTitle}
        </p>

        <p>
            発見した種類：
            ${discovered} / 500
        </p>

        <hr>

        <h3>🌟 装備中のスピリア</h3>

        <p>
            ${
                equippedSpiria ??
                "まだ装備していません"
            }
        </p>

        <hr>

        <h3>📚 持っているスピリア</h3>

        ${
            spiria.length === 0

            ?

            `<p>
                まだありません
            </p>`

            :

            `<ul>

                ${spiria.map(item => `
                    <li>${item}</li>
                `).join("")}

            </ul>`
        }

    </div>

    `;

}