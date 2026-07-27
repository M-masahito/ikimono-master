// =====================================
// screens/catalog.js
// =====================================

import { getSave } from "../system/storage.js";

export function showCatalog(screen) {

    const save = getSave();

    screen.innerHTML = `
        <div class="card">

            <h2>📖 図鑑</h2>

            <p>発見した生き物</p>

            <h3 id="discoverCount">${save.discovered.length} / 500</h3>

            <input
                id="searchBox"
                type="text"
                placeholder="名前で検索">

            <br><br>

            <div id="catalogList" class="catalog-grid"></div>

        </div>
    `;

    const list = screen.querySelector("#catalogList");
    const searchBox = screen.querySelector("#searchBox");

    function draw(keyword = "") {

        const word = keyword.trim().toLowerCase();

        list.innerHTML = "";

        const data = window.IKIMONO_DATA || [];

        data
            .filter(item =>
                item.name.toLowerCase().includes(word)
            )
            .forEach(item => {

                const found =
                    save.discovered.includes(item.no);

                const card = document.createElement("div");

                card.className =
                    "catalog-card " +
                    (found ? "found" : "unknown");

                card.innerHTML = `
                    <div class="catalog-no">
                        No.${String(item.no).padStart(3, "0")}
                    </div>

                    <div class="catalog-image">

                        ${
                            found
                                ? `<img src="images/${String(item.no).padStart(3,"0")}.png"
                                       onerror="this.src='images/unknown.png'">`
                                : `<img src="images/unknown.png">`
                        }

                    </div>

                    <div class="catalog-name">
                        ${found ? item.name : "？？？？？"}
                    </div>

                    <div class="catalog-rarity">
                        ${found ? item.rarity : "?"}
                    </div>

                    <div class="catalog-category">
                        ${found ? item.category : ""}
                    </div>
                `;
                                card.addEventListener("click", () => {

                    if (!found) return;

                    showDetail(item);

                });

                list.appendChild(card);

            });

        if (list.innerHTML === "") {

            list.innerHTML = `
                <div class="catalog-empty">
                    該当する生き物がありません
                </div>
            `;

        }

    }

    function showDetail(item) {

        const overlay = document.createElement("div");

        overlay.className = "catalog-detail-overlay";

        overlay.innerHTML = `
            <div class="catalog-detail">

                <button class="catalog-close">✕</button>

                <h2>
                    No.${String(item.no).padStart(3,"0")}
                    ${item.name}
                </h2>

                <img
                    src="images/${String(item.no).padStart(3,"0")}.png"
                    onerror="this.src='images/unknown.png'">

                <p><b>レア度</b>：${item.rarity}</p>
                <p><b>カテゴリ</b>：${item.category}</p>
                <p><b>タイプ</b>：${item.attribute}</p>
                <p><b>生息地</b>：${item.habitat}</p>
                <p><b>季節</b>：${item.season}</p>
                <p><b>大きさ</b>：${item.size}</p>
                <p><b>食べ物</b>：${item.food}</p>

                <hr>

                <p>${item.description}</p>

            </div>
        `;

        overlay
            .querySelector(".catalog-close")
            .addEventListener("click", () => {

                overlay.remove();

            });

        overlay.addEventListener("click", e => {

            if (e.target === overlay) {

                overlay.remove();

            }

        });

        document.body.appendChild(overlay);

    }

    searchBox.addEventListener("input", e => {

        draw(e.target.value);

    });

    draw();

}