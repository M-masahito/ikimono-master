import { openScreen } from "../app.js";

export function showQuest(screen) {
    screen.innerHTML = `
        <section class="card">
            <button id="questBackButton" type="button">
                ← もどる
            </button>

            <h1>クエスト</h1>
            <p>クエストを準備中だよ！</p>
        </section>
    `;

    screen
        .querySelector("#questBackButton")
        ?.addEventListener("click", () => {
            openScreen("home");
        });
}