/**
 * A canvas container used to display information about what is in each hex
 */

export default class KingdomInfoLayer extends PIXI.Container {
    constructor() {
      super();
      this.zIndex = 1;
      this.visible = true;
    }

  /** Try-catch wrapper around loadTexture. */
  getTexture = async (path) => {
    try {
      texture = await loadTexture(path);
      if (!texture) {
        ui.notifications.error(
          `${game.i18n.localize("DD.TextureLoadFailure")}: ${path}`
        );
      }
      return texture;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Draw the layer.
   */
  draw() {
    this.removeChildren().forEach(c => c.destroy());
    this.mask = canvas.primary.mask;
    // const texture = this.getTexture("modules/pf2e-kingmaker-map-enhancement/images/hex_reconoitered.png");
    const hexes = kingmaker.region.hexes.filter(h => h.data.exploration == 1);
    // const hexes_features = explored_hexes.filter( h => h.data.camp != "" || h.data.features.some(f => f.type == "farmland"));
    for ( const hex of hexes ) {
      const {x, y} = hex.center;
      const tx = hex.topLeft.x;
      const ty = hex.topLeft.y;
      const text = this.addChild(new PIXI.Text("R", {fontSize: 24, fill: 0xff3300}));
      text.anchor.set(0.5, 0.5);
      text.position.set(x, (ty + (y - ty) / 2));
      if (hex.data.camp == "quarry") {
        const camptext = this.addChild(new PIXI.Text("Q", {fontSize: 24, fill: 0xffcc00}));
        camptext.anchor.set(0.5, 0.5);
        camptext.position.set(tx + (x - tx) / 2, (ty + (y - ty) / 2));
      }
      if (hex.data.camp == "lumber") {
        const camptext = this.addChild(new PIXI.Text("L", {fontSize: 24, fill: 0xffcc00}));
        camptext.anchor.set(0.5, 0.5);
        camptext.position.set(tx + (x - tx) / 2, (ty + (y - ty) / 2));
      }
      if (hex.data.camp == "mine") {
        const camptext = this.addChild(new PIXI.Text("M", {fontSize: 24, fill: 0xffcc00}));
        camptext.anchor.set(0.5, 0.5);
        camptext.position.set(tx + (x - tx) / 2, (ty + (y - ty) / 2));
      }
      if (hex.data.features.some(f => f.type == "farmland")) {
        const camptext = this.addChild(new PIXI.Text("F", {fontSize: 24, fill: 0x00cc00}));
        camptext.anchor.set(0.5, 0.5);
        camptext.position.set(x + (x - tx) / 2, (ty + (y - ty) / 2));
      }
      // const img = this.addChild(new PIXI.Sprite(texture));
      // img.anchor.set(0.5, 0.5);
      // img.position.set(x, y);
    }
  }

  /**
    * A helper function to draw a diamond section of a hexagon
    */
  static #buildHexDiamond(x, y, size) {
    const h = size / 2;
    return new PIXI.Polygon([
      x, y - h,
      x + size, y,
      x, y + h,
      x - size, y,
    ]);
  };
}
