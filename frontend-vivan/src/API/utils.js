import logo from "../assets/images/logo.png";
import axios from "axios";
import { post as HelperPost } from "../API/apiHelper";
import { Alert } from "react-bootstrap";

export async function apiurl(callback) {
  let setting = null;
  let settingFromSession = sessionStorage.getItem("settting");
  if (settingFromSession && settingFromSession != null) {
    setting = JSON.parse(settingFromSession);
  }

  callback(
    setting.razorpay_prod_on === 1
      ? setting.razorpay_prod_key
      : setting.razorpay_key
  );
}
function isMobileDevice() {
  const value =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  console.log("value is ", value);
  return value;
}
const openWindow = (id, amount, RefNo, callback) => {
  const newWindow = window.open(id, "_blank", "width=800,height=600");

  if (newWindow) {
    if (window.history.length > 1) {
    } else {
      // alert("Mobile");
      if (isMobileDevice()) {
        callback({}, amount, RefNo);
        // const interval = setInterval(() => {
        //   const lastPaymentUrl = localStorage.getItem("lastPaymentUrl");
        //   if (lastPaymentUrl) {
        //     alert("lastPaymentUrl");
        //     localStorage.removeItem("lastPaymentUrl");
        //     // Parse the saved URL
        //     const hashPart = lastPaymentUrl.split("#")[1] || "";
        //     const queryString = hashPart.includes("?")
        //       ? hashPart.split("?")[1]
        //       : "";
        //     const params = new URLSearchParams(queryString);
        //     const queryParams = {};
        //     params.forEach((value, key) => {
        //       queryParams[key] = value;
        //     });
        //     alert("✅ Restored Params:", queryParams);
        //     if (queryParams["status"]?.toLowerCase() === "success") {
        //       callback(
        //         { razorpay_payment_id: queryParams["easepayid"] || "n/a" },
        //         amount,
        //         RefNo
        //       );
        //     } else {
        // callback({}, amount, RefNo);
        // }
        // } else {
        // }
        // }, 1000);
      }
      // Start monitoring the window every second
      const interval = setInterval(() => {
        try {
          if (!newWindow || newWindow.closed) {
            // console.log("✅ Window closed by user or script.");
            clearInterval(interval);
          } else {
            let currentURL = "";
            try {
              currentURL = newWindow.location.href || "";
              // console.log(`currentURLcurrentURLcurrentURL ${currentURL}`);
            } catch (error) {
              // alert(`hi yogesh ${error}`);
              // console.log(error);
            }
            // alert("hi yogesh 2");
            // Close if URL changes OR contains "yogesh.com"
            if (
              // currentURL !== "https://api.vivantravels.com/sucess" ||
              currentURL.includes("/#/success")
            ) {
              // alert(currentURL);
              // console.log(currentURL);
              const hashPart = currentURL.split("#")[1] || ""; // e.g. "/sucess?param1=abc&param2=123"
              const queryString = hashPart.includes("?")
                ? hashPart.split("?")[1]
                : "";

              const params = new URLSearchParams(queryString);

              // Convert URL parameters to an object
              const queryParams = {};
              params.forEach((value, key) => {
                queryParams[key] = value;
              });

              // console.log("✅ URL Parameters:", queryParams);
              if (queryParams["status"] === "success") {
                callback(
                  { razorpay_payment_id: queryParams["easepayid"] || "n/a" },
                  amount,
                  RefNo
                );
              }
              // console.log(
              //   "🔴 Auto-closing window: URL changed or matched 'yogesh.com'."
              // );
              newWindow.close();
              clearInterval(interval);
            }
          }
        } catch (error) {
          alert("error");
          // console.warn(
          //   "⚠️ Cannot access the URL due to cross-origin restrictions."
          // );
          // Even if cross-origin access is blocked, the window object can still be closed safely
          if (newWindow.closed) {
            clearInterval(interval);
          }
          // newWindow.close();
        }
      }, 1000); // Check every second
    }
  } else {
    alert("Popup blocked! Please allow popups for this site.");
  }
};

// Function to manually close the opened window
const closeWindow = (popupWindow) => {
  if (popupWindow && !popupWindow.closed) {
    popupWindow.close();
  } else {
    alert("No open window found.");
  }
};

// Razorpay ko replace karke HDFC use karenge
export async function razarpaypayment(orderId, amount, email, callback) {
  try {
    console.log("🚀 HDFC Create Order Called");
console.log({
  orderId,
  amount,
  email
});
    const res = await HelperPost(
      "third_party/hdfc-create-order",
      {
        order_id: orderId,
        amount: amount,
        customer_email: email,
      },
      true
    );

    const data = await res.json();
 
    if (data.success) {
      // HDFC SmartGateway session url
      console.log(data)
      window.location.href = data.data.payment_links.web;
    } else {
      alert("Payment initiation failed");
    }

  } catch (error) {
    console.error("HDFC Payment Error:", error);
    alert("Payment error");
  }
}



let loadScript = (src) => {
  return new Promise((resolve) => {
    let script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};
