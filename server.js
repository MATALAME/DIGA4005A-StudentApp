
const jsonServer = require("json-server");
const cors = require("cors");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(cors()); 
server.use(middlewares);
server.use(jsonServer.bodyParser);


server.use((req, res, next) => {
  if (req.method === "PATCH") {
    console.log(`PATCH request to ${req.url}`, req.body);
  }
  next();
});

server.use(router);

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`JSON Server running with CORS on port ${PORT}`);
});
