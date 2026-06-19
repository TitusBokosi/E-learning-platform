const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { getUserByEmail, createUser } = require('../queries/users');

const initializeGooglePassport = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          let user = await getUserByEmail(email);

          if (!user) {
            // Create user if not exists
            user = await createUser({
              email: email,
              firstname: profile.name.givenName || profile.displayName,
              lastname: profile.name.familyName || '',
              image: profile.photos[0]?.value || null,
              provider: 'GOOGLE',
              providerId: profile.id,
            });
          } else if (user.provider === 'LOCAL') {
              // Optionally link local account to google if emails match
              // For now, just allow login but we could update the provider if desired
              // user = await updateUser(user.id, { provider: 'GOOGLE', providerId: profile.id });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

module.exports = initializeGooglePassport;
