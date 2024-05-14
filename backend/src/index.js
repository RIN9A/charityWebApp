const express = require('express')
const app = express()
const { PORT, CLIENT_URL } = require('./constants');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const { SECRET } = require('./constants')

require('./middlewares/passport.middleware')
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: SECRET,
    resave: true,
    saveUninitialized: true}));

app.use(cors({ origin: CLIENT_URL, credentials: true}))
app.use(passport.initialize())
app.use(passport.session());
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/post')
const userRoutes = require('./routes/user.route')
const organizationRoutes = require('./routes/organizations')
const donationRoutes = require('./routes/donation')
const projectRoute = require('./routes/projects')

app.use('/api', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)
app.use('/api/organization', organizationRoutes)
app.use('/api/donation', donationRoutes)
app.use('/api/project', projectRoute)

const appStart = () => {
    try{
        app.listen(PORT, () =>{
            console.log(`The app is running at http://localhost:${PORT}`)
        })
    } catch(error) {
        console.log(`Error: ${error.message}`)
    }
}
appStart()