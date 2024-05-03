const convertFormDataToJson = (requestBody) => {
  const { s3Keys } = requestBody;

  const applicationData = {
    ...requestBody,
    address: JSON.parse(requestBody.address),
    car: JSON.parse(requestBody.car),
    reference: JSON.parse(requestBody.reference),
    emergency: JSON.parse(requestBody.emergency),
    picture: s3Keys.picture,
    driverLicense: {
      number: requestBody.driverLicense_number,
      expirationDate: requestBody.driverLicense_expirationDate,
      document: s3Keys.DriverLicense,
    },
    workAuthorization: {
      type: requestBody.workAuthorization_type,
      document: s3Keys.WorkAuthorization,
      startDate: requestBody.workAuthorization_startDate,
      endDate: requestBody.workAuthorization_endDate,
    },
  };

  return applicationData;
};

export default convertFormDataToJson;
