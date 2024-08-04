import KingdomInfoLayer from "./kingdom-info-layer.mjs";

export default class KingdomInfoMap {
    constructor() {
    }

  /**
   * The Scene ID used for the Stolen Lands region map in the Kingmaker module.
   * @type {string}
   */
  static SCENE_ID = "AJ1k5II28u72JOmz";

  /**
   * The tool to toggle display of the info overlay (KingdomInfo).
   * @type {SceneControlTool}
   */
  #infoTool;

  /**
   * The overlay for the kingdom's borders
   * @type {KingdomInfoLayer}
   */
  kingdomInfoLayer;

   /**
   * Is the Kingmaker info map actively viewed on the canvas?
   * @type {boolean}
   */
   get active() {
    return kingmaker.region.active;
  }

  /**
   * The asset bundle for the KingdomInfoLayer
   */
  assets;

  async loadTextures() {
    PIXI.Assets.addBundle("kingdom-info-layer", [
      { alias: "recon", src: "modules/pf2e-kingdom-map-enhancement/assets/img/recon.png" },
      { alias: "camp_quarry", src: "modules/pf2e-kingdom-map-enhancement/assets/img/quarry.png" },
      { alias: "camp_lumber", src: "modules/pf2e-kingdom-map-enhancement/assets/img/lumbercamp.png" },
      { alias: "camp_mine", src: "modules/pf2e-kingdom-map-enhancement/assets/img/mine.png" },
      { alias: "res_ore", src: "modules/pf2e-kingdom-map-enhancement/assets/img/ore.png" },
      { alias: "res_food", src: "modules/pf2e-kingdom-map-enhancement/assets/img/wheat.png" },
      { alias: "res_lumber", src: "modules/pf2e-kingdom-map-enhancement/assets/img/lumber.png" },
      { alias: "res_stone", src: "modules/pf2e-kingdom-map-enhancement/assets/img/stone.png" },
      { alias: "res_luxuries", src: "modules/pf2e-kingdom-map-enhancement/assets/img/luxuries.png" },
      { alias: "feat_farm", src: "modules/pf2e-kingdom-map-enhancement/assets/img/farmer.png" },
      { alias: "feat_landmark", src: "modules/pf2e-kingdom-map-enhancement/assets/img/landmark.png" },
      { alias: "feat_refuge", src: "modules/pf2e-kingdom-map-enhancement/assets/img/refuge.png" },
      { alias: "feat_ruin", src: "modules/pf2e-kingdom-map-enhancement/assets/img/ruin.png" },
      { alias: "feat_ford", src: "modules/pf2e-kingdom-map-enhancement/assets/img/ford.png" },
      { alias: "feat_waterfall", src: "modules/pf2e-kingdom-map-enhancement/assets/img/waterfall.png" },
      { alias: "feat_hazard", src: "modules/pf2e-kingdom-map-enhancement/assets/img/hazard.png" },
      { alias: "feat_bloom", src: "modules/pf2e-kingdom-map-enhancement/assets/img/bloom.png" },
      { alias: "feat_structure", src: "modules/pf2e-kingdom-map-enhancement/assets/img/structure.png" },
      { alias: "feat_road", src: "modules/pf2e-kingdom-map-enhancement/assets/img/road.png" },
      { alias: "feat_bridge", src: "modules/pf2e-kingdom-map-enhancement/assets/img/bridge.png" },
      { alias: "feat_town", src: "modules/pf2e-kingdom-map-enhancement/assets/img/town.png" },
    ]);
    this.assets = await PIXI.Assets.loadBundle("kingdom-info-layer");
  }

  /* -------------------------------------------- */
  /*  Canvas Lifecycle Hooks                      */
  /* -------------------------------------------- */

  /**
   * Canvas initialization.
   * @internal
   */
  _onInit() {
    if ( !this.active ) return;
    if ( canvas.visibilityOptions ) canvas.visibilityOptions.persistentVision = true;
    this.kingdomInfoLayer = new KingdomInfoLayer();
    this.kingdomInfoLayer.loadAssets(this.assets);

  }

  /* -------------------------------------------- */

  /**
   * Canvas drawing.
   * @internal
   */
  _onDraw() {
    if ( !this.active ) return;
    this.kingdomInfoLayer.draw();
  }

  /* -------------------------------------------- */

  /**
   * Canvas ready.
   * @internal
   */
  _onReady() {
    if ( !this.active ) return;

    // canvas.interface.grid.addChildAt(this.kingdomInfoLayer, canvas.interface.grid.children.indexOf(canvas.interface.grid.borders));
    canvas.interface.grid.addChild(this.kingdomInfoLayer);

  }

  /* -------------------------------------------- */

  /**
   * Add special buttons to the scene controls palette when we are on the region map.
   * @param buttons
   * @internal
   */
  _extendSceneControlButtons(buttons) {
    if ( canvas.id !== this.constructor.SCENE_ID ) return;
    const tokens = buttons.find(b => b.name === "token");
    this.#infoTool = {
      name: "info",
      title: "Toggle Kingdom Info",
      icon: "fa-solid fa-circle-info",
      visible: true,
      toggle: true,
      active: this.kingdomInfoLayer.visible ?? false,
      onClick: () => this.kingdomInfoLayer.visible = !this.kingdomInfoLayer.visible
    };
    tokens.tools.push(this.#infoTool);
  };

  _onUpdateSetting() {
    if ( !this.active ) return;
    this.kingdomInfoLayer.draw();
  }
}