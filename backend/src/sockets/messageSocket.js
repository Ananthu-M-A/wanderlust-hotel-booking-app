"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const createServer = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST"],
        },
    });
    io.on('connection', (socket) => {
        console.log(`User Connected; Socket ID: ${socket.id}`);
        socket.on("join_room", (roomId) => {
            socket.join(roomId);
            console.log(`User with ID: ${socket.id} Joined Room: ${roomId}`);
        });
        socket.on("send_message", (messageData) => {
            io.to(messageData.roomId.toString()).emit("received_message", messageData);
        });
        socket.on('disconnect', () => {
            console.log(`User Disconnected; Socket ID: ${socket.id}`);
        });
    });
};
exports.default = createServer;