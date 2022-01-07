const { response, request } = require("express");

const getUsuarios = (req = request, res = response) => {
  const { nombre, apikey } = req.query;
  res.json({
    msg: "GET Api - Controller",
    nombre,
    apikey,
  });
};

const postUsuarios = (req, res = response) => {
  const { nombre, edad } = req.body;
  res.json({
    msg: "POST Api - Controller",
    nombre,
    edad,
  });
};

const putUsuarios = (req, res = response) => {
  const { id } = req.params;
  res.json({
    msg: "PUT Api - Controller",
    id,
  });
};

const deleteUsuarios = (req, res = response) => {
  res.json({
    msg: "DELETE Api - Controller",
  });
};

const patchUsuarios = (req, res = response) => {
  res.json({
    msg: "PATCH Api - Controller",
  });
};

module.exports = {
  getUsuarios,
  postUsuarios,
  putUsuarios,
  deleteUsuarios,
  patchUsuarios,
};
