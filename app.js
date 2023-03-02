const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

require('dotenv').config();

const PORT = process.env.PORT;

app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

users = [];

io.on("connection", (socket) => {

    socket.on("join", (email) => {
        newUser = { id: socket.id, email: email };
        users.push(newUser);
    })

    socket.on('disconnect', () => {
        users = users.filter(user => user.id != socket.id);
        console.log('disconnect');

    });

})

app.post("/", (req, res) => {

    email = req.body.email
    message = req.body.message;
    eventName = req.body.event;

    filterUser = users.filter(user => user.email == email);

    if (filterUser.length == 0) {
        res.send("no user found")
        return;
    }
    filterUser.forEach(element => {

        io.to(element.id).emit(eventName, message);
    });
    res.send("messge send")

});



server.listen(PORT, () => console.warn(`Running on http://127.0.0.1:${PORT}`));
