document.addEventListener("DOMContentLoaded", () => {

    const btnVerify = document.getElementById('btnVerify');
    const btnReset = document.getElementById('btnReset');
    const certNumberInput = document.getElementById('certNumber');
    const certNameInput = document.getElementById('certName');

    const resultSection = document.getElementById('resultSection');
    const resCertNumber = document.getElementById('resCertNumber');
    const resCertName = document.getElementById('resCertName');

    // Verification Logic
    if (btnVerify) {
        btnVerify.addEventListener('click', (e) => {
            e.preventDefault();

            const certNum = certNumberInput.value.trim();
            const certName = certNameInput.value.trim();

            if (!certNum || !certName) {
                // Simple validation feedback
                if (!certNum) certNumberInput.classList.add('is-invalid');
                if (!certName) certNameInput.classList.add('is-invalid');
                return;
            }

            // Remove validation classes
            certNumberInput.classList.remove('is-invalid');
            certNameInput.classList.remove('is-invalid');

            // Show loading state
            const originalText = btnVerify.innerHTML;
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> যাচাই করা হচ্ছে...';

            // Simulate network delay
            setTimeout(() => {
                // Restore button
                btnVerify.disabled = false;
                btnVerify.innerHTML = originalText;

                // Update result section with user input
                resCertNumber.textContent = `: ${certNum.toUpperCase()}`;
                resCertName.textContent = `: ${certName}`;

                // Show result section with animation
                resultSection.style.display = 'block';
                resultSection.classList.remove('animate__animated', 'animate__fadeInUp');
                // Trigger reflow to restart animation if using animate.css, otherwise simple fade
                resultSection.style.opacity = '0';
                resultSection.style.transform = 'translateY(20px)';
                resultSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

                setTimeout(() => {
                    resultSection.style.opacity = '1';
                    resultSection.style.transform = 'translateY(0)';
                }, 50);

                // Scroll to result on mobile
                if (window.innerWidth < 992) {
                    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

            }, 1200);
        });
    }

    // Reset Logic
    if (btnReset) {
        btnReset.addEventListener('click', (e) => {
            e.preventDefault();
            certNumberInput.value = '';
            certNameInput.value = '';
            certNumberInput.classList.remove('is-invalid');
            certNameInput.classList.remove('is-invalid');

            // Hide result section
            resultSection.style.display = 'none';
        });
    }

    // Real-time input validation removal
    [certNumberInput, certNameInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                input.classList.remove('is-invalid');
            });
        }
    });

});