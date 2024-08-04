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

  /* -------------------------------------------- */
  /*  Canvas Lifecycle Hooks                      */
  /* -------------------------------------------- */

  /**
   * Canvas configuration.
   * @internal
   */
  _onConfig() {
    if ( !this.active ) return;
  }

  /* -------------------------------------------- */

  /**
   * Canvas initialization.
   * @internal
   */
  _onInit() {
    if ( !this.active ) return;
    if ( canvas.visibilityOptions ) canvas.visibilityOptions.persistentVision = true;
    this.kingdomInfoLayer = new KingdomInfoLayer();
    this.kingdomInfoLayer.loadTextures();

  }

  /* -------------------------------------------- */

  /**
   * Canvas drawing.
   * @internal
   */
  _onDraw() {
    if ( !this.active ) return;
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
    this.kingdomInfoLayer.draw();

  }

  /* -------------------------------------------- */

  /**
   * Canvas tear-down.
   * @internal
   */
  _onTearDown() {
    if ( !this.active ) return;

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
}