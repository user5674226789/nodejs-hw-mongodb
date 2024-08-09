export const ctrlWrapper = (controller) => {
  return async (req, res,) => {
    try {
      await controller(req, res, next);
    } catch (err){
       next(err)
    } 
  };
};
