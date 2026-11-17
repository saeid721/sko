document.addEventListener("DOMContentLoaded", () => {
    // Custom Tab Switching
    const tabs = document.querySelectorAll(".vq-tab");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // In a real app, this would switch between camera view and file upload view
            // For now, we just toggle visual active state
        });
    });

    // Simulate QR Scan / Upload
    const uploadBtn = document.querySelector(".btn-upload");
    const resultEmpty = document.getElementById("resultEmpty");
    const verificationResult = document.getElementById("verificationResult");
    const resultActions = document.getElementById("resultActions");
    const scannerBox = document.querySelector(".scanner-box");

    const simulateScan = () => {
        // Show loading state on button
        const originalText = uploadBtn.innerHTML;
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> যাচাই করা হচ্ছে...';

        // Show loading state on scanner box
        scannerBox.style.opacity = "0.5";

        // Simulate network delay
        setTimeout(() => {
            // Restore UI
            uploadBtn.disabled = false;
            uploadBtn.innerHTML = originalText;
            scannerBox.style.opacity = "1";

            // Hide empty state, show result
            resultEmpty.style.display = "none";
            verificationResult.style.display = "block";
            resultActions.style.display = "flex";

            // Add entrance animation
            verificationResult.style.animation = "none";
            verificationResult.offsetHeight; /* trigger reflow */
            verificationResult.style.animation = "fadeIn 0.5s ease forwards";

            // Scroll to result on mobile
            if (window.innerWidth < 992) {
                document.getElementById("resultCard").scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 1500);
    };

    if (uploadBtn) {
        uploadBtn.addEventListener("click", simulateScan);
    }

    // Optional: If user clicks the scanner box, simulate a scan too
    if (scannerBox) {
        scannerBox.addEventListener("click", simulateScan);
    }
});