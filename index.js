require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const stripe = require('stripe')(process.env.STRIPE_API_KEY);


const router = express.Router();

router.use(cors());

router.use(bodyParser.json());


router.use(bodyParser.urlencoded({ extended: true }));


router.post('/pay', async (request, response) => {
    try {

        let intent = await stripe.paymentIntents.create({
            payment_method: request.body.payment_method_id,
            description: 'Test payment',
            amount: request.body.amount * 100,
            currency: 'inr',
            confirmation_method: 'manual',
            confirm: true,
        });

        response.send(generateResponse(intent));
    } catch (e) {

        return response.send({ error: e.message });
    }
});

const generateResponse = (intent) => {
    if (intent.status === 'succeeded') {

        return {
            success: true,
        };
    } else {

        return {
            error: 'Invalid PaymentIntent status',
        };
    }
};

router.get('/', (req, res) => {
    res.send('Stripe Integration! - Clue Mediator');
});

module.exports = router;