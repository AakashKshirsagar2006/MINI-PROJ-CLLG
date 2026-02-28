const loadRazorpay = () => {
  return new Promise((resolve) => {
    // 1. If Razorpay is already fully loaded in the browser memory, resolve instantly
    if (window.Razorpay) {
      return resolve(true);
    }

    // 2. If the script tag is already in the HTML (but maybe still downloading), don't add a duplicate
    if (document.getElementById("razorpay-checkout-script")) {
      return resolve(true);
    }

    // 3. Otherwise, create it EXACTLY ONCE
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script"; // We gave it an ID so we can track it
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };
    
    script.onerror = () => {
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

export default loadRazorpay;