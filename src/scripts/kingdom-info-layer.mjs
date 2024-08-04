/**
 * A canvas container used to display information about what is in each hex
 */

export default class KingdomInfoLayer extends PIXI.Container {
    constructor() {
      super();
      this.zIndex = 1;
      this.visible = true;
      // Create a resource bundle for the icons and load them
      this.assets = null;
    }
  
  /**
   *  load textures for the KingdomInfoLayer
   */
  loadAssets(assets) {
    this.assets = assets;
  }

  /**
   * Draw the layer.
   */
  async draw() {
    this.removeChildren().forEach(c => c.destroy());
    this.mask = canvas.primary.mask;

    const icon_size = 36;
    const scalefactor = icon_size / 512 //really need to replace this so we dont assume 512x512 icons
    const icon_pad = 10
    const hexes = kingmaker.region.hexes.filter(h => h.data.exploration == 1);
    for ( const hex of hexes ) {
      const {x, y} = hex.center;
      const tx = hex.topLeft.x;
      const ty = hex.topLeft.y;

      // Mark the hex as reconnoitered
      const reconimg = this.addChild(new PIXI.Sprite(this.assets["recon"]));
      reconimg.anchor.set(0.5, 0.5);
      reconimg.position.set(x, (ty + (y - ty) / 4));
      reconimg.scale.set(scalefactor, scalefactor);

      if (hex.data.showResources == true) {
        
        // if camp is defined, add camp icon
        if (hex.data.camp != "") {
          // Add work camp icons
          if (hex.data.camp == "quarry") {
            var camptex = this.assets["camp_quarry"];
          } else if (hex.data.camp == "lumber") {
            var camptex = this.assets["camp_lumber"];;
          } else if (hex.data.camp == "mine") {
            var camptex = this.assets["camp_mine"];;
          }
          const campimg = this.addChild(new PIXI.Sprite(camptex));
          campimg.anchor.set(0.5, 0.5);
          campimg.position.set(x + (x - tx) / 2, (ty + (y - ty) / 2));
          campimg.scale.set(scalefactor, scalefactor);

        }

        if (hex.data.commodity != "") {
          // Add resource icons
          if (hex.data.commodity == "stone") {
            var restex = this.assets["res_stone"];
          } else if (hex.data.commodity == "lumber") {
            var restex = this.assets["res_lumber"];
          } else if (hex.data.commodity == "ore") {
            var restex = this.assets["res_ore"];
          } else if (hex.data.commodity == "food") {
            var restex = this.assets["res_food"];
          } else if (hex.data.commodity == "luxuries") {
            var restex = this.assets["res_luxuries"];
          }

          const resimg = this.addChild(new PIXI.Sprite(restex));
          resimg.anchor.set(0.5, 0.5);
          resimg.position.set(tx + (x - tx) / 2, (ty + (y - ty) / 2));
          resimg.scale.set(scalefactor, scalefactor);

        }
      }

      // Add feature icons
      var features = hex.data.features.filter(f => f.discovered == true);
      if (features.length > 0) {

        const icons_per_row = 6;
        const featlist_x = x - ((Math.min(features.length-1, icons_per_row-1 )*(icon_size + icon_pad)) / 2);
        const featlist_y = y + (y - ty) / 3;

        // for each feature in the hex, add the icon
        for (let i = 0; i < features.length; i++) {

          var feat_x = featlist_x + ((i % icons_per_row) * (icon_size + icon_pad));
          var feat_y = featlist_y - (Math.floor(i / icons_per_row) * (icon_size + icon_pad));

          if (features[i].type == "farmland") {
            var featex = this.assets["feat_farm"];
          } else if (features[i].type == "landmark") {
            var featex = this.assets["feat_landmark"];
          } else if (features[i].type == "refuge") {
            var featex = this.assets["feat_refuge"];
          } else if (features[i].type == "structure") {
            var featex = this.assets["feat_structure"];
          } else if (features[i].type == "road") {
            var featex = this.assets["feat_road"];
          } else if (features[i].type == "bridge") {
            var featex = this.assets["feat_bridge"];
          } else if (features[i].type == "ruin") {
            var featex = this.assets["feat_ruin"];
          } else if (features[i].type == "hazard") {
            var featex = this.assets["feat_hazard"];
          } else if (features[i].type == "bloom") {
            var featex = this.assets["feat_bloom"];
          } else if (features[i].type == "ford") {
            var featex = this.assets["feat_ford"];
          } else if (features[i].type == "waterfall") {
            var featex = this.assets["feat_waterfall"];
          } else if (features[i].type == "freehold" || features[i].type == "village"|| features[i].type == "town" || features[i].type == "city" || features[i].type == "metropolis") {
            var featex = this.assets["feat_town"];
          } else {
            continue;
          }
          
          const featimg = this.addChild(new PIXI.Sprite(featex));
          featimg.anchor.set(0.5, 0.5);
          featimg.position.set(feat_x, feat_y);
          featimg.scale.set(scalefactor, scalefactor);
        }
      }


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
