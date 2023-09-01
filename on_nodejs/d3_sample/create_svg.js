import * as fs from "fs";
import * as path from "path";
import * as d3 from "d3";
import { JSDOM } from "jsdom";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load html
const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");
const { window } = new JSDOM(html, {
  resources: "usable",
  url: `file://${__dirname}/`,
});
const { document } = window;

() => new Promise((resolve) => window.addEventListener("load", resolve));

/////////////////////////////////////////////////////
// d3でSVGを作成
/////////////////////////////////////////////////////
const main = d3.select(document.body).select("#d3-target");
const svg = main
  .append("svg")
  .attr("xmlns", "http://www.w3.org/2000/svg")
  .attr("id", "svg")
  .attr("width", 200)
  .attr("height", 200);

svg.style("background-color", "#00ff00");

// svgに円(circle)を追加
// 中心のx座標(cx):100,中心のy座標(cy):90,半径(r):20
svg
  .append("circle")
  .attr("id", "circle")
  .attr("cx", 100)
  .attr("cy", 90)
  .attr("r", 20);
// .attr("fill", "#ff00ff");

const svg_element = document.querySelector("#svg");
// console.log("d3 SVG\n", svg_element.outerHTML);

function write_svg(svg_elm, svg_name) {
  const circle_element = svg_elm.querySelector("#circle");
  const circle_style = document.defaultView.getComputedStyle(
    circle_element,
    null
  );

  console.log(svg_name, "circle_style['fill']", circle_style["fill"]);
  fs.writeFileSync(svg_name + ".svg", svg_elm.outerHTML);
}

function copy_style(svg_elm) {
  var all_svg_element = svg_elm.querySelectorAll("circle");

  all_svg_element.forEach(function (value, index) {
    // console.log("value.outerHTML(before)", value.outerHTML);
    // console.log("index", index);
    let style = document.defaultView.getComputedStyle(value, null);
    // console.log("style:\n", style);

    if (style.length !== 0) {
      for (let i = 0; i < style.length; i++) {
        let style_key = style[i];
        let style_value = style[style_key];
        value.setAttribute(style_key, style_value);
        // console.log(
        //   "i:",
        //   i,
        //   ", style_key:",
        //   style_key,
        //   ", style_value:",
        //   style_value
        // );
      }
    }
    // console.log("value.outerHTML(after )", value.outerHTML);
  });
}

write_svg(svg_element, "out1");

copy_style(svg_element);
write_svg(svg_element, "out2");

// loadイベントを待つとDOMにスタイルが適用される
window.addEventListener(
  "load",
  () => {
    write_svg(svg_element, "out3");
    // loadイベントの後にCSSのスタイルをインラインとしてコピーすると
    // CSSのスタイルをSVGとして出力可能になる。
    copy_style(svg_element);
    write_svg(svg_element, "out4");
  },
  false
);

// 以下でも同様の動作をする
// window.onload = function () {
//   write_svg(svg_element, "out3");
//   copy_style(svg_element);
//   write_svg(svg_element, "out4");
// };
