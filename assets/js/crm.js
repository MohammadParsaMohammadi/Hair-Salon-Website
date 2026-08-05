/* ==========================================================================
   MOCK APP STATE AND DATABASES (Initial Data for Parts 1 & 2)
   ========================================================================== */
const USERS_DB = [
    { id: 1, name: "علی حسینی", phone: "0912 111 2222", history: [
        { service: "اصلاح مو", date: "2026-06-12", price: 20, trackId: "LUM-9021", status: "تکمیل شده" },
        { service: "اصلاح ریش", date: "2026-07-02", price: 15, trackId: "LUM-4452", status: "تکمیل شده" }
    ]},
    { id: 2, name: "مریم راد", phone: "0935 222 3333", history: [
        { service: "رنگ مو", date: "2026-06-20", price: 45, trackId: "LUM-1102", status: "تکمیل شده" }
    ]},
    { id: 3, name: "رضا علوی", phone: "0915 333 4444", history: [
        { service: "کراتین و احیای مو", date: "2026-05-14", price: 55, trackId: "LUM-7890", status: "تکمیل شده" }
    ]},
    { id: 4, name: "زهرا موسوی", phone: "0930 444 5555", history: [] },
    { id: 5, name: "امیر کریمی", phone: "0912 555 6666", history: [
        { service: "اصلاح مو", date: "2026-07-10", price: 20, trackId: "LUM-5050", status: "تکمیل شده" }
    ]}
];

const RESERVATIONS_DB = [
    { id: 101, name: "علی حسینی", phone: "0912 111 2222", service: "اصلاح مو", date: "2026-07-15", price: 20, trackId: "LUM-52110", desc: "اصلاح معمولی با مدل فید." },
    { id: 102, name: "مریم راد", phone: "0935 222 3333", service: "رنگ مو", date: "2026-07-18", price: 45, trackId: "LUM-18290", desc: "رنگ موی بلوند خاکستری." },
    { id: 103, name: "رضا علوی", phone: "0915 333 4444", service: "حالت‌دهی مو", date: "2026-07-22", price: 30, trackId: "LUM-66231", desc: "آماده‌سازی مو برای مراسم عروسی." }
];

const REQUESTS_DB = [
    { id: 201, name: "سینا عباسی", phone: "0911 777 8888", date: "2026-07-16 14:00", price: 20, trackId: "REQ-0023", desc: "اصلاح معمولی همراه با شستشو." },
    { id: 202, name: "الناز قاسمی", phone: "0939 888 9999", date: "2026-07-17 11:30", price: 45, trackId: "REQ-0104", desc: "هایلایت کامل مو." }
];

// Document State Controller
let currentActiveSectionId = 'sec-dashboard';

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Navigation SPA Router
    initSPARouter();
    
    // Initialize Drawers
    initMobileDrawer();
    
    // Initialize Part 1 Tables
    renderUsersTable();
    renderReservationsTable();
    renderRequestsTable();

    // Bind Instant Search elements
    initSearchEngines();
});

/* ==============================================
   1. Dynamic SPA Router
   ============================================== */
function initSPARouter() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            triggerPageSwitch(target);
        });
    });
}

function triggerPageSwitch(targetSectionId) {
    const targetSection = document.getElementById(targetSectionId);
    if (!targetSection) return;

    // Remove active markers
    document.querySelectorAll('.crm-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

    // Inject dynamic skeleton loader rows on tables before loading actual content
    const tables = targetSection.querySelectorAll('.crm-table');
    tables.forEach(tbl => showSkeletonLoader(tbl));

    setTimeout(() => {
        // Activate target section
        targetSection.classList.add('active');
        
        // Match Sidebar Nav button styling
        const navBtn = document.querySelector(`[data-target="${targetSectionId}"]`);
        if (navBtn) navBtn.classList.add('active');
        
        // Hide overlay/drawers if in mobile view
        closeMobileDrawer();
        
        // Refresh specific tables to overlay data correctly
        if (targetSectionId === 'sec-users') renderUsersTable();
        if (targetSectionId === 'sec-reservations') renderReservationsTable();
        if (targetSectionId === 'sec-requests') renderRequestsTable();
        
    }, 300); // 300ms Skeleton transition buffer
}

/* ==============================================
   2. Drawer Interface Layout Configuration
   ============================================== */
function initMobileDrawer() {
    const toggleBtn = document.getElementById('crm-sidebar-toggle');
    const sidebar = document.getElementById('crm-sidebar');
    const overlay = document.getElementById('crm-overlay');

    if (toggleBtn && sidebar && overlay) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.add('drawer-open');
            overlay.classList.add('active');
        });

        overlay.addEventListener('click', closeMobileDrawer);
    }
}

