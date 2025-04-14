import UserModel from "./models/UserModel.js";
import CartModel from "./models/CartModel.js";

class SessionsDaoMongo {
    
    getUser = async (email) => {
        return await UserModel.findOne({ email });
    };

    createUser = async (userData) => {
        const newCart = await CartModel.create({ products: [] });

        const newUser = {
            ...userData,
            cart: newCart._id
        };

        return await UserModel.create(newUser);
    };
}

export default SessionsDaoMongo;
