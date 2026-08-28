// =======================================
// system/storage.js
// セーブデータ管理 Ver2
// =======================================

const SAVE_KEY = "ikimonoSave";

const DEBUG_BACKUP_KEY =
    "ikimonoSaveDebugBackup";

const DEBUG_BACKUP_AT_KEY =
    "ikimonoSaveDebugBackupAt";

const DEFAULT_SAVE = {
    discovered: [],
    discoveredCards: [],
    cards: [],
    discoveryHistory: [],
    lastDiscovery: null,

  spirit: {
    name: "ふしぎなたまご",
    level: 1,
    exp: 0,
    form: 0,
    title: "たまご",
    equippedSpiria: "base",
    stage: 1
},

    emblems: [],
    spiria: [],

    settings: {
        sound: true,
        vibration: true
    }
};

// =======================================
// 初期データを複製
// =======================================

function createDefaultSave() {
    return structuredClone(DEFAULT_SAVE);
}

// =======================================
// セーブデータ取得
// =======================================

export function getSave() {

    const json = localStorage.getItem(SAVE_KEY);

    if (!json) {

        const initialSave = createDefaultSave();

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(initialSave)
        );

        return initialSave;
    }

    try {

        const storedSave = JSON.parse(json);

        const normalizedSave = {
            ...createDefaultSave(),
            ...storedSave,

            discovered: Array.isArray(storedSave.discovered)
                ? storedSave.discovered
                : [],

            discoveredCards: Array.isArray(storedSave.discoveredCards)
                ? storedSave.discoveredCards
                : [],

            cards: Array.isArray(storedSave.cards)
                ? storedSave.cards
                : [],

            discoveryHistory: Array.isArray(storedSave.discoveryHistory)
                ? storedSave.discoveryHistory
                : [],

            spirit: {
                ...createDefaultSave().spirit,
                ...(storedSave.spirit || {})
            },

            settings: {
                ...createDefaultSave().settings,
                ...(storedSave.settings || {})
            }
        };

        return normalizedSave;

    } catch (error) {

        console.error(
            "セーブデータが壊れていたため初期化しました。",
            error
        );

        const initialSave = createDefaultSave();

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(initialSave)
        );

        return initialSave;
    }
}

// =======================================
// セーブ
// =======================================

export function save(data) {

    const safeData = {
        ...createDefaultSave(),
        ...(data || {})
    };

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(safeData)
    );

    return safeData;
}

// =======================================
// 更新
// オブジェクトと関数の両方に対応
// =======================================

export function update(updater) {

    const currentSave = getSave();

    let updatedSave;

    if (typeof updater === "function") {

        const workingSave = structuredClone(currentSave);

        const result = updater(workingSave);

        updatedSave =
            result && typeof result === "object"
                ? result
                : workingSave;

    } else if (
        updater &&
        typeof updater === "object"
    ) {

        updatedSave = {
            ...currentSave,
            ...updater
        };

    } else {

        console.warn(
            "update() に正しい更新内容が渡されませんでした。"
        );

        return currentSave;
    }

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(updatedSave)
    );

    return updatedSave;
}

// =======================================
// 発見番号も同期
// =======================================

export function syncDiscoveredNumbers() {

    const currentSave = getSave();

    const numbers = currentSave.discoveredCards
        .map(card => Number(card.no))
        .filter(number => Number.isFinite(number));

    const uniqueNumbers = [
        ...new Set(numbers)
    ];

    return update({
        discovered: uniqueNumbers
    });
}

// =======================================
// 初期化
// =======================================

export function resetSave() {

    const initialSave = createDefaultSave();

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(initialSave)
    );

    return initialSave;
}


// =======================================
// デバッグテスト前のセーブ退避
// =======================================

export function createDebugBackup() {

    const existingBackup =
        localStorage.getItem(
            DEBUG_BACKUP_KEY
        );

    if (existingBackup) {

        return localStorage.getItem(
            DEBUG_BACKUP_AT_KEY
        );

    }


    const currentSave = getSave();

    localStorage.setItem(
        DEBUG_BACKUP_KEY,
        JSON.stringify(currentSave)
    );

    const backupAt =
        new Date().toISOString();

    localStorage.setItem(
        DEBUG_BACKUP_AT_KEY,
        backupAt
    );

    return backupAt;
}