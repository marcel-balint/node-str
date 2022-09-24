const fs = require("fs");
const http = require("http");

const json = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const laptopData = JSON.parse(json);
const url = require("url");

const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;
  //Products page
  if (pathName === "/products" || pathName === "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    fs.readFile(
      `${__dirname}/templates/template-overview.html`,
      "utf-8",
      (err, data) => {
        let overviewOutput = data;
        fs.readFile(
          `${__dirname}/templates/template-card.html`,
          "utf-8",
          (err, data) => {
            //Map through laptop data and generate the cards with new data
            const cardsOutput = laptopData
              .map((el) => replaceTemplate(data, el))
              .join("");
            //Inject the cards data
            overviewOutput = overviewOutput.replace("{%CARDS%}", cardsOutput);
            res.end(overviewOutput);
          }
        );
      }
    );
    //Laptop detail
  } else if (pathName === "/laptop" && id < laptopData.length) {
    res.writeHead(200, { "Content-type": "text/html" });
    //Read the local file and replace data accordingly
    fs.readFile(
      `${__dirname}/templates/template-laptop.html`,
      "utf-8",
      (err, data) => {
        const laptop = laptopData[id];
        const output = replaceTemplate(data, laptop);
        res.end(output);
      }
    );
    //URL not found
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("Url not found");
  }
});
server.listen(1337, "127.0.0.1", () => {
  console.log("Listening for requests");
});

function replaceTemplate(orifinalHtml, laptop) {
  let output = orifinalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
  output = output.replace(/{%IMAGE%}/g, laptop.image);
  output = output.replace(/{%PRICE%}/g, laptop.price);
  output = output.replace(/{%SCREEN%}/g, laptop.screen);
  output = output.replace(/{%CPU%}/g, laptop.cpu);
  output = output.replace(/{%STORAGE%}/g, laptop.storage);
  output = output.replace(/{%RAM%}/g, laptop.ram);
  output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
  output = output.replace(/{%ID%}/g, laptop.id);

  return output;
}
