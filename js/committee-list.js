document.addEventListener("DOMContentLoaded", () => {
    const tabBar = document.getElementById("cmTabs");
    if (!tabBar) return;

    const tabs = Array.from(tabBar.querySelectorAll(".cm-tab"));
    const panels = Array.from(document.querySelectorAll(".cm-tabpanel"));
    const toBn = (n) => Number(n).toLocaleString("bn-BD");

    /* ---------- Tabs ---------- */

    const activate = (name, opts = {}) => {
        const target = tabs.find((t) => t.dataset.tab === name) || tabs[0];

        tabs.forEach((t) => {
            const on = t === target;
            t.setAttribute("aria-selected", String(on));
            t.tabIndex = on ? 0 : -1;
        });

        panels.forEach((p) => {
            const on = p.id === target.getAttribute("aria-controls");
            p.hidden = !on;
            if (on) {
                p.classList.remove("is-entering");
                void p.offsetWidth; // restart animation
                p.classList.add("is-entering");
            }
        });

        // mobile: active tab বারের মাঝখানে আনো
        if (tabBar.scrollWidth > tabBar.clientWidth) {
            tabBar.scrollTo({
                left: target.offsetLeft - (tabBar.clientWidth - target.offsetWidth) / 2,
                behavior: "smooth"
            });
        }

        if (opts.focus) target.focus();
        if (opts.updateUrl) history.replaceState(null, "", "#" + target.dataset.tab);
    };

    tabs.forEach((tab, i) => {
        tab.addEventListener("click", () => activate(tab.dataset.tab, { updateUrl: true }));

        tab.addEventListener("keydown", (e) => {
            const last = tabs.length - 1;
            let next = null;
            if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
            if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
            if (e.key === "Home") next = 0;
            if (e.key === "End") next = last;
            if (next === null) return;
            e.preventDefault();
            activate(tabs[next].dataset.tab, { focus: true, updateUrl: true });
        });
    });

    // URL: leadership.html#members | ?tab=advisory | ?type=central
    const typeMap = { central: "executive" };
    const params = new URLSearchParams(location.search);
    const fromUrl = location.hash.slice(1) || params.get("tab") || typeMap[params.get("type")] || "executive";
    activate(fromUrl);

    window.addEventListener("hashchange", () => activate(location.hash.slice(1)));

    /* ---------- Member list (search) ---------- */

    const list = document.getElementById("cmMemberList");
    const search = document.getElementById("cmSearch");
    const countEl = document.getElementById("cmResultCount");
    const emptyEl = document.getElementById("cmEmpty");
    const emptyReset = document.getElementById("cmEmptyReset");
    if (!list || !search) return;

    const people = [];
    const text = (root, sel) => {
        const el = root.querySelector(sel);
        return el ? el.textContent.trim() : "";
    };

    document.querySelectorAll(".cm-top-card").forEach((c) => {
        people.push({ name: text(c, ".cm-top-name"), role: text(c, ".cm-top-badge"), group: "শীর্ষ নেতৃত্ব" });
    });
    document.querySelectorAll(".cm-member").forEach((c) => {
        people.push({ name: text(c, ".cm-member-name"), role: text(c, ".cm-member-role"), group: c.dataset.group || "" });
    });

    const makeRow = (p, i) => {
        const li = document.createElement("li");
        li.className = "cm-row";

        const no = document.createElement("span");
        no.className = "cm-row-no";
        no.textContent = toBn(i + 1);

        const main = document.createElement("div");
        main.className = "cm-row-main";
        const name = document.createElement("strong");
        name.textContent = p.name;
        const role = document.createElement("small");
        role.textContent = p.role;
        main.append(name, role);

        const group = document.createElement("span");
        group.className = "cm-row-group";
        group.textContent = p.group;

        li.append(no, main, group);
        return li;
    };

    const render = () => {
        const q = search.value.trim().toLowerCase();
        const rows = people.filter((p) => !q || `${p.name} ${p.role} ${p.group}`.toLowerCase().includes(q));
        list.replaceChildren(...rows.map(makeRow));
        countEl.textContent = toBn(rows.length);
        emptyEl.hidden = rows.length !== 0;
    };

    search.addEventListener("input", render);
    if (emptyReset) {
        emptyReset.addEventListener("click", () => {
            search.value = "";
            render();
            search.focus();
        });
    }

    render();
});