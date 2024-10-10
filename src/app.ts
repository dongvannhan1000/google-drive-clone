import express from 'express';
import passport from './config/passport';
import { sessionMiddleware } from './config/session';
import authRoutes from './routes/authRoutes';
import fileRoutes from './routes/fileRoutes';
import { errorHandler } from './middleware/errorHandler';
import methodOverride from 'method-override';

const app = express();

app.set("views", __dirname + '/views');
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.use('/', authRoutes);
app.use('/files', fileRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Open your browser and visit: http://localhost:${PORT}`);
});