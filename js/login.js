/**
 * SKO Login Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Tab Switching Logic ---
    const tabs = document.querySelectorAll('.login-tab');
    const forms = document.querySelectorAll('.login-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and forms
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Show corresponding form
            const targetId = this.getAttribute('data-target');
            const targetForm = document.getElementById(targetId);
            if (targetForm) {
                targetForm.classList.add('active');
            }
        });
    });

    // --- Password Visibility Toggle ---
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });

});