import * as fs from "fs";
import * as path from "path";
import * as d3 from "d3";
import { JSDOM } from "jsdom";

import "@testing-library/jest-dom";

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

describe("Tests", () => {
  beforeAll(
    () => new Promise((resolve) => window.addEventListener("load", resolve))
  );

  it(`test html head`, () => {
    const title = document.querySelector("title");
    expect(title).toHaveTextContent("Document");
  });

  it(`test html body and css`, () => {
    const header = document.querySelector("#header");
    // const style = document.defaultView.getComputedStyle(header, null);
    // console.log("style:\n", style);
    // expect(header).toHaveStyle("color: red");
    expect(header).toHaveStyle("color: rgb(255, 0, 0)");
  });

  it(`test d3 SVG`, () => {
    /////////////////////////////////////////////////////
    // d3でSVGを作成
    /////////////////////////////////////////////////////
    const main = d3.select(document.body).select("#d3-target");
    const svg = main
      .append("svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("id", "svg")
      .attr("width", 200)
      .attr("height", 200)
      .attr("xmlns:xlink", "http://www.w3.org/2000/svg");

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

    const circle_element = svg_element.querySelector("#circle");
    const circle_style = document.defaultView.getComputedStyle(
      circle_element,
      null
    );
    console.log("circle_style['fill']", circle_style["fill"]);
    fs.writeFileSync("out.svg", svg_element.outerHTML);

    var all_svg_element = svg_element.querySelectorAll("circle");

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

    const circle_element2 = svg_element.querySelector("#circle");
    const circle_style2 = document.defaultView.getComputedStyle(
      circle_element2,
      null
    );
    console.log("circle_style2['fill']", circle_style2["fill"]);
    fs.writeFileSync("out2.svg", svg_element.outerHTML);
  });
});
