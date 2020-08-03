/* PUSH USER METHOD */
const pushUser = (user, usersArray = []) => {
  usersArray.push({
    id: user.id,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    image: user.image,
    firstName: user.first_name,
    lastName: user.last_name,
    identityNumber: user.identity_number,
    phone: user.phone,
    email: user.email,
    status: user.status,
  });
  return usersArray;
};

/* PARSE USER BY ID QUERY */
const parseUserInfo = (data) => {
  let response = pushUser(data[0]);
  response[0].properties = [];

  data.forEach((user) => {
    response[0].properties.push(      
      {
        id: user.property_id,
        type: user.property_type,
        number: user.property_number,
        floor: user.floor,
        defaulting: user.defaulting,
        status: user.property_status,
        mainProperty: user.main_property_flag
      }
    )
  })
  return response;
};

/* PARSE ALL USERS QUERY */
const parseAllUsers = (users) => {
  let usersArray = [];
  users.forEach((user) => {
    if (usersArray.find((elem) => elem.id === user.id) === undefined) {
      pushUser(user, usersArray);
    }
  });

  return usersArray;
};

/* EXPORTS */
module.exports = { parseAllUsers, parseUserInfo };
