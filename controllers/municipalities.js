const pool = require('../database/db');

/* GET MUNICIPALITIES */
const getMunicipalities = (req, res) => {
  const {column, id} = req.body;
  pool.query(
    `
    SELECT 
      mu.id,
      mu.municipality,
      re.region,
      co.country
    FROM 
      municipalities 
      AS mu
    INNER JOIN
      regions
      AS re
      ON mu.region_id = re.id
    INNER JOIN
      countries
      AS co
      ON mu.country_id = co.id
    WHERE
      mu.${column} 
      IN(${id})
    ORDER BY 
      region ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

/* CREATE MUNICIPALITY */
const createMunicipality = (req, res) => {
  const { municipality, region_id, country_id } = req.body;
  pool.query(
    `
    INSERT INTO 
      municipalities 
      (municipality, region_id, country_id) 
    VALUES 
      ($1, $2, $3)`,
    [municipality, region_id, country_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res
        .status(201)
        .send(`Municipality "${municipality}" created.`);
    }
  );
};

/* UPDATE MUNICIPALITY */
const updateMunicipality = (req, res) => {
  const { id, municipality, region_id, country_id } = req.body;
  pool.query(
    `
    UPDATE 
      municipalities 
    SET 
      municipality = $1,
      region_id = $2,
      country_id = $3
    WHERE
      id = $4`,
    [municipality, region_id, country_id, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Municipality ${id} modified.`);
    }
  );
};

/* DELETE MUNICIPALITY */
const deleteMunicipality = (req, res) => {
  const id = req.body;
  pool.query(
    `DELETE FROM municipalities WHERE id = ${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Municipality ${id} deleted.`);
    }
  );
};

/* EXPORTS */
module.exports = {
  getMunicipalities,
  createMunicipality,
  updateMunicipality,
  deleteMunicipality,
};
