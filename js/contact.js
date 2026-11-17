document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");

    if (form) {
        // Custom validation for better UX
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Check if form is valid using HTML5 constraints
            if (!form.checkValidity()) {
                // Find the first invalid element and focus it
                const invalidElement = form.querySelector(":invalid");
                if (invalidElement) {
                    invalidElement.focus();
                }
                return;
            }

            // Simulate form submission (replace with actual fetch/API call)
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> পাঠানো হচ্ছে...';

            // Simulate network delay
            setTimeout(() => {
                // Show success message
                const isEn = document.documentElement.lang === 'en';
                const successMsg = isEn ?
                    "Thank you! Your message has been sent successfully." :
                    "ধন্যবাদ! আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে।";

                // Create a toast or alert for premium feel
                const toast = document.createElement("div");
                toast.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #10b981;
                    color: white;
                    padding: 16px 24px;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
                    z-index: 9999;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transform: translateX(120%);
                    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                `;
                toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${successMsg}`;
                document.body.appendChild(toast);

                // Animate in
                requestAnimationFrame(() => {
                    toast.style.transform = "translateX(0)";
                });

                // Remove after 4 seconds
                setTimeout(() => {
                    toast.style.transform = "translateX(120%)";
                    setTimeout(() => toast.remove(), 400);
                }, 4000);

                // Reset form
                form.reset();

                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

            }, 1200);
        });
    }
});