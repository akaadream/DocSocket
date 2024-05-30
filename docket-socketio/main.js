import {Server} from "socket.io";

const io = new Server(3000, {});

io.use((socket, next) => {
    if (!socket.data.room) {
        return;
    }

    socket.join(socket.data.room);

    next();
});

io.on("connection", (socket) => {
    if (socket.data.room) {
        socket.join(socket.data.room);

        socket.on("ping", () => {
            socket.emit("pong");
        });
    }
});