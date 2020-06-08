/* PARSE ADMINS QUERY */
const goParse = (data) => {
  /* Push new 'admin' object into 'admins' array. */
  const pushAdmin = (admin, admins) => {
    admins.push({
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
          building_name: admin.building,
          building_address: admin.address,
        },
      ],
    });
  };
  /* Push 'building' object into an 'admin' object in 'admins' array. */
  const pushBuilding = (admin, admins) => {
    const index = admins.length - 1;
    admins[index].buildings.push({
      building_id: admin.building_id,
      building_name: admin.building,
      building_address: admin.address,
    });
  };
  /* Check if 'admin' object already exist in 'admins' array. */
  const parseAdmins = (admin, admins) => {
    admins.find((elem) => elem.id === admin.id) === undefined
      ? pushAdmin(admin, admins)
      : pushBuilding(admin, admins);
  };
  /* Check if data represent one or many object, then parse. */
  let admins = [];
  data.length > 1
    ? data.map((admin) => parseAdmins(admin, admins))
    : pushAdmin(data[0], admins);
  return admins;
};
/* EXPORTS */
module.exports = goParse;
