const pool = require('../database/db');

/* GET REGIONS */
const getRegions = (req, res) => {
  const { country_id } = req.body;
  pool.query(
    `
    SELECT 
      re.id, 
      re.region, 
      co.country 
    FROM 
      regions
      AS re 
    INNER JOIN 
      countries
      AS co
      ON re.country_id = co.id
    WHERE
      re.country_id = ${country_id}
    ORDER BY 
      re.region ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE REGION */
const createRegion = (req, res) => {
  const { region, country_id } = req.body;
  pool.query(
    `INSERT INTO regions (region, country_id) VALUES ($1, $2)`,
    [region, country_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Region "${region}" added successfully.`);
    }
  );
};

/* UPDATE REGION */
const updateRegion = (req, res) => {
  const { id, region, country_id } = req.body;
  pool.query(
    `
    UPDATE 
      regions 
    SET 
      region = $1,
      country_id = $2,
    WHERE 
      id = $3`,
    [region, country_id, id]
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Region modified with ID: ${id}`);
    }
  );
};

/* DELETE REGION */
const deleteRegion = (req, res) => {
  const id = req.body;
  pool.query(`DELETE FROM regions WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Region deleted with ID: ${id}`);
  });
};

/* EXPORTS */
module.exports = {
  getRegions,
  createRegion,
  updateRegion,
  deleteRegion,
};
