import UserDto from "../dtos/users.dto.js";

export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createUser = async (newUser) => {
    const userDto = new UserDto(newUser);
    return await this.dao.create(userDto);
  };

  getUsers = async () => {
    return await this.dao.get();
  };

  getUser = async (filter) => {
    return await this.dao.getBy(filter);
  };

  updateUser = async (uid, userToUpdate) => {
    return await this.dao.update(uid, userToUpdate);
  };

  deleteUser = async (uid) => {
    return await this.dao.delete(uid);
  };
}
