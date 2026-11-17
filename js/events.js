document.addEventListener("DOMContentLoaded", () => {

    // Sidebar Category Active State Logic
    const categoryLinks = document.querySelectorAll('.category-list a');

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent jump for demo
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Simple Calendar Month Navigation (Visual Demo)
    const calPrev = document.querySelector('.cal-header button:first-child');
    const calNext = document.querySelector('.cal-header button:last-child');
    const calMonthText = document.querySelector('.cal-header span');

    const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
    let currentMonthIndex = 10; // November
    let currentYear = 2026;

    const updateCalendarText = () => {
        calMonthText.textContent = `${months[currentMonthIndex]}, ${currentYear}`;
    };

    if (calPrev && calNext) {
        calNext.addEventListener('click', () => {
            currentMonthIndex++;
            if (currentMonthIndex > 11) {
                currentMonthIndex = 0;
                currentYear++;
            }
            updateCalendarText();
            // In a real app, you would re-render the grid here
        });

        calPrev.addEventListener('click', () => {
            currentMonthIndex--;
            if (currentMonthIndex < 0) {
                currentMonthIndex = 11;
                currentYear--;
            }
            updateCalendarText();
            // In a real app, you would re-render the grid here
        });
    }
});