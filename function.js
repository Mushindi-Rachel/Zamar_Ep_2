const form = document.getElementById("registrationForm");
const accommodation = document.getElementById("accommodation");
// const paymentSection = document.getElementById("payment-section");
// const paymentMethod = document.getElementById("payment-method");
// const receiptNo = document.getElementById("receipt_no");
// const mpesaCode = document.getElementById("mpesa-code");

// Submit to Google Script

form.addEventListener("submit", async(e) => {
    e.preventDefault();

    // // basic validation for boarders
    // if (accommodation.value === "boarder") {
    //     if (paymentMethod.value === "mpesa" && !mpesaCode.value.trim()) {
    //         Swal.fire("M-Pesa code required", "Please enter your M-Pesa code.", "warning");
    //         return;
    //     }
    //     if (paymentMethod.value === "cash" && !receiptNo.value.trim()) {
    //         Swal.fire("Receipt number required", "Please enter your cash receipt number.", "warning");
    //         return;
    //     }
    // }

    const formData = new FormData(form);

    Swal.fire({
        title: "Submitting...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        const resp = await fetch("https://script.google.com/macros/s/AKfycbzCrVWFhZ0MfV6rwbAbMXlBzbvGEiq64WKOQp0EVY_gQjNw5fKwIGe2S60TpxHN2mTIew/exec", {
            method: "POST",
            body: formData
        });

        // read raw text (safer) and then try JSON.parse
        const text = await resp.text();
        let result;
        try {
            result = JSON.parse(text);
        } catch (parseErr) {
            // Unexpected response (not JSON)
            Swal.fire({
                icon: "error",
                title: "Unexpected server response",
                html: `<pre style="text-align:left; white-space:pre-wrap;">${text.substring(0,1000)}</pre>`
            });
            return;
        }

        if (result && result.result === "success") {
            Swal.fire({
                icon: "success",
                title: "🎉 Registration Successful!",
                text: "Thank you — your registration was submitted!",
                confirmButtonColor: "#e25909"
            });
            form.reset();
            paymentSection.style.display = "none";
            receiptNo.style.display = "none";
            mpesaCode.style.display = "none";
        } else {
            // show whatever server returned (stringify safely)
            const msg = typeof result.message === "string" ? result.message : JSON.stringify(result.message, null, 2);
            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                html: `<pre style="text-align:left; white-space:pre-wrap;">${msg}</pre>`
            });
        }
    } catch (err) {
        // network-level errors: show detailed message
        Swal.fire({
            icon: "error",
            title: "Network Error",
            html: `<pre style="text-align:left; white-space:pre-wrap;">${err && err.message ? err.message : String(err)}</pre>`
        });
    }
});