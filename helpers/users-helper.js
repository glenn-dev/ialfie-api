/* PARSE USERS QUERY */

const goParseUsers = (data) => {
  /* Push new 'user' object into 'users' array. */
  const pushUser = (user, users) => {
    users.push({
      id: user.id,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      maternal_surname: user.maternal_surname,
      identity_card: user.identity_card,
      email: user.email,
      phone: user.phone,
      image: user.image,
      status: user.status,
      user_type_id: user.user_type_id,
      user_type: user.user_type,
      updated_at: user.updated_at,
      created_at: user.created_at,
      buildings: [
        {
          building_id: user.building_id,
          building_name: user.building,
          street: user.street,
          block_number: user.block_number,
          departments: [
            {
              dep_id: user.department_id,
              dep_number: user.number,
              dep_floor: user.floor,
              dep_aliquot: user.aliquot,
              dep_defaulting: user.defaulting,
              dep_status: user.dep_status,
            },
          ],
        },
      ],
    });
  };

  /* Push 'building' object into an 'user' object in 'users' array. */
  const pushBuilding = (user, users, index) => {
    users[index].buildings.push({
      building_id: user.building_id,
      building_name: user.building,
      street: user.street,
      block_number: user.block_number,
      departments: [
        {
          dep_id: user.department_id,
          dep_number: user.number,
          dep_floor: user.floor,
          dep_aliquot: user.aliquot,
          dep_defaulting: user.defaulting,
          dep_status: user.dep_status,
        },
      ],
    });
  };

  /* Push 'department' object into a 'building' object into 'user' object on 'users' array. */
  const pushDepartment = (user, users, u_index) => {
    const b_index = users[u_index].buildings.length - 1;
    users[u_index].buildings[b_index].departments.push({
      dep_id: user.department_id,
      dep_number: user.number,
      dep_floor: user.floor,
      dep_aliquot: user.aliquot,
      dep_defaulting: user.defaulting,
      dep_status: user.dep_status,
    });
  };

  /* Check if 'building' object already exist in 'user' object. */
  const parseBuilding = (user, users) => {
    const index = users.length - 1;
    users[index].buildings.find(
      (elem) => elem.building_id === user.building_id
    ) === undefined
      ? pushBuilding(user, users, index)
      : pushDepartment(user, users, index);
  };

  /* Check if 'user' object already exist in 'users' array. */
  const parseUsers = (user, users) => {
    users.find((elem) => elem.id === user.id) === undefined
      ? pushUser(user, users)
      : parseBuilding(user, users);
  };

  /* Check if data represent one or many object, then parse. */
  let users = [];
  data.length > 1
    ? data.map((user) => parseUsers(user, users))
    : pushUser(data[0], users);
  return users;
};

/* EXPORTS */
module.exports = goParseUsers;
