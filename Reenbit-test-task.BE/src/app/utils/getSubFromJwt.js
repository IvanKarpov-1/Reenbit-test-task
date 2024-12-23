export const getSubFromJwt = (auth) => {
  if (!auth) return null;
  return auth.payload.sub;
};
