/**
 * A canvas container used to display information about what is in each hex
 */

export default class KingdomInfoLayer extends PIXI.Container {
    constructor() {
      super();
      this.zIndex = 1;
      this.visible = true;
      // this.recontext = this.getTexture("modules/pf2e-kingmaker-map-enhancement/images/hex_reconoitered.png");
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
 async draw() {
    this.removeChildren().forEach(c => c.destroy());
    this.mask = canvas.primary.mask;
    // recnoitered icon
    const recontex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/recon.png");
    // Camp icons
    const quarrytex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/quarry.png");
    const minetex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/mine.png");
    const lumbercamptex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/lumbercamp.png");
    // Resource icons
    const oretex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/ore.png");
    const foodtex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/wheat.png");
    const lumbertex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/lumber.png");
    const stonetex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/stone.png");
    const luxuriestex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/luxuries.png");
    // Feature icons
    const farmtex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/farmer.png");
    const landmarktex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/landmark.png");
    const refugetex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/refuge.png");
    const ruintex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/ruin.png");
    const fordtex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/ford.png");
    const waterfalltex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/waterfall.png");
    const hazardtex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/hazard.png");
    const bloomtex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/bloom.png");
    const structuretex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/structure.png");
    const roadtex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/road.png");
    const bridgetex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/bridge.png");
    const towntex = await PIXI.Assets.load("modules/pf2e-kingdom-map-enhancement/assets/img/town.png");

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
      const reconimg = this.addChild(new PIXI.Sprite(recontex));
      reconimg.anchor.set(0.5, 0.5);
      reconimg.position.set(x, (ty + (y - ty) / 4));
      reconimg.scale.set(scalefactor, scalefactor);

      // if camp is defined, add camp icon
      if (hex.data.camp != "") {
        // Add work camp icons
        if (hex.data.camp == "quarry") {
          var camptex = quarrytex;
        } else if (hex.data.camp == "lumber") {
          var camptex = lumbercamptex;
        } else if (hex.data.camp == "mine") {
          var camptex = minetex;
        }
        const campimg = this.addChild(new PIXI.Sprite(camptex));
        campimg.anchor.set(0.5, 0.5);
        campimg.position.set(x + (x - tx) / 2, (ty + (y - ty) / 2));
        campimg.scale.set(scalefactor, scalefactor);
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
            var feat_x = featlist_x + ((i % icons_per_row) * (icon_size + icon_pad));
            var feat_y = featlist_y - (Math.floor(i / icons_per_row) * (icon_size + icon_pad));
            if (hex.data.features[i].type == "farmland") {
              var featex = farmtex;
            } else if (hex.data.features[i].type == "landmark") {
              var featex = landmarktex;
            } else if (hex.data.features[i].type == "refuge") {
              var featex = refugetex;
            } else if (hex.data.features[i].type == "structure") {
              var featex = structuretex;
            } else if (hex.data.features[i].type == "road") {
              var featex = roadtex;
            } else if (hex.data.features[i].type == "bridge") {
              var featex = bridgetex;
            } else if (hex.data.features[i].type == "ruin") {
              var featex = ruintex;
            } else if (hex.data.features[i].type == "hazard") {
              var featex = hazardtex;
            } else if (hex.data.features[i].type == "bloom") {
              var featex = bloomtex;
            } else if (hex.data.features[i].type == "ford") {
              var featex = fordtex;
            } else if (hex.data.features[i].type == "waterfall") {
              var featex = waterfalltex;
            } else if (hex.data.features[i].type == "freehold" || hex.data.features[i].type == "village"|| hex.data.features[i].type == "town" || hex.data.features[i].type == "city" || hex.data.features[i].type == "metropolis") {
              var featex = towntex;
            } else {
              continue;
            }
            const featimg = this.addChild(new PIXI.Sprite(featex));
            featimg.anchor.set(0.5, 0.5);
            featimg.position.set(feat_x, feat_y);
            featimg.scale.set(scalefactor, scalefactor);
          }
        }

      
      if (hex.data.commodity != "") {
        // Add resource icons
        if (hex.data.commodity == "stone") {
          var restex = stonetex;
        } else if (hex.data.commodity == "lumber") {
          var restex = lumbertex;
        } else if (hex.data.commodity == "ore") {
          var restex = oretex;
        } else if (hex.data.commodity == "food") {
          var restex = foodtex;
        } else if (hex.data.commodity == "luxuries") {
          var restex = luxuriestex;
        }
        const resimg = this.addChild(new PIXI.Sprite(restex));
        resimg.anchor.set(0.5, 0.5);
        resimg.position.set(tx + (x - tx) / 2, (ty + (y - ty) / 2));
        resimg.scale.set(scalefactor, scalefactor);
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
