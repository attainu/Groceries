const passport = require("passport");
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const Customer = require("./models/Customer");
const passwords = require('./passwords/passwords')
const privateKey = passwords.privateKey

// JWT Strategy authentication
const optJwt = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderWithScheme("JWT"),
    req => req.cookies.JWT
  ]),
  secretOrKey: privateKey
};
passport.use(

  new JWTStrategy(optJwt, async ({ customerId }, done) => {
    try {
      const customer = await Customer.findOne({_id:customerId});
      console.log(customer,"passport")
      if (!customer) return done(null, false, { message: "Incorrect Credentials" });
       if(customer){
         return done(null, customer);
       }
    } catch (err) {
      if (err.name === "Error") {
        done(err);
      }
    }
  })
);
const { G_CLIENT_ID, G_CLIENT_SECRET } = process.env;
const googleOptions = {
  clientID: G_CLIENT_ID,
  clientSecret: G_CLIENT_SECRET,
  callbackURL: `http://localhost:1234/google/redirect`
};

passport.use(
  new GoogleStrategy(
    googleOptions,
    async (accessToken, refreshToken,googleProfile, done) => {
      try {
       // console.log(googleOptions)
        const {
          _json: { email, name }
        } = googleProfile;
        let customer = await Customer.findOne({ email });
        if (!customer)
          customer = await Customer.create({ email, name, isThirdPartyUser: true });
        return done(null, customer);
      } catch (err) {
        if (err.name === "Error") {
          return done(err);
        }
      }
    }
  )
);