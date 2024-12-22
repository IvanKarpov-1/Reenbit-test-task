export const getSubFromJwt = (auth) => {
  return auth.payload.sub;
};
