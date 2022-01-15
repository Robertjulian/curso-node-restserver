const { response, request } = require('express');
const { Producto } = require('../models');

// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(desde)
            .limit(limite)
    ]);

    res.status(201).json({ total, productos });
};

// obtenerProducto - populate {}
const obtenerProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    if (!producto.estado) {
        res.status(201).json({ msg: 'Producto bloqueado, comuniquese con el administrador' });
    }

    res.status(201).json(producto);
};

const crearProducto = async (req = request, res = response) => {

    const {
        estado,
        usuario,
        ...body
    } = req.body;
    body.nombre = body.nombre.toUpperCase();
    console.log(body);
    const productoDB = await Producto.findOne({ nombre: body.nombre });
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${body.nombre} ya existe.`
        });
    }

    // Generar la data a guardar
    const data = {
        usuario: req.usuario._id,
        ...body
    }
    const producto = new Producto(data);

    // Guardar en DB
    producto.save();

    res.status(201).json(producto);
};

// actualizarProducto
const actualizarProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const {
        estado,
        usuario,
        ...data
    } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.status(201).json(producto);

};

const eliminarProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    return res.status(201).json(producto);
};

module.exports = {
    obtenerProducto,
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}