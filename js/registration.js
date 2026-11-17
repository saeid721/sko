document.addEventListener("DOMContentLoaded", () => {
    // Form Validation & Styling
    const form = document.getElementById("registrationForm");

    if (form) {
        // Add real-time validation feedback class
        const inputs = form.querySelectorAll("input[required], select[required]");

        inputs.forEach(input => {
            input.addEventListener("blur", () => {
                if (input.checkValidity()) {
                    input.classList.remove("is-invalid");
                    input.classList.add("is-valid");
                } else {
                    input.classList.remove("is-valid");
                    input.classList.add("is-invalid");
                }
            });

            input.addEventListener("input", () => {
                if (input.classList.contains("is-invalid") && input.checkValidity()) {
                    input.classList.remove("is-invalid");
                    input.classList.add("is-valid");
                }
            });
        });

        // Form Submit Handler
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!form.checkValidity()) {
                // Find first invalid element and scroll to it
                const firstInvalid = form.querySelector(":invalid");
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
                return;
            }

            // Simulate submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> প্রসেসিং হচ্ছে...';

            setTimeout(() => {
                // Show success toast
                const toast = document.createElement("div");
                toast.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #16a34a;
                    color: white;
                    padding: 16px 24px;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(22, 163, 74, 0.3);
                    z-index: 9999;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transform: translateX(120%);
                    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                `;
                toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> নিবন্ধন সফলভাবে সম্পন্ন হয়েছে!`;
                document.body.appendChild(toast);

                requestAnimationFrame(() => {
                    toast.style.transform = "translateX(0)";
                });

                setTimeout(() => {
                    toast.style.transform = "translateX(120%)";
                    setTimeout(() => toast.remove(), 400);
                }, 4000);

                // Reset form and button
                form.reset();
                inputs.forEach(i => i.classList.remove("is-valid", "is-invalid"));
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

            }, 1500);
        });
    }
});