function closeMobileDrawer() {
    const sidebar = document.getElementById('crm-sidebar');
    const overlay = document.getElementById('crm-overlay');
    if (sidebar && overlay) {
        sidebar.classList.remove('drawer-open');
        overlay.classList.remove('active');
    }
}

/* ==============================================
   3. Dynamic Skeleton Handlers
   ============================================= */
function showSkeletonLoader(tableElement) {
    const tbody = tableElement.querySelector('tbody');
    const columnCount = tableElement.querySelectorAll('thead th').length;
    if (!tbody) return;

    tbody.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const row = document.createElement('tr');
        row.className = 'skeleton-row';
        for (let c = 0; c < columnCount; c++) {
            const cell = document.createElement('td');
            cell.innerHTML = '<div class="skeleton-text"></div>';
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
}

/* ==============================================
   4. Section 2: All Users Table rendering
   ============================================== */
function renderUsersTable(filterText = '') {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const filtered = USERS_DB.filter(user => 
        user.name.toLowerCase().includes(filterText.toLowerCase()) || 
        user.phone.includes(filterText)
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 40px; color:var(--text-muted);">هیچ کاربری یافت نشد.</td></tr>`;
        return;
    }

    filtered.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${user.name}</strong></td>
            <td>${user.phone}</td>
            <td>
                <button class="btn-view-history" onclick="openUserHistoryModal(${user.id})">مشاهده سوابق</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openUserHistoryModal(userId) {
    const user = USERS_DB.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('history-modal-user-name').textContent = `${user.name} — سوابق نوبت‌ها`;
    const tbody = document.getElementById('modal-history-tbody');
    tbody.innerHTML = '';

    if (user.history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 24px; color:var(--text-muted);">هیچ سابقه‌ای ثبت نشده است.</td></tr>`;
    } else {
        user.history.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.service}</strong></td>
                <td>${item.date}</td>
                <td dir="ltr">$${item.price}</td>
                <td><code>${item.trackId}</code></td>
                <td><span class="badge ${item.status}">${item.status}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    openModal('user-history-modal');
}

/* ==============================================
   5. Section 3: Reservations rendering
   ============================================== */
function renderReservationsTable(filterText = '') {
    const tbody = document.getElementById('reservations-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const filtered = RESERVATIONS_DB.filter(res => 
        res.name.toLowerCase().includes(filterText.toLowerCase()) || 
        res.phone.includes(filterText) ||
        res.trackId.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 40px; color:var(--text-muted);">رزروی مطابق جستجو پیدا نشد.</td></tr>`;
        return;
    }

    filtered.forEach(res => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${res.name}</strong></td>
            <td>${res.phone}</td>
            <td>${res.service}</td>
            <td>${res.date}</td>
            <td dir="ltr">$${res.price}</td>
            <td>
                <div class="copy-id-cell">
                    <code>${res.trackId}</code>
                    <button class="copy-icon-btn" onclick="copyToClipboard('${res.trackId}', this)">📋</button>
                </div>
            </td>
            <td>
                <div class="table-description-cell" data-tooltip="${res.desc}">${res.desc}</div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/* ==============================================
   6. Section 4: Reservation Requests Workflow
   ============================================== */
let activeRequestRejectId = null;

function renderRequestsTable() {
    const tbody = document.getElementById('requests-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (REQUESTS_DB.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 40px; color:var(--text-muted);">هیچ درخواست رزروی در انتظار تایید نیست.</td></tr>`;
        return;
    }

    REQUESTS_DB.forEach(req => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${req.name}</strong></td>
            <td>${req.phone}</td>
            <td>${req.date}</td>
            <td dir="ltr">$${req.price}</td>
            <td><div class="table-description-cell" data-tooltip="${req.desc}">${req.desc}</div></td>
            <td><code>${req.trackId}</code></td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-success" onclick="confirmReservationRequest(${req.id})">تایید ✔</button>
                    <button class="btn btn-danger" onclick="openRejectReasonModal(${req.id})">رد ✖</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function confirmReservationRequest(requestId) {
    const idx = REQUESTS_DB.findIndex(r => r.id === requestId);
    if (idx !== -1) {
        const item = REQUESTS_DB[idx];
        
        // Push accepted element directly into Main Reservations Database
        RESERVATIONS_DB.push({
            id: Date.now(),
            name: item.name,
            phone: item.phone,
            service: "سایر خدمات",
            date: item.date.split(' ')[0],
            price: item.price,
            trackId: item.trackId,
            desc: item.desc
        });

        REQUESTS_DB.splice(idx, 1);
        renderRequestsTable();
        showToast('success', 'رزرو با موفقیت تایید شد.');
    }
}

function openRejectReasonModal(requestId) {
    activeRequestRejectId = requestId;
    document.getElementById('reject-reason-text').value = '';
    openModal('reject-reason-modal');
}

// Bind confirmation submit action inside modal
document.getElementById('confirm-reject-btn')?.addEventListener('click', () => {
    const reason = document.getElementById('reject-reason-text').value.trim();
    if (reason === '') {
        showToast('warning', 'لطفاً دلیل رد درخواست را وارد کنید.');
        return;
    }

    const idx = REQUESTS_DB.findIndex(r => r.id === activeRequestRejectId);
    if (idx !== -1) {
        REQUESTS_DB.splice(idx, 1);
        closeModal('reject-reason-modal');
        renderRequestsTable();
        showToast('success', 'درخواست با موفقیت رد شد.');
    }
});

/* ==============================================
   7. Instant Search Engines & Global Search
   ============================================== */
function initSearchEngines() {
    // Local section searches
    document.getElementById('user-search-input')?.addEventListener('input', (e) => {
        renderUsersTable(e.target.value);
    });

    document.getElementById('reservation-search-input')?.addEventListener('input', (e) => {
        renderReservationsTable(e.target.value);
    });

    // Global Instant Header Search system
    document.getElementById('global-instant-search')?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.trim() === '') return;

        // Auto routing helper based on query matching
        if (query.includes('ali') || query.includes('maryam') || query.includes('reza')) {
            triggerPageSwitch('sec-users');
            document.getElementById('user-search-input').value = query;
            renderUsersTable(query);
        }
    });
}

/* ==============================================
   8. Shared Utility Helper functions
   ============================================== */
function openModal(modalId) {
    document.getElementById(modalId)?.classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('active');
}

// Copy Action Controller
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        const originalIcon = element.innerHTML;
        element.innerHTML = '✅';
        showToast('info', 'کد رهگیری کپی شد.');
        setTimeout(() => element.innerHTML = originalIcon, 1500);
    });
}

