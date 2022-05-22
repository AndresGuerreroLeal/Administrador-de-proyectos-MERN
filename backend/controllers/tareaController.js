const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");

exports.agregarTarea = async (req, res) => {
  const { proyecto } = req.body;

  const proyectoExiste = await Proyecto.findById(proyecto);

  if (!proyectoExiste) {
    return res.status(404).json({ msg: "El proyecto no existe" });
  }

  if (proyectoExiste.creador.toString() !== req.usuario._id.toString()) {
    return res.status(404).json("No tienes permiso para añadir tareas");
  }

  try {
    const tarea = await Tarea.create(req.body);

    proyectoExiste.tareas.push(tarea._id);

    await proyectoExiste.save();

    res.json(tarea);
  } catch (err) {
    console.log(err);
  }
};

exports.obtenerTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    return res.status(404).json({ msg: "Tarea no encontrada" });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    return res.status(403).json("Acción no válida");
  }

  res.json(tarea);
};

exports.actualizarTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    return res.status(404).json({ msg: "Tarea no encontrada" });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    return res.status(403).json("Acción no válida");
  }

  try {
    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    const tareaAlmacenada = await tarea.save();

    res.json(tareaAlmacenada);
  } catch (err) {
    console.log(err);
  }
};

exports.eliminarTarea = async (req, res) => {
  const { id } = req.params;

  let tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    return res.status(404).json({ msg: "Tarea no encontrada" });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    return res.status(403).json("Acción no válida");
  }

  try {
    const proyecto = await Proyecto.findById(tarea.proyecto);

    proyecto.tareas.pull(tarea._id);

    await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]);

    res.json({ msg: "Eliminado correctamente" });
  } catch (err) {
    console.log(err);
  }
};

exports.cambiarEstado = async (req, res) => {
  const { id } = req.params;

  let tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    return res.status(404).json({ msg: "Tarea no encontrada" });
  }

  if (
    tarea.proyecto.creador.toString() !== req.usuario._id.toString() &&
    !tarea.proyecto.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    return res.status(401).json({ msg: "Acción no válida" });
  }

  try {
    tarea.estado = !tarea.estado;
    tarea.completado = req.usuario._id

    await tarea.save();

    let tareaAlmacenada = await Tarea.findById(id)
    .populate("proyecto")
    .populate("completado");    

    res.json(tareaAlmacenada);
  } catch (err) {
    console.log(err);
  }
};
