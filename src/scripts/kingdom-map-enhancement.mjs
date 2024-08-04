import KingdomInfoMap from "./kingdom-info-map.mjs";

/**
 * The ID of this module
 * @type {string}
 */
const MODULE_ID = "pf2e-kingdom-map-enhancement";

/* -------------------------------------------- */
/*  Initialization                              */
/* -------------------------------------------- */

Hooks.once("init", function() {
    /**
     * Global reference to this module.
     * @type {}
     */
    globalThis.kingdominfo = game.modules.get(MODULE_ID);
});

/* -------------------------------------------- */
/*  Initialization                              */
/* -------------------------------------------- */

Hooks.once("setup", function() {
    console.log("Kingdom | Initializing Kingdom Map Enhancement");
    kingdominfo.kingdomInfoMap = new KingdomInfoMap();
    kingdominfo.kingdomInfoMap.loadTextures();
});

/* -------------------------------------------- */
/*  Canvas Events                               */
/* -------------------------------------------- */

Hooks.on("canvasInit", () => kingdominfo.kingdomInfoMap._onInit());
Hooks.on("canvasDraw", () => kingdominfo.kingdomInfoMap._onDraw());
Hooks.on("canvasReady", () => kingdominfo.kingdomInfoMap._onReady());
Hooks.on("getSceneControlButtons", buttons => kingdominfo.kingdomInfoMap._extendSceneControlButtons(buttons));

/* -------------------------------------------- */
/*  JHook on updateSetting                      */
/* -------------------------------------------- */

Hooks.on("updateSetting", () => kingdominfo.kingdomInfoMap._onUpdateSetting());