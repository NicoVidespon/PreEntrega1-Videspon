import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserModel from "../daos/MONGO/models/UserModel.js";
import { configObject } from "./index.js";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),   
    (req) => req?.cookies?.coderCookieToken,  
  ]),
  secretOrKey: configObject.privateKey,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await UserModel.findById(payload.id);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;
