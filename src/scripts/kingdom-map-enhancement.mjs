import KingdomInfoMap from "./kingdom-info-map.mjs";

/**
 * The ID of the Kingmaker module
 * @type {string}
 */
const MODULE_ID = "pf2e-kingdom-map-enhancement";

/* -------------------------------------------- */
/*  Initialization                              */
/* -------------------------------------------- */

Hooks.once("init", function() {
    /**
     * Global reference to the Kingmaker module.
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
});

/* -------------------------------------------- */
/*  Canvas Events                               */
/* -------------------------------------------- */

Hooks.on("canvasConfig", () => kingdominfo.kingdomInfoMap._onConfig());
Hooks.on("canvasInit", () => kingdominfo.kingdomInfoMap._onInit());
Hooks.on("canvasDraw", () => kingdominfo.kingdomInfoMap._onDraw());
Hooks.on("canvasReady", () => kingdominfo.kingdomInfoMap._onReady());
Hooks.on("canvasTearDown", () => kingdominfo.kingdomInfoMap._onTearDown());
Hooks.on("getSceneControlButtons", buttons => kingdominfo.kingdomInfoMap._extendSceneControlButtons(buttons));