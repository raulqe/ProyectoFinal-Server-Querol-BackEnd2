import { userDao } from "../dao/mongo/user.dao.js";

export class UserServices {
    async getAll() {
        const users = await userDao.find();
        return users;
    };

    async getById(id) {
        const user = await userDao.findById(id);
        return user;
    }
    async getByEmail(email){
        const user = await userDao.findOne(email);
        return user;
    };

    async create(data) {
        const user = await userDao.create(data);
        return user;
    };

    async update(id, data) { 
        const userUpdate = await userDao.findByIdAndUpdate(id, data);
        return userUpdate;
    };

    async deleteOne(id) {
        const user = await userDao.findByIdAndUpdate(id);
        return user;
    };
};

export const userServices = new UserServices();