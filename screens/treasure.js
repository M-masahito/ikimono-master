import { openScreen } from "../app.js";
import { getSave } from "../system/storage.js";

export function showTreasure(screen) {
    const save = getSave();
    const items = save.treasureItems ?? {};

    const allItems = [
        { id: "moon_fragment", icon: "🌙" },
        { id: "moon_drop", icon: "💧" },
        { id: "sesshoseki_fragment", icon: "🪨" },
        { id: "sesshoseki", icon: "🔮" }
    ];

    const ownedItems = allItems.filter(
        item => Number(items[item.id]) > 0
    );

    screen.innerHTML = `
        <section class="treasure-screen">
            <button id="treasureBackButton" type="button">
                ← もどる
            </button>

            <h1>アイテムボックス</h1>

            <div class="treasure-grid">
                ${ownedItems.map(item => `
                    <article class="treasure-card">
                        <div class="treasure-card-art">
                            <span>${item.icon}</span>
                        </div>
                    </article>
                `).join("")}
            </div>
        </section>
    `;

    screen
        .querySelector("#treasureBackButton")
        ?.addEventListener("click", () => openScreen("home"));
}