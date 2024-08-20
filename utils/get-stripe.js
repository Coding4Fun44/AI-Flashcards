import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      "pk_test_51PnLxMA1HYmDmfjUTP8AHS2RkyDY6hC1LhvTFXvujrmmu5av8TnKuBjsTUWXzn21b8VtPN1OUTp4OtepFtiBelMv00EwmgZHig"
    );
  }
  return stripePromise;
};

export default getStripe;
