/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51MV0zxB5i2Nx1FevxbAqBoduWgcVRaV3WZ8iuKcSotVzou39x4UIrE2v3UVXwijIr112lTQEhaaf0Q3Jn7FRkGfW00Rtj5NuZg'
);

export const bookTour = async (tourId) => {
  try {
    // 1) get checkout session from API:
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) create checkout form + change credit card:
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
