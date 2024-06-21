const Item = require('../models/item');
const fs = require('fs');

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createItem = async (req, res) => {
  try {
    // Verifica si se han proporcionado todos los campos requeridos
    const { nombre, descripcion, genero, fechaLanzamiento, calificacion } = req.body;
    if (!nombre || !descripcion || !genero || !fechaLanzamiento || !calificacion) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Crea un nuevo item con los datos proporcionados
    const newItem = new Item({
      nombre,
      descripcion,
      genero,
      fechaLanzamiento,
      calificacion,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
    });

    await newItem.save();
    res.status(201).json(newItem); // Devuelve el item creado con la URL de la imagen si existe
  } catch (error) {
    console.error('Error al crear el item:', error.message);
    res.status(500).json({ error: error.message });
  }
};

  
  exports.updateItem = async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (item) {
        item.nombre = req.body.nombre;
        item.descripcion = req.body.descripcion;
        item.genero = req.body.genero;
        item.fechaLanzamiento = req.body.fechaLanzamiento;
        item.calificacion = req.body.calificacion;
        if (req.file) {
          item.imageUrl = `/uploads/${req.file.filename}`;
        }
        await item.save();
        res.json(item); // Devuelve el item actualizado con la URL de la imagen
      } else {
        res.status(404).json({ error: 'Item no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar el item:', error.message);
      res.status(500).json({ error: error.message });
    }
  };  

exports.deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el item:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.searchItems = async (req, res) => {
  const searchTerm = req.params.term;
  try {
    const items = await Item.find({
      $or: [
        { nombre: new RegExp(searchTerm, 'i') },
        { descripcion: new RegExp(searchTerm, 'i') },
        { genero: new RegExp(searchTerm, 'i') }
      ]
    });
    res.json(items);
  } catch (error) {
    console.error('Error al buscar items:', error.message);
    res.status(500).json({ error: error.message });
  }
};
