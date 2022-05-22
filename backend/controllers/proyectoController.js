const Proyecto = require("../models/Proyecto");
const Tarea = require("../models/Tarea");
const Usuario = require("../models/Usuario");

exports.obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find({
    $or: [
      { colaboradores: { $in: req.usuario } },
      { creador: { $in: req.usuario } },
    ],
  })
    .select("-tareas");

  res.json(proyectos);
};

exports.nuevoProyecto = async (req, res) => {
  let proyecto = await new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  try {
    await proyecto.save();

    res.json(proyecto);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ msg: "Hubo un error" });
  }
};

exports.obtenerProyecto = async (req, res) => {
  const { id } = req.params;

  const proyecto = await Proyecto.findById(id)
    .populate({
      path: "tareas",
      populate: { path: "completado", select: "nombre" },
    })
    .populate("colaboradores", "nombre email");

  if (!proyecto) {
    return res.status(404).json({ msg: "Proyecto no encontrado" });
  }

  if (
    proyecto.creador.toString() !== req.usuario._id.toString() &&
    !proyecto.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    return res.status(401).json({ msg: "Acción no válida" });
  }

  res.json(proyecto);
};

exports.editarProyecto = async (req, res) => {
  const { id } = req.params;

  let proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    return res.status(404).json({ msg: "Proyecto no encontrado" });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    return res.status(401).json({ msg: "Acción no válida" });
  }

  try {
    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente = req.body.cliente || proyecto.cliente;

    await proyecto.save();

    res.json(proyecto);
  } catch (err) {
    console.log(err);
  }
};

exports.eliminarProyecto = async (req, res) => {
  const { id } = req.params;

  let proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    return res.status(404).json({ msg: "Proyecto no encontrado" });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    return res.status(401).json({ msg: "Acción no válida" });
  }

  try {
    proyecto = await Proyecto.deleteOne();

    res.json({ msg: "Eliminado correctamente" });
  } catch {
    console.log(err);
  }
};

exports.buscarColaborador = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -createdAt -password -token -updatedAt -__v"
  );

  if (!usuario) {
    return res.status(404).json({ msg: "Usuario no encontrado" });
  }

  res.json(usuario);
};

exports.agregarColaborador = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    const { email } = req.body;
    const usuario = await Usuario.findOne({ email }).select(
      "-confirmado -createdAt -password -token -updatedAt -__v"
    );

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      return res.status(404).json({ msg: "Acción no válida" });
    }

    if (req.usuario._id.toString() === usuario._id.toString()) {
      return res
        .status(404)
        .json({ msg: "El creador del proyecto no puede ser colaborador" });
    }

    if (proyecto.colaboradores.includes(usuario._id)) {
      return res
        .status(404)
        .json({ msg: "El usuario ya pertenece al proyecto" });
    }

    proyecto.colaboradores.push(usuario._id);

    await proyecto.save();

    res.json({ msg: "Colaborador agregado correctamente" });
  } catch (err) {
    console.log(err);
  }
};

exports.eliminarColaborador = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    const { email } = req.body;
    const usuario = await Usuario.findOne({ email }).select(
      "-confirmado -createdAt -password -token -updatedAt -__v"
    );

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      return res.status(404).json({ msg: "Acción no válida" });
    }

    proyecto.colaboradores.pull(req.body.id);
    await proyecto.save();

    res.json({ msg: "Colaborador eliminado correctamente" });
  } catch (err) {
    console.log(err);
  }
};

exports.obtenerTareas = async (req, res) => {};
