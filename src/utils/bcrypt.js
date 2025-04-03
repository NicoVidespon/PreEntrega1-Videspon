import bcrypt from "bcrypt";

export const createHash = (password) => bcrypt.hashSync(password, 10);

export const isValidPassword = (password, hash) => bcrypt.compareSync(password, hash);
