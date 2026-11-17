/**
 * SKO - Membership Renewal Service
 * Multi-step form logic with validation
 */
(function() {
    "use strict";

    // DOM Ready
    document.addEventListener("DOMContentLoaded", function() {
        initRenewalForm();
        initShareButton();
        initPrintButton();
    });

    /* =========================================
       RENEWAL FORM - MULTI STEP
       ========================================= */
    function initRenewalForm() {
        const form = document.getElementById("renewalForm");
        if (!form) return;

        // Elements
        const step1 = document.getElementById("step1");
        const step2 = document.getElementById("step2");
        const step3 = document.getElementById("step3");
        const step4 = document.getElementById("step4");

        const verifyBtn = document.getElementById("verifyBtn");
        const verifyResult = document.getElementById("verifyResult");
        const backToStep1 = document.getElementById("backToStep1");
        const toStep3 = document.getElementById("toStep3");
        const backToStep2 = document.getElementById("backToStep2");
        const payBtn = document.getElementById("payBtn");
        const confirmCheck = document.getElementById("confirmCheck");

        const memberIdInput = document.getElementById("memberId");
        const mobileInput = document.getElementById("mobileNumber");
        const dobInput = document.getElementById("dob");

        const stepEls = document.querySelectorAll(".step-indicator .step");
        const stepLines = document.querySelectorAll(".step-indicator .step-line");

        // Step management
        let currentStep = 1;

        function goToStep(step) {
            // Hide all
            [step1, step2, step3, step4].forEach(function(el) {
                if (el) el.style.display = "none";
            });

            // Show target
            const target = document.getElementById("step" + step);
            if (target) target.style.display = "block";

            // Update indicator
            stepEls.forEach(function(el, idx) {
                const s = idx + 1;
                el.classList.remove("active", "completed");
                if (s < step) el.classList.add("completed");
                else if (s === step) el.classList.add("active");
            });

            // Update lines
            stepLines.forEach(function(line, idx) {
                line.classList.toggle("completed", idx + 1 < step);
            });

            currentStep = step;

            // Scroll to form top
            const formCard = form.closest(".mrs-form-card");
            if (formCard) {
                const yOffset = -90;
                const y = formCard.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: "smooth" });
            }
        }

        // ---- Step 1: Verify ----
        if (verifyBtn) {
            verifyBtn.addEventListener("click", function() {
                // Validate fields
                const memberId = memberIdInput.value.trim();
                const mobile = mobileInput.value.trim();
                const dob = dobInput.value;

                let isValid = true;

                // Clear previous errors
                [memberIdInput, mobileInput, dobInput].forEach(function(inp) {
                    inp.classList.remove("is-invalid");
                    const existingError = inp.parentElement.parentElement.querySelector(".field-error");
                    if (existingError) existingError.remove();
                });

                if (!memberId) {
                    showError(memberIdInput, "সদস্য আইডি দিন");
                    isValid = false;
                }
                if (!mobile || !/^01[3-9]\d{8}$/.test(mobile)) {
                    showError(mobileInput, "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন");
                    isValid = false;
                }
                if (!dob) {
                    showError(dobInput, "জন্ম তারিখ দিন");
                    isValid = false;
                }

                if (!isValid) return;

                // Show loading
                const originalHTML = verifyBtn.innerHTML;
                verifyBtn.disabled = true;
                verifyBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> যাচাই করা হচ্ছে...';

                // Simulate API call
                setTimeout(function() {
                    verifyBtn.disabled = false;
                    verifyBtn.innerHTML = originalHTML;

                    // Show result
                    if (verifyResult) {
                        verifyResult.style.display = "block";
                    }

                    // Auto go to step 2
                    setTimeout(function() {
                        goToStep(2);
                    }, 800);
                }, 1200);
            });
        }

        // ---- Step 2: Back to Step 1 ----
        if (backToStep1) {
            backToStep1.addEventListener("click", function() {
                goToStep(1);
            });
        }

        // ---- Step 2: Next to Step 3 ----
        if (toStep3) {
            toStep3.addEventListener("click", function() {
                if (confirmCheck && !confirmCheck.checked) {
                    confirmCheck.classList.add("is-invalid");
                    // Shake effect
                    confirmCheck.closest(".form-check").style.animation = "none";
                    setTimeout(function() {
                        confirmCheck.closest(".form-check").style.animation = "shake .3s ease";
                    }, 10);
                    return;
                }
                confirmCheck.classList.remove("is-invalid");
                goToStep(3);
            });
        }

        // Uncheck confirm removes error
        if (confirmCheck) {
            confirmCheck.addEventListener("change", function() {
                if (confirmCheck.checked) {
                    confirmCheck.classList.remove("is-invalid");
                }
            });
        }

        // ---- Step 3: Back to Step 2 ----
        if (backToStep2) {
            backToStep2.addEventListener("click", function() {
                goToStep(2);
            });
        }

        // ---- Step 3: Pay ----
        if (payBtn) {
            payBtn.addEventListener("click", function() {
                const originalHTML = payBtn.innerHTML;
                payBtn.disabled = true;
                payBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> প্রক্রিয়া চলছে...';

                setTimeout(function() {
                    payBtn.disabled = false;
                    payBtn.innerHTML = originalHTML;

                    // Generate renewal info
                    const renewId = "RNW-2026-" + String(Math.floor(Math.random() * 90000) + 10000);
                    const renewDate = new Date().toLocaleDateString("bn-BD", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });

                    const successItems = document.querySelectorAll("#step4 .success-item strong");
                    if (successItems.length >= 4) {
                        successItems[0].textContent = renewId;
                        successItems[1].textContent = renewDate;
                        successItems[2].textContent = "৩১ ডিসেম্বর, ২০২৬";
                        successItems[3].textContent = "৳ ৫০০";
                    }

                    goToStep(4);
                }, 2000);
            });
        }

        // ---- Input formatting for mobile ----
        if (mobileInput) {
            mobileInput.addEventListener("input", function() {
                this.value = this.value.replace(/[^0-9]/g, "").slice(0, 11);
            });
        }

        // ---- Input formatting for member ID ----
        if (memberIdInput) {
            memberIdInput.addEventListener("input", function() {
                // Uppercase and allow alphanumeric + dash
                this.value = this.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
            });
        }

        // ---- Error helper ----
        function showError(input, message) {
            input.classList.add("is-invalid");
            const wrap = input.parentElement.parentElement;
            const error = document.createElement("div");
            error.className = "field-error";
            error.style.cssText = "color:#e52631;font-size:12px;margin-top:5px;display:flex;align-items:center;gap:4px;";
            error.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ' + message;
            wrap.appendChild(error);
        }

        // ---- Initial state ----
        goToStep(1);
    }

    /* =========================================
       SHARE BUTTON
       ========================================= */
    function initShareButton() {
        const shareBtn = document.getElementById("shareBtn");
        if (!shareBtn) return;

        shareBtn.addEventListener("click", function() {
            const shareData = {
                title: "সদস্যপদ নবায়ন - SKO",
                text: "আপনার SKO সদস্যপদ নবায়ন করুন এবং সক্রিয় সদস্য হিসেবে সকল সুবিধা উপভোগ করুন",
                url: window.location.href,
            };

            if (navigator.share) {
                navigator.share(shareData).catch(function() {
                    /* cancelled */
                });
            } else {
                // Fallback: copy to clipboard
                const text = shareData.title + "\n" + shareData.url;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(function() {
                        showToast("লিংক কপি হয়েছে!");
                    });
                } else {
                    // Old fallback
                    const ta = document.createElement("textarea");
                    ta.value = text;
                    ta.style.position = "fixed";
                    ta.style.opacity = "0";
                    document.body.appendChild(ta);
                    ta.select();
                    try {
                        document.execCommand("copy");
                        showToast("লিংক কপি হয়েছে!");
                    } catch (e) {
                        /* ignore */
                    }
                    document.body.removeChild(ta);
                }
            }
        });
    }

    /* =========================================
       PRINT BUTTON (already wired in HTML via onclick, but add fallback)
       ========================================= */
    function initPrintButton() {
        // window.print() is already inline in HTML; nothing extra needed.
    }

    /* =========================================
       TOAST HELPER
       ========================================= */
    function showToast(message) {
        // Remove existing
        const old = document.querySelector(".mrs-toast");
        if (old) old.remove();

        const toast = document.createElement("div");
        toast.className = "mrs-toast";
        toast.textContent = message;
        toast.style.cssText = [
            "position:fixed",
            "bottom:90px",
            "left:50%",
            "transform:translateX(-50%) translateY(20px)",
            "background:linear-gradient(135deg,#07852e,#07572b)",
            "color:#fff",
            "padding:12px 24px",
            "border-radius:30px",
            "font-size:14px",
            "font-weight:700",
            "box-shadow:0 8px 24px rgba(7,133,46,.35)",
            "z-index:9999",
            "opacity:0",
            "transition:all .3s ease",
            "pointer-events:none",
            "max-width:90vw",
            "text-align:center",
        ].join(";");
        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(function() {
            toast.style.opacity = "1";
            toast.style.transform = "translateX(-50%) translateY(0)";
        });

        // Remove
        setTimeout(function() {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(-50%) translateY(20px)";
            setTimeout(function() {
                toast.remove();
            }, 350);
        }, 2200);
    }

    /* =========================================
       SHAKE ANIMATION (inject once)
       ========================================= */
    (function injectShake() {
        if (document.getElementById("mrs-shake-style")) return;
        const style = document.createElement("style");
        style.id = "mrs-shake-style";
        style.textContent = [
            "@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}",
            ".form-control.is-invalid{border-color:#e52631 !important;box-shadow:0 0 0 3px rgba(229,38,49,.12) !important}",
            ".form-check-input.is-invalid{border-color:#e52631 !important;box-shadow:0 0 0 3px rgba(229,38,49,.12) !important}",
        ].join("");
        document.head.appendChild(style);
    })();
})();