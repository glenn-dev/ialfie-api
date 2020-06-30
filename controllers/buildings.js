const pool = require('../database/db');

/* GET ALL BUILDINGS */
const getBuildings = (req, res) => {
  pool.query('SELECT * FROM buildings ORDER BY name ASC', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

/* GET BUILDINGS BY ID */
const getBuildingsById = (req, res) => {
  pool.query(
    `
    SELECT 
      bu.id,
      bu.name,
      bu.image,
      bu.status,
      bu.street,
      bu.block_number,
      mu.municipality,
      re.region,
      co.country
    FROM 
      buildings 
      AS bu
    INNER JOIN
      municipalities
      AS mu
      ON bu.municipality_id = mu.id
    INNER JOIN
      regions
      AS re
      ON bu.region_id = re.id
    INNER JOIN
      countries
      AS co
      ON bu.country_id = co.id
    WHERE 
      id = ${req.body}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE BUILDING */
const createBuilding = (req, res) => {
  const {
    name,
    image,
    status,
    street,
    block_number,
    municipality_id,
    region_id,
    country_id,
  } = req.body;
  pool.query(
    `
    INSERT INTO 
      buildings 
      (
        name, 
        image, 
        status, 
        street, 
        block_number, 
        municipality_id, 
        region_id, 
        country_id
      ) 
    VALUES 
      (
        ${name}, 
        ${image}, 
        ${status}, 
        ${street}, 
        ${block_number}, 
        ${municipality_id}, 
        ${region_id}, 
        ${country_id}
      ) 
    RETURNING id`,
    (error, results) => {
      if (error) {
        throw error;
      }
      insertRelations(results.rows[0].id, cutoff_date)
        .then(res.status(201).send(`Building "${name}" added successfully`))
        .catch((err) => {
          throw err;
        });
    }
  );
};

/* CREATE BUILDING RELATIONS */
const insertRelations = (building_id, cutoff_date) => {
  pool.query(
    `
    INSERT INTO 
      building_setups 
      (cutoff_date, building_id) 
    VALUES 
      (${cutoff_date}, ${building_id})`
  );
};

/* UPDATE BUILDING */
const updateBuilding = (req, res) => {
  const {
    id,
    name,
    image,
    status,
    street,
    block_number,
    municipality_id,
    region_id,
    country_id,
    cutoff_date,
  } = req.body;
  pool.query(
    `
    UPDATE 
      buildings 
    SET 
      name ${name},
      image ${image},
      status ${status},
      street ${street},
      block_number ${block_number},
      municipality_id ${municipality_id},
      region_id ${region_id},
      country_id ${country_id}
    WHERE 
      id = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      deleteRelations(id)
        .then(
          insertRelations(id, cutoff_date)
            .then(res.status(200).send(`Building modified with ID: ${id}`))
            .catch((err) => {
              throw err;
            })
        )
        .catch((err) => {
          throw err;
        });
    }
  );
};

/* DELETE BUILDINGS */
const deleteBuildings = (req, res) => {
  const id = req.body;
  deleteRelations(id)
    .then(
      pool.query(
        `DELETE FROM buildings WHERE id IN(${id})`,
        (error, results) => {
          if (error) {
            throw error;
          }
          res.status(200).send(`Building deleted with ID: ${id}`);
        }
      )
    )
    .catch((err) => {
      throw err;
    });
};

/* DELETE BUILDING RELATIONS */
const deleteRelations = (building_id) => {
  pool.query(`DELETE FROM building_setups WHERE building_id = ${building_id}`);
};

/* EXPORTS */
module.exports = {
  getBuildings,
  getBuildingsById,
  createBuilding,
  updateBuilding,
  deleteBuildings,
};
