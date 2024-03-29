import { Request, Response } from 'express';
import Booking from '../models/booking.model';

export const loadBookings = async (req: Request, res: Response) => {
    try {
        const queries = req.query;
        let query = {};
        if (queries.bookingId && queries.bookingId.length === 24) {
            query = { _id: queries.bookingId };
        }
        const pageSize = 10;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;

        const bookings = await Booking.find({ ...query }).skip(skip).limit(pageSize).populate("hotelId").populate("restaurantId");
        const total = await Booking.countDocuments({ ...query, isBlocked: false });

        const response = {
            data: bookings,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            }
        };

        res.json(response);
    } catch (error) {
        console.log("Error in loading user bookings table", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};

export const loadBookingDetails = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const bookingDetails = await Booking.findOne({ _id: bookingId }).populate("hotelId").populate("restaurantId");
        res.json(bookingDetails);
    } catch (error) {
        console.log("Error in loading user booking details", error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
};