// Custom Top-Right Dynamic Toast Notification Engine
function showToast(type, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);
    
    // Trigger transition entry
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto-Destruct in 3 Seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Dynamic Client Sort Engine
function sortTable(tableId, colIndex) {
    const table = document.getElementById(tableId);
    let rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    dir = "asc";
    
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[colIndex];
            y = rows[i + 1].getElementsByTagName("TD")[colIndex];
            
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


/* ==========================================================================
   PART 2: MOCK DBs & GLOBAL STATE
   ========================================================================== */
const PORTFOLIO_DB = [
    { id: 1, title: "میکاپ عروس", tags: "عروس، مدرن", category: "میکاپ", img: "./assets/media/image08.webp" },
    { id: 2, title: "هایلایت بلوند خاکستری", tags: "بلوند، رنگ", category: "رنگ مو", img: "./assets/media/image03.jpg" }
];

const SERVICES_DB = [
    { id: 1, title: "اصلاح مو", price: 20 },
    { id: 2, title: "رنگ مو", price: 45 },
    { id: 3, title: "استایل و میکاپ عروس", price: 150 }
];

const COMMENTS_DB = [
    { id: 1, name: "زهرا احمدی", phone: "0912 999 0000", comment: "کیفیت خدمات عالی و محیط سالن بسیار تمیز بود.", status: "pending" },
    { id: 2, name: "مریم راد", phone: "0935 222 3333", comment: "عاشق رنگ موی جدیدم شدم، شدیداً پیشنهاد می‌کنم!", status: "approved" },
    { id: 3, name: "سارا تهرانی", phone: "0911 333 1111", comment: "دیدگاه اسپم حاوی لینک تبلیغاتی...", status: "rejected" }
];

const SLOTS_DB = [
    { id: 1, date: "2026-07-20", time: "10:00", status: "available" },
    { id: 2, date: "2026-07-20", time: "11:30", status: "booked" },
    { id: 3, date: "2026-07-20", time: "14:00", status: "disabled" }
];

// Active Delete State
let itemToDelete = { id: null, type: null };
// Active Edit State
let activeEditId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Hooks for tab switching defined in Part 1 - expanding logic:
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const target = item.getAttribute('data-target');
            if (target === 'sec-statistics') renderStatsTable();
            if (target === 'sec-portfolio') renderPortfolioTable();
            if (target === 'sec-services') renderServicesTable();
            if (target === 'sec-comments') renderCommentsTable();
            if (target === 'sec-slots') renderSlotsTable();
        });
    });

    initFileUpload();
    initFormSubmits();
    initDeleteWorkflow();
});

