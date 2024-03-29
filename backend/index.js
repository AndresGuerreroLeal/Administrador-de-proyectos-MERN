const express = require("express");

const app = express();
const cors = require("cors");
const DB = require("./config/db");

const { Server } = require("socket.io");

const httpServer = require("http").createServer();

app.use(cors());
app.use(express.json());
DB();

app.use("/api/usuarios", require("./routes/usuarioRoutes"));
app.use("/api/proyectos", require("./routes/proyectoRoutes"));
app.use("/api/tareas", require("./routes/tareaRoutes"));

app.get("/", function (req, res) {
  res.json({ msg: "Servidor funcionando" });
});

const PORT = process.env.PORT || 8090;

const servidor = app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log(`Servidor funcionando en: http://localhost:${PORT}`);
});

//Socket.io"

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("abrir proyecto", (proyecto) => {
    socket.join(proyecto);
  });

  socket.on("nueva tarea", (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("tarea agregada", tarea);
  });

  socket.on("eliminar tarea", (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("tarea eliminada", tarea);
  });

  socket.on("actualizar tarea", (tarea) => {
    const proyecto = tarea.proyecto._id;
    socket.to(proyecto).emit("tarea actualizada", tarea);
  });

  socket.on("cambiar estado", (tarea) => {
    const proyecto = tarea.proyecto._id;
    socket.to(proyecto).emit("nuevo estado", tarea);
  });
});
