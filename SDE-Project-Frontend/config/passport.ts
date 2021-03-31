const GoogleStrategy = require('passport-google-oauth20').Strategy
import axios from 'axios';
import config from './config';
import { isError } from './types';

module.exports = (passport: { use: (arg0: any) => void; serializeUser: (arg0: (user: any, done: any) => void) => void; deserializeUser: (arg0: (id: any, done: any) => void) => void }) => {
  passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
    async (accessToken: any, refreshToken: any, profile: { id: any; displayName: any; name: { givenName: any; familyName: any }; photos: { value: any }[] }, done: (arg0: null, arg1: any) => void) => {
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value,
        accessToken: accessToken
      }

      try {
        let user = (await axios.post(`${config.DB_ADAPTER}/updateuser`, newUser, {params: { userId: newUser.googleId, accessToken: newUser.accessToken } })).data;
        done(null, user)
      } catch (err) {
        try{
          let newuser = (await axios.post(`${config.DB_ADAPTER}/createuser`, newUser )).data;
          done(null, newuser)
        }catch(e) {
          console.log(e);
          //??? WHAT TO DO ???
        }
      }
    }))

  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser(async (user, done) => {
    try {
      const USER = await axios.get(`${config.DB_ADAPTER}/finduser`, {params: { googleId: user.googleId } });
      done(null, USER);
    } catch(err) {
      console.log(err)
    }
  })
}
