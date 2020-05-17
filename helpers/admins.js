/* PARSE GET ALL ADMINS QUERY */
const allAdmins = (data) => {

  // Push new 'admin' object into 'admins' array.
  const pushAdmin = (admin, admins) => {
    // console.log('admin pushed');
    admins.push(
      {
        id: admin.id,
        name: admin.first_n,
        last_name: admin.last_n,
        email: admin.email,
        password: admin.password,
        id_number: admin.id_number,
        phone: admin.phone,
        status: admin.status,
        created_at: admin.created_at,
        updated_at: admin.updated_at,
        buildings: [
          {
            building_id: admin.building_id,
            building_name: admin.building_name,
            building_address: admin.address
          },
        ]
      },
    );
  };

  // Push 'building' object into an 'admin' object in 'admins' array.
  const pushBuilding = (admin, admins) => {
    const index = admins.indexOf(admins.find(elem => elem.id === admin.id));
    admins[index].buildings.push(
      {
        building_id: admin.building_id,
        building_name: admin.building_name,
        building_address: admin.address
      },
    );
    // console.log('building pushed');
  };

  // Check if 'admin' object already exist in 'admins' array.
  const parseAdmins = (admin, admins) => {
    (admins.find(elem => elem.id === admin.id) == undefined) ? pushAdmin(admin, admins) : pushBuilding(admin, admins);
  };
    
  let admins = [];
  data.map((admin) => parseAdmins(admin, admins));
  return admins;
}

module.exports = allAdmins;