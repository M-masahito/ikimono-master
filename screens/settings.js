// =======================================
// 設定
// =======================================

import { getSave, update } from "../system/storage.js";
import { showOpening } from "./opening.js";
import { openScreen } from "../app.js";

export function showSettings(screen) {
    screen.innerHTML = `
        <section class="ikimono-settings">
            <style>
                .ikimono-settings {
                    max-width: 460px;
                    margin: 24px auto;
                    padding: 24px;
                    border-radius: 24px;
                    background: #fffaf0;
                    color: #254b35;
                    box-sizing: border-box;
                }
                .ikimono-settings h2 {
                    margin: 20px 0 24px;
                }
                .ikimono-settings label {
                    display: block;
                    margin-bottom: 10px;
                    font-weight: bold;
                }
                .ikimono-settings input {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 14px;
                    border: 1px solid #b9cdbb;
                    border-radius: 12px;
                    font: inherit;
                    background: #fff;
                    color: #254b35;
                }
                .ikimono-settings button {
                    min-height: 48px;
                    padding: 12px 18px;
                    border: 1px solid #b9cdbb;
                    border-radius: 16px;
                    background: #fff;
                    color: #254b35;
                    font: inherit;
                    font-weight: bold;
                    cursor: pointer;
                }
                .ikimono-settings .settings-action {
                    width: 100%;
                    margin-top: 16px;
                }
                .ikimono-settings .settings-save {
                    background: #254b35;
                    color: #fff;
                }
                .ikimono-settings .settings-message {
                    min-height: 24px;
                    line-height: 1.6;
                }
            </style>

            <button id="settingsBack" type="button">
                ← 戻る
            </button>

            <h2>⚙️ 設定</h2>

            <form id="settingsNameForm">
                <label for="settingsPlayerName">
                    冒険者のニックネーム
                </label>

                <input
                    id="settingsPlayerName"
                    type="text"
                    maxlength="12"
                    autocomplete="nickname"
                    placeholder="1〜12文字"
                    aria-describedby="settingsMessage"
                    required
                >

                <button
                    class="settings-action settings-save"
                    type="submit"
                >
                    名前を保存する
                </button>
            </form>

            <p
                id="settingsMessage"
                class="settings-message"
                role="status"
            ></p>

            <button
                id="settingsOpening"
                class="settings-action"
                type="button"
            >
                📖 冒険のはじまり・遊び方
            </button>
        </section>
    `;

    const nameInput =
        screen.querySelector("#settingsPlayerName");

    const message =
        screen.querySelector("#settingsMessage");

    nameInput.value =
        String(getSave().playerName ?? "");

    screen.querySelector("#settingsBack")
        .addEventListener("click", () => {
            openScreen("home");
        });

    screen.querySelector("#settingsNameForm")
        .addEventListener("submit", event => {
            event.preventDefault();

            const playerName = nameInput.value.trim();

            if (
                !playerName ||
                Array.from(playerName).length > 12
            ) {
                message.textContent =
                    "名前を1〜12文字で入れてね。";
                nameInput.focus();
                return;
            }

            try {
                update({ playerName });
                nameInput.value = playerName;
                message.textContent =
                    "名前を保存したよ！";
            } catch (error) {
                console.error("名前の保存に失敗しました。", error);
                message.textContent =
                    "保存できなかったよ。もう一度試してね。";
            }
        });

    screen.querySelector("#settingsOpening")
        .addEventListener("click", async event => {
            const button = event.currentTarget;
            button.disabled = true;

            try {
                await showOpening({ replay: true });
            } finally {
                button.disabled = false;
            }
        });
}