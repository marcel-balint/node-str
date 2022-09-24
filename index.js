const fs = require("fs");
const http = require("http");

const json = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const laptopData = JSON.parse(json);
const url = require("url");

const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;

  if (pathName === "/products" || pathName === "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end("Products page");
  } else if (pathName === "/laptop" && id < laptopData.length) {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(`Laptop page for laptop nr. : ${id}`);
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("Url not found");
  }
});
server.listen(1337, "127.0.0.1", () => {
  console.log("Listening for requests");
});
