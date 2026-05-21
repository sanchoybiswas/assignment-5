// ==================== ১. উপাদানসমূহ সিলেক্ট করা ====================
const copyCountEl = document.getElementById('copy-count');
const coinCountEl = document.getElementById('coin-count');
const allCopyButtons = document.querySelectorAll('.copy-btn');
const allCallButtons = document.querySelectorAll('.call-btn');
const callHistoryContainer = document.getElementById('call-history-container');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// নোটিফিকেশন টোস্ট সমূহ
const callToast = document.getElementById('call-toast');
const copyToast = document.getElementById('copy-toast');
const toastMsg = document.getElementById('toast-msg');

// কাউন্টার ভ্যারিয়েবল ইনিশিয়াল করা
let currentCopyCount = copyCountEl ? parseInt(copyCountEl.innerText) : 0;

// ==================== ২. কপি বাটন লজিক ====================
allCopyButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();

        // ক) কপি কাউন্টার সংখ্যা ১ বাড়ানো
        if (copyCountEl) {
            currentCopyCount++;
            copyCountEl.innerText = currentCopyCount;
        }
        
        // খ) নম্বর খুঁজে বের করা
        const card = button.closest('.bg-white') || button.parentElement.parentElement;
        let numberToCopy = "999";
        if (card) {
            const phoneEl = card.querySelector('.phone-number');
            if (phoneEl) {
                numberToCopy = phoneEl.innerText.trim();
            }
        }

        // গ) ক্লিপবোর্ডে কপি করা
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(numberToCopy)
                .then(() => showToast(copyToast))
                .catch(() => fallbackCopyText(numberToCopy));
        } else {
            fallbackCopyText(numberToCopy);
        }
    });
});

// কপি ব্যাকআপ মেথড
function fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(copyToast);
    } catch (err) {
        console.error('কপি করা সম্ভব হয়নি:', err);
    }
    document.body.removeChild(textArea);
}

// ==================== ৩. কল বাটন লজিক ====================
allCallButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (!coinCountEl) return;

        // ক) কয়েন চেক করা এবং ২০ কয়েন কমানো
        let currentCoins = parseInt(coinCountEl.innerText);
        if (currentCoins < 20) {
            alert("দুঃখিত! আপনার পর্যাপ্ত কয়েন নেই।");
            return;
        }
        
        currentCoins -= 20;
        coinCountEl.innerText = currentCoins;

        // খ) কার্ডের টাইটেল এবং নম্বর নেওয়া
        const card = button.closest('.bg-white') || button.parentElement.parentElement;
        const title = card.querySelector('.card-title').innerText;
        const number = card.querySelector('.phone-number').innerText.trim();

        // গ) কল নোটিফিকেশন আপডেট ও শো করা
        if (toastMsg) {
            toastMsg.innerText = `Calling ${title} (${number})...`;
        }
        showToast(callToast);

        // ঘ) কল হিস্ট্রি আইটেম তৈরি করা
        const now = new Date();
        const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const historyItem = document.createElement('div');
        historyItem.className = "flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-sm";
        historyItem.innerHTML = `
            <div>
                <h4 class="font-bold text-gray-800 text-sm">${title}</h4>
                <p class="text-xs text-gray-500 mt-0.5">${number}</p>
            </div>
            <div class="text-right">
                <span class="text-xs font-medium text-gray-400">${currentTime}</span>
            </div>
        `;
        if (callHistoryContainer) {
            callHistoryContainer.prepend(historyItem);
        }

        // ঙ) মোবাইলে আসল কল পাঠানো
        setTimeout(() => {
            window.location.href = `tel:${number}`;
        }, 500);
    });
});

// ==================== ৪. কমন নোটিফিকেশন ফাংশন ====================
function showToast(targetToast) {
    if (!targetToast) return;
    
    // টোস্ট ওপেন করা
    targetToast.classList.remove('-translate-y-20', 'opacity-0', 'pointer-events-none');
    targetToast.classList.add('translate-y-0', 'opacity-100');

    // ২ সেকেন্ড পর স্বয়ংক্রিয়ভাবে বন্ধ করা
    setTimeout(() => {
        targetToast.classList.remove('translate-y-0', 'opacity-100');
        targetToast.classList.add('-translate-y-20', 'opacity-0', 'pointer-events-none');
    }, 2000);
}

// ==================== ৫. ক্লিয়ার হিস্ট্রি লজিক ====================
if (clearHistoryBtn && callHistoryContainer) {
    clearHistoryBtn.addEventListener('click', function() {
        callHistoryContainer.innerHTML = '';
    });
}