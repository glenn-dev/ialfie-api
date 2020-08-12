/* PARSE PROPERTY DATA */
const parsePropertyData = (data) => {
  const pushSubProperties = (rawData) => {
    let subPropertiesArr = [];
    rawData.forEach((property) => {
      if (
        subPropertiesArr.find(
          (elem) => elem.subPropertyId === property.sub_property_id
        ) === undefined
      ) {
        subPropertiesArr.push({
          subPropertyId: property.sub_property_id,
          subPropertyType: property.sub_property_type,
          subPropertyNumber: property.sub_property_number,
          subPropertyFloor: property.sub_property_floor,
          subPropertyAliquot: property.sub_property_aliquot,
        });
      }
    });
    console.log(subPropertiesArr);
    return subPropertiesArr;
  };

  const pushUsers = (rawData) => {
    let useraArr = [];
    rawData.forEach((user) => {
      if (useraArr.find((elem) => elem.userId === user.user_id) === undefined) {
        useraArr.push({
          userId: user.user_id,
          image: user.image,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          userTypeId: user.user_type_id,
          userType: user.user_type,
        });
      }
    });
    return useraArr;
  };

  return {
    id: data[0].id,
    propertyTypeId: data[0].property_type_id,
    propertyType: data[0].property_type,
    number: data[0].number,
    floor: data[0].floor,
    aliquot: data[0].aliquot,
    status: data[0].status,
    defaulting: data[0].defaulting,
    buildingId: data[0].building_id,
    users: pushUsers(data),
    subProperties: data[0].sub_property_id ? pushSubProperties(data) : null,
  };
};

module.exports = parsePropertyData;
