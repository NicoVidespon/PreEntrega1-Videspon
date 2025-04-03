import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserModel from "../daos/MONGO/models/UserModel.js";
import dotenv from "dotenv";

dotenv.config(); 

const JWT_SECRET = process.env.JWT_SECRET;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req?.cookies?.token,
  ]),
  secretOrKey: JWT_SECRET,
};

passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await UserModel.findById(jwt_payload.id);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
