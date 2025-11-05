const form = document.getElementById("registrationForm");

// Submit to Google Script
form.addEventListener("submit", async(e) => {
    e.preventDefault();

    const formData = new FormData(form);

    Swal.fire({
        title: "Submitting...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        const resp = await fetch(
            "https://script.google.com/macros/s/AKfycbz1G2kE5p2v2Ca9_5bU-fdwq4qWdHgWL02AogmTvOKj3T_IPl9PdP4DO7-kpELt9qMCDg/exec", {
                method: "POST",
                body: formData
            }
        );

        const text = await resp.text();
        let result;

        try {
            result = JSON.parse(text);
        } catch (parseErr) {
            Swal.fire({
                icon: "error",
                title: "Unexpected server response",
                html: `<pre style="text-align:left; white-space:pre-wrap;">${text.substring(0, 1000)}</pre>`
            });
            return;
        }

        if (result && result.result === "success") {
            Swal.fire({
                icon: "success",
                title: "🎉 Registration Successful!",
                text: "Thank you — your registration was submitted!",
                confirmButtonColor: "#E2A809FF"
            });
            form.reset();
        } else {
            const msg =
                typeof result.message === "string" ?
                result.message :
                JSON.stringify(result.message, null, 2);
            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                html: `<pre style="text-align:left; white-space:pre-wrap;">${msg}</pre>`
            });
        }
    } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Network Error",
            html: `<pre style="text-align:left; white-space:pre-wrap;">${err?.message ?? String(err)}</pre>`
        });
    }
});