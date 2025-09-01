document.addEventListener('DOMContentLoaded', () => {

    // Global state object
    const appState = {
        vitals: [],
        symptoms: [],
        medications: [],
        lifestyle: [],
        streak: 0,
        todayEntries: 0,
        lastEntryDate: null,
        healthScore: 0
    };

    // --- DOM Elements ---
    const tabNavigation = document.getElementById('tabNavigation');
    const tabContents = document.querySelectorAll('.tab-content');
    const vitalsForm = document.getElementById('vitalsForm');
    const todaySummaryEl = document.getElementById('todaySummary');
    const recentEntriesEl = document.getElementById('recentEntries');
    
    // --- Utility Functions ---

    /**
     * Renders a simple alert message.
     * @param {string} message - The message to display.
     * @param {string} type - The type of alert ('success', 'warning', 'danger').
     */
    function showAlert(message, type) {
        const alertSystem = document.getElementById('alertSystem');
        const alertEl = document.createElement('div');
        alertEl.className = `p-4 rounded-xl text-white slide-in max-w-sm glass`;
        
        switch (type) {
            case 'success':
                alertEl.style.backgroundColor = 'rgba(16, 185, 129, 0.8)';
                break;
            case 'danger':
                alertEl.style.backgroundColor = 'rgba(239, 68, 68, 0.8)';
                break;
            case 'warning':
                alertEl.style.backgroundColor = 'rgba(245, 158, 11, 0.8)';
                break;
        }
        
        alertEl.textContent = message;
        alertSystem.appendChild(alertEl);
        
        setTimeout(() => {
            alertEl.classList.remove('slide-in');
            alertEl.classList.add('fade-out'); // A CSS animation for fading out would be ideal here
            alertEl.remove();
        }, 3000);
    }

    /**
     * Updates the UI based on the current application state.
     */
    function updateUI() {
        // Update dashboard metrics
        document.getElementById('todayEntries').textContent = appState.todayEntries;
        document.getElementById('streak').textContent = appState.streak;
        
        const healthScore = appState.healthScore.toFixed(0);
        document.getElementById('healthScore').textContent = healthScore + '%';
        document.getElementById('healthScoreBar').style.width = healthScore + '%';

        // Update last entry date
        if (appState.lastEntryDate) {
            document.getElementById('lastEntry').textContent = `Last entry: ${appState.lastEntryDate}`;
        } else {
            document.getElementById('lastEntry').textContent = `No entries today`;
        }
    }

    // --- Event Listeners ---

    // Tab navigation
    tabNavigation.addEventListener('click', (event) => {
        const targetBtn = event.target.closest('.tab-btn');
        if (!targetBtn) return;

        // Reset active state for all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        tabContents.forEach(content => content.classList.add('hidden'));

        // Activate the clicked tab
        targetBtn.classList.add('active');
        targetBtn.setAttribute('aria-selected', 'true');
        const targetTabId = targetBtn.dataset.tab;
        const targetTab = document.getElementById(`${targetTabId}-tab`);
        if (targetTab) {
            targetTab.classList.remove('hidden');
        }
    });

    // Vitals form submission
    vitalsForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Get form data
        const vitalsData = {
            systolic: parseInt(document.getElementById('systolic').value),
            diastolic: parseInt(document.getElementById('diastolic').value),
            heartRate: parseInt(document.getElementById('heartRate').value),
            oxygenSat: parseInt(document.getElementById('oxygenSat').value),
            weight: parseFloat(document.getElementById('weight').value),
            temperature: parseFloat(document.getElementById('temperature').value),
            bloodSugar: parseInt(document.getElementById('bloodSugar').value),
            sugarType: document.getElementById('sugarType').value,
            notes: document.getElementById('vitalsNotes').value,
            timestamp: new Date().toISOString()
        };
        
        // Save to state and localStorage (simulated persistence)
        appState.vitals.push(vitalsData);
        localStorage.setItem('vitals', JSON.stringify(appState.vitals));

        // Update dashboard metrics and UI
        appState.todayEntries += 1;
        appState.lastEntryDate = new Date().toLocaleTimeString();
        appState.healthScore = Math.min(100, appState.healthScore + 5); // Example score update
        updateUI();

        showAlert('Vitals saved successfully!', 'success');
        vitalsForm.reset();
    });

    // Initial data load and UI update
    function init() {
        const storedVitals = localStorage.getItem('vitals');
        if (storedVitals) {
            appState.vitals = JSON.parse(storedVitals);
            appState.todayEntries = appState.vitals.filter(entry => {
                const entryDate = new Date(entry.timestamp);
                const today = new Date();
                return entryDate.getDate() === today.getDate() && entryDate.getMonth() === today.getMonth() && entryDate.getFullYear() === today.getFullYear();
            }).length;
        }
        updateUI();
    }
    
    init();

});
