// =======================================
// 図鑑レベル管理
// =======================================

export function getCatalogLevel(discoveredCount) {

    const level = Math.min(
        8,
        Math.floor(discoveredCount / 50) + 1
    );

    return level;

}

export function getUnlockedMaxNo(level) {

    return Math.min(level * 100, 700);

}

export function getNextLevelCount(level) {

    if (level >= 8) {

        return null;

    }

    return level * 50;

}