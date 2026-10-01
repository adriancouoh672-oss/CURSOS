function idValido(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function convertirBooleano(valor) {
  if (valor === 'true' || valor === '1') return true;
  if (valor === 'false' || valor === '0') return false;
  return valor;
}

function ocultarCampos(entidad, camposOcultos) {
  if (!entidad) return entidad;

  const resultado = entidad.toJSON ? entidad.toJSON() : { ...entidad };
  camposOcultos.forEach((campo) => delete resultado[campo]);
  return resultado;
}

function crearControladorCrud({
  Model,
  filtros = {},
  filtrosBooleanos = [],
  camposOcultos = []
}) {
  const get = async (request, response) => {
    try {
      const where = {};

      Object.entries(filtros).forEach(([parametro, atributo]) => {
        const valor = request.query[parametro];

        if (valor !== undefined && valor !== '') {
          where[atributo] = filtrosBooleanos.includes(parametro)
            ? convertirBooleano(valor)
            : valor;
        }
      });

      const entidades = await Model.findAll({ where });
      return response.json(
        entidades.map((entidad) => ocultarCampos(entidad, camposOcultos))
      );
    } catch (error) {
      console.error(`Error consultando ${Model.name}:`, error.message);
      return response.status(500).json({ mensaje: 'Error consultando los datos' });
    }
  };

  const getById = async (request, response) => {
    const id = idValido(request.params.id);

    if (!id) {
      return response.status(400).json({ mensaje: 'El id debe ser un entero positivo' });
    }

    try {
      const entidad = await Model.findByPk(id);

      if (!entidad) {
        return response.status(404).json({ mensaje: 'Recurso no encontrado' });
      }

      return response.json(ocultarCampos(entidad, camposOcultos));
    } catch (error) {
      console.error(`Error consultando ${Model.name}:`, error.message);
      return response.status(500).json({ mensaje: 'Error al consultar el dato' });
    }
  };

  const create = async (request, response) => {
    try {
      const nuevaEntidad = await Model.create(request.body);
      return response
        .status(201)
        .json(ocultarCampos(nuevaEntidad, camposOcultos));
    } catch (error) {
      console.error(`Error creando ${Model.name}:`, error.message);
      return response.status(500).json({ mensaje: 'Error al crear el recurso' });
    }
  };

  const update = async (request, response) => {
    const id = idValido(request.params.id);

    if (!id) {
      return response.status(400).json({ mensaje: 'El id debe ser un entero positivo' });
    }

    try {
      const entidad = await Model.findByPk(id);

      if (!entidad) {
        return response.status(404).json({ mensaje: 'Recurso no encontrado' });
      }

      await entidad.update(request.body);

      return response.json({
        mensaje: 'Recurso actualizado correctamente',
        recurso: ocultarCampos(entidad, camposOcultos)
      });
    } catch (error) {
      console.error(`Error actualizando ${Model.name}:`, error.message);
      return response.status(500).json({ mensaje: 'Error al actualizar el recurso' });
    }
  };

  const destroy = async (request, response) => {
    const id = idValido(request.params.id);

    if (!id) {
      return response.status(400).json({ mensaje: 'El id debe ser un entero positivo' });
    }

    try {
      const registrosEliminados = await Model.destroy({ where: { id } });

      if (registrosEliminados === 0) {
        return response.status(404).json({ mensaje: 'Recurso no encontrado' });
      }

      return response.json({ mensaje: 'Recurso eliminado correctamente' });
    } catch (error) {
      console.error(`Error eliminando ${Model.name}:`, error.message);
      return response.status(500).json({ mensaje: 'Error al eliminar el recurso' });
    }
  };

  return { get, getById, create, update, destroy };
}

module.exports = crearControladorCrud;
