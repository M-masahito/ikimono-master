// =======================================
// ホーム画面への追加案内
// =======================================

export function showInstallGuide() {

    // ホーム画面のアイコンから開いた時は案内を省略
    const isApp =
        window.navigator.standalone === true ||
        window.matchMedia(
            "(display-mode: standalone)"
        ).matches;

    if (isApp) {
        return Promise.resolve();
    }

    return new Promise(resolve => {

        const dialog = document.createElement("dialog");

        dialog.className = "ikimono-install";
        dialog.setAttribute(
            "aria-label",
            "いきものマスターへようこそ"
        );

        dialog.innerHTML = `
            <style>
                .ikimono-install {
                    position: fixed;
                    inset: 0;
                    width: 100%;
                    max-width: none;
                    height: 100%;
                    max-height: none;
                    margin: 0;
                    padding: 0;
                    border: 0;
                    color: #fff;
                    background: #173c29;
                    box-sizing: border-box;
                }

                .ikimono-install::backdrop {
                    background: #173c29;
                }

                .ikimono-install .install-world {
                    min-height: 100%;
                    box-sizing: border-box;
                    padding:
                        calc(32px + env(safe-area-inset-top))
                        24px
                        calc(32px + env(safe-area-inset-bottom));
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    background:
                        linear-gradient(#173c2966, #173c29ee),
                        url("./assets/home-forest.png")
                        center / cover;
                }

                .ikimono-install h1 {
                    color: #fff0bd;
                    font-size: clamp(28px, 8vw, 40px);
                    margin: 0 0 12px;
                }

                .ikimono-install p {
                    line-height: 1.8;
                }

                .ikimono-install .install-egg {
                    width: min(60vw, 250px);
                    height: min(60vw, 250px);
                    object-fit: contain;
                    margin: 20px 0;
                    filter: drop-shadow(0 0 22px #ffe5a0);
                }

                .ikimono-install button {
                    font: inherit;
                    cursor: pointer;
                    width: min(100%, 340px);
                    padding: 16px;
                    border-radius: 28px;
                }

                .ikimono-install .install-main {
                    background: linear-gradient(
                        135deg, #fff1c2, #dfb54f
                    );
                    color: #244532;
                    border: 1px solid #fff1c2;
                    font-weight: bold;
                }

                .ikimono-install .install-play {
                    margin-top: 18px;
                    background: transparent;
                    border: 1px solid #ffffff80;
                    color: #fff;
                }

                .ikimono-install .install-help {
                    width: min(100%, 340px);
                    box-sizing: border-box;
                    margin-top: 20px;
                    padding: 20px;
                    border-radius: 20px;
                    background: #fff8e9;
                    color: #244532;
                    text-align: left;
                    line-height: 1.9;
                }

                .ikimono-install .install-help[hidden] {
                    display: none;
                }
            </style>

            <div class="install-world">
                <h1>いきものマスター</h1>

                <p>
                    きみの発見が、命を育てる。<br>
                    不思議な卵と、冒険に出かけよう。
                </p>

                <img
                    class="install-egg"
                    src="./assets/spiria/spiria_egg.png"
                    alt="不思議な精霊の卵"
                >

                <button class="install-main" type="button">
                    ホーム画面に追加して遊ぶ
                </button>

                <div
                    class="install-help"
                    role="status"
                    hidden
                >
                    <strong>iPhone・iPad</strong><br>
                    ① Safariでこのページを開く<br>
                    ② 共有ボタン（四角に上向きの矢印）を押す<br>
                    ③「ホーム画面に追加」を選ぶ<br>
                    ④「追加」を押す<br>
                    ⑤ ホーム画面のアイコンから開こう！
                    <br><br>

                    <strong>Android</strong><br>
                    Chromeのメニュー「︙」から、<br>
                    「ホーム画面に追加」または<br>
                    「アプリをインストール」を選んでね。
                </div>

                <button class="install-play" type="button">
                    追加せずに遊ぶ
                </button>
            </div>
        `;

        const addButton =
            dialog.querySelector(".install-main");

        const playButton =
            dialog.querySelector(".install-play");

        const help =
            dialog.querySelector(".install-help");

        addButton.addEventListener("click", () => {
            help.hidden = false;
            help.scrollIntoView({
                block: "nearest"
            });
        });

        function finish() {
            dialog.close();
            dialog.remove();
            resolve();
        }

        playButton.addEventListener("click", finish);

        dialog.addEventListener("cancel", event => {
            event.preventDefault();
            finish();
        });

        document.body.appendChild(dialog);
        dialog.showModal();
        addButton.focus();
    });
}