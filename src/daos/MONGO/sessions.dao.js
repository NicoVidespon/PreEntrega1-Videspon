import  userModel  from "./models/UserModel.js"

export default class SessionsDaoMongo {
    constructor(){
        this.userModel = userModel
    }

    getUser =    async email => await this.userModel.findOne({ email })
    createUser = async newUser => await this.userModel.create(newUser)
}
