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

  /**
   * Draw the layer.
   */
  async draw() {
    this.removeChildren().forEach(c => c.destroy());
    this.mask = canvas.primary.mask;

    const icon_size = 36;
    const scalefactor = icon_size / 512
    const icon_pad = 10
    const hexes = kingmaker.region.hexes.filter(h => h.data.exploration == 1);
    // const hexes_features = explored_hexes.filter( h => h.data.camp != "" || h.data.features.some(f => f.type == "farmland"));
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
      if (hex.data.features.length > 0) {
        // get how many features are in the hex
        const num_features = hex.data.features.length;
        const icons_per_row = 6;
        const featlist_x = x - ((Math.min(num_features-1, icons_per_row-1 )*(icon_size + icon_pad)) / 2);
        const featlist_y = y + (y - ty) / 3;
        // for each feature in the hex, add the icon
        for (let i = 0; i < num_features; i++) {
          if (hex.data.features[i].discovered == true) {
            var feat_x = featlist_x + ((i % icons_per_row) * (icon_size + icon_pad));
            var feat_y = featlist_y - (Math.floor(i / icons_per_row) * (icon_size + icon_pad));
            if (hex.data.features[i].type == "farmland") {
              var featex = this.assets["feat_farm"];
            } else if (hex.data.features[i].type == "landmark") {
              var featex = this.assets["feat_landmark"];
            } else if (hex.data.features[i].type == "refuge") {
              var featex = this.assets["feat_refuge"];
            } else if (hex.data.features[i].type == "structure") {
              var featex = this.assets["feat_structure"];
            } else if (hex.data.features[i].type == "road") {
              var featex = this.assets["feat_roadm"];
            } else if (hex.data.features[i].type == "bridge") {
              var featex = this.assets["feat_bridge"];
            } else if (hex.data.features[i].type == "ruin") {
              var featex = this.assets["feat_ruin"];
            } else if (hex.data.features[i].type == "hazard") {
              var featex = this.assets["feat_hazard"];
            } else if (hex.data.features[i].type == "bloom") {
              var featex = this.assets["feat_bloom"];
            } else if (hex.data.features[i].type == "ford") {
              var featex = this.assets["feat_ford"];
            } else if (hex.data.features[i].type == "waterfall") {
              var featex = this.assets["feat_waterfall"];
            } else if (hex.data.features[i].type == "freehold" || hex.data.features[i].type == "village"|| hex.data.features[i].type == "town" || hex.data.features[i].type == "city" || hex.data.features[i].type == "metropolis") {
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
