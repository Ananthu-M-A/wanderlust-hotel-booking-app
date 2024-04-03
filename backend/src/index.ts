import express from 'express';
import cors from 'cors';
import http from 'http';
import messageSocket from './sockets/messageSocket';
import "dotenv/config";
import { connectDb } from './utils/MongoDB';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import authRouter from './routes/auth.route';
import adminRouter from './routes/admin.route';
import usersRouter from './routes/users.route';
import hotelsRouter from './routes/hotels.route';
import bookingsRouter from './routes/bookings.route';
import profileRouter from './routes/profile.route';
import homeRouter from './routes/home.route';
import bookingRouter from './routes/booking.route';
import restaurantsRouter from './routes/restaurants.route';

connectDb();

const app = express();

const server = http.createServer(app);
messageSocket(server);

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || "Secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 86400000,
    },
}));

app.use("/api/user", authRouter);
app.use("/api/user/profile", profileRouter);
app.use("/api/user/home", homeRouter);
app.use("/api/user/booking", bookingRouter);

app.use("/api/admin", adminRouter);
app.use("/api/admin/users", usersRouter);
app.use("/api/admin/hotels", hotelsRouter);
app.use("/api/admin/restaurants", restaurantsRouter);
app.use("/api/admin/bookings", bookingsRouter);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
