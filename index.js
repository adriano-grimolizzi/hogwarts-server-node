const http = require('http');

const host = 'localhost';
const port = 8080;

const wizardList = JSON.stringify([
	{"name": "Harry", "house": "Gryffindor"},
	{"name": "Ron", "house": "Gryffindor"},
]);

const requestListener = function (request, response) {
	response.setHeader("Content-Type", "application/json");
	
	switch (request.url) {
		case "/wizards":
			response.writeHead(200);
			response.end(wizardList);
			break
		default:
			response.writeHead(404);
			response.end(JSON.stringify({error: "Resource not found"}));
	}	
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}.`);
});