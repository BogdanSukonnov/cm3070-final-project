const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const Filestore = require('session-file-store')(session);

const cors = require('cors');

const app = express();

const PORT = process.env.PORT ?? 3001;

const viewedVideosRoute = require('./routes/viewedVideos.route');
const reviewsRoute = require('./routes/reviews.route');
const categoriesRoute = require('./routes/categories.route');
const courseContentRoute = require('./routes/courseContent.route');
const signinRouter = require('./routes/signin.route');
const clientRouter = require('./routes/client.route');
const cabinetRouter = require('./routes/cabinet.route');
const adminAuthRouter = require('./routes/adminAuth.route');
const adminPassChange = require('./routes/AdminPassChange.router');
const signoutRouter = require('./routes/signout.route');
const editReviewRouter = require('./routes/editreview.route');
const sessionRouter = require('./routes/session.route');

const sessionMiddleware = require('./middlewares/sessions');

const sessionConfig = {
  store: new Filestore(),
  name: 'user_sid',
  secret: process.env.SECRET ?? 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 час
    httpOnly: true,
  },
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(session(sessionConfig));
app.use(sessionMiddleware);
app.use(cors({
  origin: 'http://localhost:3000/',
  credentials: true,
  origin: 'http://localhost:3000',
}));

app.use('/viewed_videos', viewedVideosRoute)
app.use('/reviews', reviewsRoute);
app.use('/categories', categoriesRoute);
app.use('/courseContent', courseContentRoute);
app.use('/signup', clientRouter);
app.use('/signin', signinRouter);
app.use('/signout', signoutRouter);
app.use('/adminform', adminAuthRouter);
app.use('/profile', cabinetRouter);
app.use('/session', sessionRouter);
app.use('/adminpasschange', adminPassChange);
app.use('/editreview', editReviewRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(session(sessionConfig));
app.use(sessionMiddleware);
app.use(cors({
  origin: 'http://localhost:3000/',
  credentials: true,
  origin: 'http://localhost:3000',
}));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server listens to port', PORT);
});

