const isValidDescription = (description) => {
  return description?.length >= 15 && description?.length <= 200;
};

export default isValidDescription;