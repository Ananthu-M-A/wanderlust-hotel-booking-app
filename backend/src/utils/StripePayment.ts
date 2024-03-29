import { Request, Response } from "express";
import { SessionUserData } from '../interfaces/SessionInterface';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

export const sessionPayment =
    async (req: Request, res: Response,
        name: string, description: string, unit_amount: number, quantity: number,
        success_url: string, cancel_url: string) => {
        try {
            const bookingData = [{
                price_data: {
                    currency: "inr",
                    product_data: { name, description },
                    unit_amount,
                },
                quantity,
            }];

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: bookingData,
                mode: "payment",
                success_url, cancel_url,
            });
            res.json({ id: session.id });

        } catch (error) {
            console.log("Error in creating session payment", error);
        }
    }

export const retrievePaymentId = async (sessionId: any) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const paymentIntentId = session.payment_intent;
        return paymentIntentId;
    } catch (error) {
        console.log("Error retrieving payment id", error);
    }
}