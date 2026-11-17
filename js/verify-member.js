document.addEventListener("DOMContentLoaded", () => {
    // Custom Tab Switching
    const tabs = document.querySelectorAll(".vm-tab");
    const panes = document.querySelectorAll(".vm-tab-pane");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => p.classList.remove("active"));

            // Add active class to clicked tab and corresponding pane
            tab.classList.add("active");
            const target = tab.getAttribute("data-target");
            document.getElementById(target).classList.add("active");
        });
    });

    // Verification Simulation
    const btnVerifyId = document.getElementById("btnVerifyId");
    const resultEmpty = document.getElementById("resultEmpty");
    const verificationResult = document.getElementById("verificationResult");
    const resultActions = document.getElementById("resultActions");
    const memberIdInput = document.getElementById("memberIdInput");

    if (btnVerifyId) {
        btnVerifyId.addEventListener("click", () => {
            const inputVal = memberIdInput.value.trim();

            // Simple validation (in a real app, this hits an API)
            if (!inputVal) {
                memberIdInput.classList.add("is-invalid");
                return;
            }
            memberIdInput.classList.remove("is-invalid");

            // Show loading state
            const originalText = btnVerifyId.innerHTML;
            btnVerifyId.disabled = true;
            btnVerifyId.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> যাচাই করা হচ্ছে...';

            // Simulate API call delay
            setTimeout(() => {
                // Restore button
                btnVerifyId.disabled = false;
                btnVerifyId.innerHTML = originalText;

                // Hide empty state, show result
                resultEmpty.style.display = "none";
                verificationResult.style.display = "flex";
                resultActions.style.display = "flex";

                // Update the dynamic ID in the result if the user typed something
                if (inputVal) {
                    document.getElementById("resMemberId").textContent = inputVal.toUpperCase();
                }

                // Add a subtle entrance animation to the result
                verificationResult.style.animation = "none";
                verificationResult.offsetHeight; /* trigger reflow */
                verificationResult.style.animation = "fadeIn 0.5s ease forwards";

                // Scroll to result on mobile
                if (window.innerWidth < 992) {
                    document.getElementById("resultCard").scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

            }, 1200);
        });
    }
});