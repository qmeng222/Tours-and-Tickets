/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51MV0zxB5i2Nx1FevxbAqBoduWgcVRaV3WZ8iuKcSotVzou39x4UIrE2v3UVXwijIr112lTQEhaaf0Q3Jn7FRkGfW00Rtj5NuZg'
  );

  try {
    // 1) get checkout session from API:
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) create checkout form + change credit card:
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