/* ==============================================
   9. Statistics Rendering & Export
   ============================================== */
function renderStatsTable() {
    const tbody = document.getElementById('stats-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    // Using RESERVATIONS_DB as the base for stats history
    RESERVATIONS_DB.forEach(res => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${res.name}</strong></td>
            <td>${res.phone}</td>
            <td>${res.service}</td>
            <td>${res.date}</td>
            <td dir="ltr">$${res.price}</td>
            <td><code>${res.trackId}</code></td>
            <td><div class="table-description-cell" data-tooltip="${res.desc}">${res.desc}</div></td>
        `;
        tbody.appendChild(tr);
    });
}

function exportToExcel() {
    showToast('info', 'در حال آماده‌سازی فایل اکسل...');
    setTimeout(() => {
        showToast('success', 'فایل اکسل با موفقیت دانلود شد.');
    }, 1500);
}

/* ==============================================
   10. Portfolio Management
   ============================================== */
function renderPortfolioTable() {
    const tbody = document.getElementById('portfolio-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    PORTFOLIO_DB.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.img}" class="td-image" alt="${item.title}"></td>
            <td><strong>${item.title}</strong></td>
            <td><span class="badge" style="background:#E2E8F0; color:#4A5568;">${item.category}</span> <small>${item.tags}</small></td>
            <td>
                <div class="table-actions" style="gap: 8px;">
                    <button class="btn btn-icon-only edit" onclick="editPortfolio(${item.id})">✎</button>
                    <button class="btn btn-icon-only delete" onclick="triggerDelete(${item.id}, 'portfolio')">🗑</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openPortfolioFormModal() {
    activeEditId = null;
    document.getElementById('portfolio-modal-title').textContent = "افزودن نمونه‌کار جدید";
    document.getElementById('portfolio-form').reset();
    document.getElementById('portfolio-image-preview').style.display = 'none';
    openModal('portfolio-form-modal');
}

function editPortfolio(id) {
    const item = PORTFOLIO_DB.find(p => p.id === id);
    if (!item) return;
    activeEditId = id;
    
    document.getElementById('portfolio-modal-title').textContent = "ویرایش نمونه‌کار";
    document.getElementById('portfolio-title').value = item.title;
    document.getElementById('portfolio-category').value = item.category;
    document.getElementById('portfolio-tags').value = item.tags;
    
    const preview = document.getElementById('portfolio-image-preview');
    preview.src = item.img;
    preview.style.display = 'block';
    
    openModal('portfolio-form-modal');
}

// Drag and drop implementation
function initFileUpload() {
    const dropArea = document.getElementById('portfolio-upload-area');
    const fileInput = document.getElementById('portfolio-file');
    const preview = document.getElementById('portfolio-image-preview');

    if (!dropArea) return;

    dropArea.addEventListener('click', () => fileInput.click());
    
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });
    
    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('dragover'));
    
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', function() {
        if (this.files.length) handleFile(this.files[0]);
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast('error', 'لطفاً یک فایل تصویر معتبر انتخاب کنید.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

/* ==============================================
   11. Services Management
   ============================================== */
function renderServicesTable() {
    const tbody = document.getElementById('services-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    SERVICES_DB.forEach(service => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${service.title}</strong></td>
            <td dir="ltr">$${service.price}</td>
            <td>
                <div class="table-actions" style="gap: 8px;">
                    <button class="btn btn-icon-only edit" onclick="editService(${service.id})">✎</button>
                    <button class="btn btn-icon-only delete" onclick="triggerDelete(${service.id}, 'service')">🗑</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openServiceFormModal() {
    activeEditId = null;
    document.getElementById('service-modal-title').textContent = "افزودن خدمت";
    document.getElementById('service-form').reset();
    openModal('service-form-modal');
}

function editService(id) {
    const item = SERVICES_DB.find(s => s.id === id);
    if (!item) return;
    activeEditId = id;
    
    document.getElementById('service-modal-title').textContent = "ویرایش خدمت";
    document.getElementById('service-title').value = item.title;
    document.getElementById('service-price').value = item.price;
    openModal('service-form-modal');
}

/* ==============================================
   12. Comments Management
   ============================================== */
function renderCommentsTable() {
    const tbody = document.getElementById('comments-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    COMMENTS_DB.forEach(c => {
        let actionButtons = '';
        if (c.status === 'pending') {
            actionButtons = `
                <button class="btn btn-success" style="height:32px; padding:0 12px; font-size:12px;" onclick="updateCommentStatus(${c.id}, 'approved')">تایید</button>
                <button class="btn btn-danger" style="height:32px; padding:0 12px; font-size:12px;" onclick="updateCommentStatus(${c.id}, 'rejected')">رد</button>
            `;
        } else {
            actionButtons = `<span style="color:var(--text-muted); font-size:13px;">بررسی شده</span>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${c.name}</strong></td>
            <td>${c.phone}</td>
            <td style="white-space: normal; line-height: 1.5; font-size:13px;">${c.comment}</td>
            <td><span class="badge ${c.status}">${c.status === 'approved' ? 'تایید شده' : c.status === 'pending' ? 'در انتظار' : 'رد شده'}</span></td>
            <td>
                <div class="table-actions">${actionButtons}</div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateCommentStatus(id, newStatus) {
    const item = COMMENTS_DB.find(c => c.id === id);
    if (item) {
        item.status = newStatus;
        renderCommentsTable();
        showToast(newStatus === 'approved' ? 'success' : 'warning', `نظر با موفقیت ${newStatus === 'approved' ? 'تایید' : 'رد'} شد.`);
    }
}

/* ==============================================
   13. Time Slots Management
   ============================================== */
function renderSlotsTable() {
    const tbody = document.getElementById('slots-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    SLOTS_DB.forEach(slot => {
        let statusBadgeClass = 'badge';
        if(slot.status === 'available') statusBadgeClass += ' تایید شده'; // Green
        else if(slot.status === 'booked') statusBadgeClass += ' تکمیل شده'; // Blue
        else statusBadgeClass += ' رد شده'; // Red/Gray for disabled

        const statusText = slot.status === 'available' ? 'آزاد' : slot.status === 'booked' ? 'رزرو شده' : 'غیرفعال';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${slot.date}</strong></td>
            <td>${slot.time}</td>
            <td><span class="${statusBadgeClass}">${statusText}</span></td>
            <td>
                <div class="table-actions" style="gap: 8px;">
                    <button class="btn btn-icon-only edit" onclick="editSlot(${slot.id})" ${slot.status === 'booked' ? 'disabled' : ''}>✎</button>
                    <button class="btn btn-icon-only delete" onclick="triggerDelete(${slot.id}, 'slot')" ${slot.status === 'booked' ? 'disabled' : ''}>🗑</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openSlotFormModal() {
    activeEditId = null;
    document.getElementById('slot-modal-title').textContent = "افزودن زمان کاری";
    document.getElementById('slot-form').reset();
    openModal('slot-form-modal');
}

function editSlot(id) {
    const item = SLOTS_DB.find(s => s.id === id);
    if (!item) return;
    activeEditId = id;
    
    document.getElementById('slot-modal-title').textContent = "ویرایش زمان کاری";
    document.getElementById('slot-date').value = item.date;
    document.getElementById('slot-time').value = item.time;
    openModal('slot-form-modal');
}

/* ==============================================
   14. Global Form Handlers & Delete Workflows
   ============================================== */
function initFormSubmits() {
    // Portfolio Submit
    document.getElementById('portfolio-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = activeEditId ? "نمونه‌کار با موفقیت ویرایش شد." : "نمونه‌کار جدید با موفقیت اضافه شد.";
        
        closeModal('portfolio-form-modal');
        showToast('success', msg);
    });

    // Service Submit
    document.getElementById('service-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('service-title').value;
        const price = document.getElementById('service-price').value;

        if (activeEditId) {
            const item = SERVICES_DB.find(s => s.id === activeEditId);
            if (item) { item.title = title; item.price = price; }
        } else {
            SERVICES_DB.push({ id: Date.now(), title, price });
        }
        
        renderServicesTable();
        closeModal('service-form-modal');
        showToast('success', activeEditId ? "خدمت با موفقیت ویرایش شد." : "خدمت جدید با موفقیت اضافه شد.");
    });

    // Slot Submit
    document.getElementById('slot-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('slot-date').value;
        const time = document.getElementById('slot-time').value;

        if (activeEditId) {
            const item = SLOTS_DB.find(s => s.id === activeEditId);
            if (item) { item.date = date; item.time = time; }
        } else {
            SLOTS_DB.push({ id: Date.now(), date, time, status: 'available' });
        }
        
        renderSlotsTable();
        closeModal('slot-form-modal');
        showToast('success', activeEditId ? "زمان کاری با موفقیت ویرایش شد." : "زمان کاری جدید ایجاد شد.");
    });
}

function triggerDelete(id, type) {
    itemToDelete = { id, type };
    openModal('delete-confirm-modal');
}

function initDeleteWorkflow() {
    document.getElementById('confirm-delete-btn')?.addEventListener('click', () => {
        const { id, type } = itemToDelete;
        
        if (type === 'portfolio') {
            const idx = PORTFOLIO_DB.findIndex(i => i.id === id);
            if (idx > -1) PORTFOLIO_DB.splice(idx, 1);
            renderPortfolioTable();
        } 
        else if (type === 'service') {
            const idx = SERVICES_DB.findIndex(i => i.id === id);
            if (idx > -1) SERVICES_DB.splice(idx, 1);
            renderServicesTable();
        }
        else if (type === 'slot') {
            const idx = SLOTS_DB.findIndex(i => i.id === id);
            if (idx > -1) SLOTS_DB.splice(idx, 1);
            renderSlotsTable();
        }

        closeModal('delete-confirm-modal');
        showToast('success', 'رکورد با موفقیت حذف شد.');
        itemToDelete = { id: null, type: null };
    });
}
