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
      this.reconOutline = null;
      this.onRender = () => this.setHexControlsActive(kingmaker.region.kingdomLayer?.visible ?? false);
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
    this.reconOutline = this.addChild(new PIXI.Graphics());
    const reconPolygons = KingdomInfoLayer.#buildPolygons(hexes.filter(hex => !hex.data.claimed));
    const reconColor = Color.from("00FF00");
    this.reconOutline.beginFill(reconColor, 0).lineStyle({alignment: 0, color: reconColor, width: 4});
    for (const polygon of reconPolygons) {
      this.reconOutline.drawShape(polygon.outer);
      for (const hole of polygon.holes) {
        this.reconOutline.beginHole(0xFFFFFF).drawShape(hole).endHole();
      }
    }
    this.reconOutline.endFill();
    this.setHexControlsActive(kingmaker.region.kingdomLayer?.visible ?? false);

    for ( const hex of hexes ) {
      const {x, y} = hex.center;
      const tx = hex.topLeft.x;
      const ty = hex.topLeft.y;

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
    * Match the reconnoitered outline visibility to the built-in hex controls.
    */
  setHexControlsActive(active) {
    if (this.reconOutline) this.reconOutline.visible = active;
  }

  /**
   * Combine reconnoitered hexes into polygon regions.
   */
  static #buildPolygons(hexes) {
    const getVertices = hex => {
      const center = hex.center;
      const scale = (hex.grid.sizeY + 2) / hex.grid.sizeY;
      return canvas.grid.getShape(hex.offset).map(point => ({
        x: center.x + (point.x * scale),
        y: center.y + (point.y * scale)
      }));
    };
    const clipper = new ClipperLib.Clipper();
    const polyTree = new ClipperLib.PolyTree();

    clipper.AddPath([], ClipperLib.PolyType.ptSubject, true);
    for (const hex of hexes) {
      const polygon = new PIXI.Polygon(getVertices(hex));
      clipper.AddPath(polygon.toClipperPoints(), ClipperLib.PolyType.ptClip, true);
    }
    clipper.Execute(
      ClipperLib.ClipType.ctUnion,
      polyTree,
      ClipperLib.PolyFillType.pftEvenOdd,
      ClipperLib.PolyFillType.pftNonZero
    );

    const polygons = ClipperLib.JS.PolyTreeToExPolygons(polyTree);
    for (const polygon of polygons) {
      polygon.outer = PIXI.Polygon.fromClipperPoints(polygon.outer);
      polygon.holes = polygon.holes.map(hole => PIXI.Polygon.fromClipperPoints(hole));
    }
    return polygons;
  };
}
