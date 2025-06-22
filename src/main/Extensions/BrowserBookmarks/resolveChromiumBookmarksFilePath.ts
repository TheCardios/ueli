import type { OperatingSystem } from "@common/Core";
import type { ChromiumBrowser } from "@common/Extensions/BrowserBookmarks";
import type { App } from "electron";
import { readFileSync } from "fs";
import { join } from "path";

export const resolveChromiumBookmarksFilePath = ({
    browser,
    operatingSystem,
    app,
}: {
    browser: ChromiumBrowser;
    operatingSystem: OperatingSystem;
    app: App;
}): string => {
    const map: Record<ChromiumBrowser, Record<OperatingSystem, () => string>> = {
        Arc: {
            Linux: () => "", // not supported
            Windows: () => join(app.getPath("home"), "AppData", "Local", "Arc", "User Data"),
            macOS: () => join(app.getPath("appData"), "Arc", "User Data"),
        },
        "Brave Browser": {
            Linux: () => "", // not supported
            macOS: () => join(app.getPath("appData"), "BraveSoftware", "Brave-Browser"),
            Windows: () => join(app.getPath("home"), "AppData", "Local", "BraveSoftware", "Brave-Browser", "User Data"),
        },
        "Google Chrome": {
            Linux: () => "", // not supported
            macOS: () => join(app.getPath("appData"), "Google", "Chrome"),
            Windows: () => join(app.getPath("home"), "AppData", "Local", "Google", "Chrome", "User Data"),
        },
        "Microsoft Edge": {
            Linux: () => "", // not supported
            macOS: () => join(app.getPath("appData"), "Microsoft Edge"),
            Windows: () => join(app.getPath("home"), "AppData", "Local", "Microsoft", "Edge", "User Data"),
        },
        "Yandex Browser": {
            Linux: () => "", // not supported
            macOS: () => join(app.getPath("appData"), "Yandex", "YandexBrowser"),
            Windows: () => join(app.getPath("home"), "AppData", "Local", "Yandex", "YandexBrowser", "User Data"),
        },
    };

    const userDataPath = map[browser][operatingSystem]();

    let profile = "Default";

    try {
        const localState = JSON.parse(readFileSync(join(userDataPath, "Local State"), "utf-8"));

        if (localState.profile && typeof localState.profile.last_used === "string") {
            profile = localState.profile.last_used;
        }
    } catch (error) {
        // ignore errors and fall back to Default profile
    }

    return join(userDataPath, profile, "Bookmarks");
};
