import { WBVWidget } from "./WBVWidget.js";

export default class WBVToolBar extends WBVWidget {
  name: string;
  collapsable = true;
  widgets: WBVWidget[];

  constructor(parentId: string = null, name = '') {
    super(parentId);
    this.name = name;
    this.widgets = [];
  }

  html(): string {
    let html = '<div class="wbv-tb">';
    html += '<div class="wbv-tb-header" target-data="' + this.id + '"><h2>' + this.name + '</h2></div>';
    html += '<div id="' + this.id + '" class="wbv-tb-body"></div></div>';
    return html;
  }

  update() {
    super.update();
    for(const w of this.widgets) { w.update(); }
  }
}
