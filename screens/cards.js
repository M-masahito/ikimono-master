// =====================================
// screens/camera.js
// AI判定画面
// =====================================

export function showCamera(screen) {

    screen.innerHTML = `

        <div class="card">

            <h2>📷 AI判定</h2>

            <p>
                生き物の写真を選択してください。
            </p>

            <input
                id="photoInput"
                type="file"
                accept="image/*"
                capture="environment">

            <br><br>

            <div id="previewArea"></div>

            <button
                id="judgeButton"
                class="mainButton"
                disabled>

                🤖 AI判定する

            </button>

            <br><br>

            <div id="judgeResult">

                写真を選択してください。

            </div>

        </div>

    `;

    const photoInput =
        screen.querySelector("#photoInput");

    const previewArea =
        screen.querySelector("#previewArea");

    const judgeButton =
        screen.querySelector("#judgeButton");

    const judgeResult =
        screen.querySelector("#judgeResult");

    let imageFile = null;

    // ------------------------
    // 写真選択
    // ------------------------

    photoInput.addEventListener("change", e => {

        imageFile = e.target.files[0];

        if (!imageFile) return;

        const reader = new FileReader();

        reader.onload = () => {

            previewArea.innerHTML = `

                <img
                    src="${reader.result}"
                    class="cameraPreview">

            `;

        };

        reader.readAsDataURL(imageFile);

        judgeButton.disabled = false;

        judgeResult.innerHTML =
            "AI判定の準備ができました。";

    });

    // ------------------------
    // AI判定
    // ------------------------

    judgeButton.addEventListener("click", async () => {

        judgeButton.disabled = true;

        judgeResult.innerHTML = `
            🤖 AI判定中...
        `;

        await new Promise(resolve =>
            setTimeout(resolve, 1500)
        );

        // ------------------------
        // 仮データ
        // 後でAIへ置き換える
        // ------------------------

        const result = {

            name: "カブトムシ",

            rarity: "B",

            confidence: 98

        };

        judgeResult.innerHTML = `

            <h3>🎉 判定結果</h3>

            <p><b>${result.name}</b></p>

            <p>レア度：${result.rarity}</p>

            <p>一致率：${result.confidence}%</p>

            <br>

            <p>
                図鑑登録機能は次に追加します。
            </p>

        `;

        judgeButton.disabled = false;

    });

}