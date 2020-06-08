const pool = require("./db");
/********************************************************************* 
*** WARNING *** !! *** DANGER *** !! *** WARNING *** !! *** DANGER ***

  * !! FUNCTIONS BELOW WILL ALTER DATABASE INTEGRITY PERMANENTLY !! * 

  * !! DO NEVER EXECUTE THEM IN PRODUCTION ENVIRONMENTS !! * 

 *** WARNING *** !! *** DANGER *** !! *** WARNING *** !! *** DANGER *** 
**********************************************************************/

/* DELETE DATA */
let resetDb = (tables) => {
  pool.query(`DELETE FROM ${tables}`, (error, results) => {
    if (error) {
      throw error;
    }
    console.log(`All data in tables: ${tables} were removed!!`);
  });
};

/* SEED DATA (UNFINISHED METHOD) */
function seedDb(amount) {
  for (let i = 0; i < amount; i++) {
    pool.query(
      `
      INSERT INTO buildings ( name, address, image, status ) 
      VALUES ('Building ${i}', 'Address for building ${i}', '/image/path/for/building_${i}','true')`,
      (error, results) => {
        if (error) {
          throw error;
        }
        console.log(`Building "${i}" added successfully`);
      }
    );
  }
}

console.log(
  "!! * WARNING * !! DISABLE 'seed.js' FILE IN PRODUCTION ENVIRONMENTS !!"
);

/* SET TABLES TO RESET/SEED */
let tables = [
  "admins",
  "admins_buildings",
  "bill_details",
  "bills",
  "buildings",
  "communications",
  "concepts",
  "departments",
  "general_expenses",
  "payments",
  "users",
  "users_buildings",
  "users_departments",
];

/*  *** DANGER *** !! *** DANGER *** !! *** DANGER *** !! *** DANGER ***  */

// resetDb('admins');  /* * !! RUN AT YOUR OWN RISK !! * */

// seedDb(3);         /* * !! RUN AT YOUR OWN RISK !! * */

/* *** DANGER *** !! *** DANGER *** !! *** DANGER *** !! *** DANGER ***  */
