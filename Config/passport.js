import dotenv from 'dotenv';
import passport from 'passport';
import { UsersModule } from '../Models/Postgres/user.js';
import bcrypt from 'bcrypt'
import { validatUsers } from '../Schemas/user.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/user/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await UsersModule.getByGoogleId({ googleId: profile.id });

        if (!user) {
            const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), parseInt(process.env.SALT_ROUNDS));

            console.log("Soy la id de google ", profile.id)

            const newUser = {
                username: profile.name.givenName || profile.displayName,
                googleId: profile.id,
                surname: profile.name.familyName || '',
                password: randomPassword,
                email: profile.emails[0].value,
                photo: profile.photos[0].value,
                address: '',
                birthdate: '2001-01-01'
            }

            const result = validatUsers(newUser)

            const { data } = result

            user = await UsersModule.create({ input: data })
        }

        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UsersModule.getById({ id });
        done(null, user);
    } catch (error) {
        done(error, false)
    }
})