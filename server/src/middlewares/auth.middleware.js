export const protect = (req, res, next) => {
  //temporary middleware for testing purposes
  req.user = {
    id: "000000000000000000000000",
  };

  next();
};
