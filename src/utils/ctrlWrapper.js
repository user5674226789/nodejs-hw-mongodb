export const ctrlWrapper = (controller) => {
  return async (req, res,) => {
    try {
      await controller(req, res,);
    } catch (err){} 
  };
};
