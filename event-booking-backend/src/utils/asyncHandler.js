// Yeh function har async controller ko wrap karta hai.
// Agar andar koi error throw ho (ya Promise reject ho), yeh automatically
// next(error) call kar deta hai — jo seedha errorHandler middleware tak pohonchta hai.
// Isse har controller mein manually try/catch likhne ki zaroorat nahi padti.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;