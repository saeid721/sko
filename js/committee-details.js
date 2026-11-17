document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById("cdTable");
    if (!table) return;

    const toBn = (n) => Number(n).toLocaleString("bn-BD");
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    const search = document.getElementById("cdSearch");
    const chips = Array.from(document.querySelectorAll(".cd-chip"));
    const countEl = document.getElementById("cdCount");
    const totalEl = document.getElementById("cdTotal");
    const emptyEl = document.getElementById("cdEmpty");
    const resetBtn = document.getElementById("cdReset");
    const wrap = table.closest(".cd-table-wrap");

    let group = "all";

    /* ---------- Filter + search ---------- */

    const render = () => {
        const q = search.value.trim().toLowerCase();
        let shown = 0;

        rows.forEach((row) => {
            const okGroup = group === "all" || row.dataset.group === group;
            const okText = !q || row.textContent.toLowerCase().indexOf(q) !== -1;
            const visible = okGroup && okText;
            row.hidden = !visible;

            if (visible) {
                shown++;
                row.querySelector(".cd-no").textContent = toBn(shown).padStart(2, "০");
            }
        });

        countEl.textContent = toBn(shown);
        emptyEl.hidden = shown !== 0;
        wrap.hidden = shown === 0;
    };

    chips.forEach((chip) => {
        chip.addEventListener("click", () => {
            chips.forEach((c) => c.classList.toggle("is-active", c === chip));
            group = chip.dataset.filter;
            render();
        });
    });

    search.addEventListener("input", render);

    resetBtn.addEventListener("click", () => {
        search.value = "";
        group = "all";
        chips.forEach((c) => c.classList.toggle("is-active", c.dataset.filter === "all"));
        render();
        search.focus();
    });

    totalEl.textContent = toBn(rows.length);
    render();

    /* ---------- Print ---------- */

    const printBtn = document.getElementById("cdPrint");
    if (printBtn) printBtn.addEventListener("click", () => window.print());

    /* ---------- Share / copy link ---------- */

    const shareBtn = document.getElementById("cdShare");
    let toast = null;
    let toastTimer = null;

    const showToast = (msg) => {
        if (!toast) {
            toast = document.createElement("div");
            toast.className = "cd-toast";
            toast.setAttribute("role", "status");
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add("is-show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("is-show"), 2200);
    };

    const copyLink = () => {
        const url = location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(
                () => showToast("লিংক কপি হয়েছে"),
                () => showToast("লিংক কপি করা যায়নি")
            );
            return;
        }
        const tmp = document.createElement("textarea");
        tmp.value = url;
        tmp.style.position = "fixed";
        tmp.style.opacity = "0";
        document.body.appendChild(tmp);
        tmp.select();
        try {
            document.execCommand("copy");
            showToast("লিংক কপি হয়েছে");
        } catch (e) {
            showToast("লিংক কপি করা যায়নি");
        }
        document.body.removeChild(tmp);
    };

    if (shareBtn) {
        shareBtn.addEventListener("click", () => {
            if (navigator.share) {
                navigator.share({ title: document.title, url: location.href }).catch(() => {});
            } else {
                copyLink();
            }
        });
    }
});