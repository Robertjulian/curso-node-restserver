const { response, request } = require('express');
const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(desde)
            .limit(limite)

    ]);

    res.status(201).json({ total, categorias });
};

// obtenerCategoria - populate {}
const obtenerCategoria = async (req = request, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    if (!categoria.estado) {
        res.status(201).json({ msg: 'Categoria bloqueada, comuniquese con el administrador' });
    }

    res.status(201).json(categoria);
};

const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe.`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria(data);

    // Guardar en DB
    categoria.save();


    res.status(201).json(categoria);
};

// actualizarCategoria
const actualizarCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe.`
        });
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.status(201).json(categoria);
};

// eliminarCategoria
const eliminarCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false}, {new: true});

    res.status(201).json(categoria);
};

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria
}