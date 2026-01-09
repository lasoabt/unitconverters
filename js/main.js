class UnitConverterApp {
    constructor() {
        this.activeTab = 'length';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTabSwitching();
        this.initializeConverters();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.closest('.tab-btn').dataset.tab);
            });
        });

        // Setup input listeners for each converter type
        this.setupConverterListeners('length');
        this.setupConverterListeners('weight');
        this.setupConverterListeners('volume');
        this.setupConverterListeners('temperature');
        this.setupConverterListeners('area');
        this.setupConverterListeners('speed');
        this.setupConverterListeners('time');
        this.setupConverterListeners('currency');
    }

    setupConverterListeners(type) {
        const fromInput = document.getElementById(`${type === 'temperature' ? 'temp' : type}-from-value`);
        const toInput = document.getElementById(`${type === 'temperature' ? 'temp' : type}-to-value`);
        const fromUnit = document.getElementById(`${type === 'temperature' ? 'temp' : type}-from-unit`);
        const toUnit = document.getElementById(`${type === 'temperature' ? 'temp' : type}-to-unit`);

        if (fromInput && toInput && fromUnit && toUnit) {
            // Convert when input value changes
            fromInput.addEventListener('input', () => {
                this.convertUnits(type, 'from');
            });

            toInput.addEventListener('input', () => {
                this.convertUnits(type, 'to');
            });

            // Convert when unit selection changes
            fromUnit.addEventListener('change', () => {
                this.convertUnits(type, 'from');
            });

            toUnit.addEventListener('change', () => {
                this.convertUnits(type, 'from');
            });
        }
    }

    setupTabSwitching() {
        // Initialize first tab
        this.showTab(this.activeTab);
    }

    switchTab(tabName) {
        if (tabName === this.activeTab) return;

        // Update active tab
        this.activeTab = tabName;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show tab content
        this.showTab(tabName);

        // Update URL hash for bookmarking
        window.history.replaceState(null, null, `#${tabName}`);
    }

    showTab(tabName) {
        // Hide all tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Show selected tab
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }

    convertUnits(type, direction) {
        const prefix = type === 'temperature' ? 'temp' : type;
        const fromInput = document.getElementById(`${prefix}-from-value`);
        const toInput = document.getElementById(`${prefix}-to-value`);
        const fromUnit = document.getElementById(`${prefix}-from-unit`);
        const toUnit = document.getElementById(`${prefix}-to-unit`);
        const formulaElement = document.getElementById(`${prefix}-formula`);

        if (!fromInput || !toInput || !fromUnit || !toUnit) return;

        let sourceInput, targetInput, sourceUnit, targetUnit;

        if (direction === 'from') {
            sourceInput = fromInput;
            targetInput = toInput;
            sourceUnit = fromUnit.value;
            targetUnit = toUnit.value;
        } else {
            sourceInput = toInput;
            targetInput = fromInput;
            sourceUnit = toUnit.value;
            targetUnit = fromUnit.value;
        }

        const value = parseFloat(sourceInput.value);
        
        if (isNaN(value) || sourceInput.value === '') {
            targetInput.value = '';
            if (formulaElement) formulaElement.textContent = '';
            return;
        }

        // Perform conversion
        const converter = UnitConverters[type];
        if (converter) {
            const result = converter.convert(value, sourceUnit, targetUnit);
            targetInput.value = result;

            // Update formula display
            if (formulaElement && direction === 'from') {
                const formula = converter.getFormula(value, sourceUnit, targetUnit);
                formulaElement.textContent = formula;
            }
        }
    }

    initializeConverters() {
        // Set default values for demonstration
        const demos = {
            length: { value: '1', from: 'm', to: 'in' },
            weight: { value: '1', from: 'kg', to: 'lb' },
            volume: { value: '1', from: 'l', to: 'gal' },
            temperature: { value: '0', from: 'c', to: 'f' },
            area: { value: '1', from: 'sqm', to: 'sqft' },
            speed: { value: '1', from: 'ms', to: 'mph' },
            time: { value: '1', from: 'sec', to: 'hr' },
            currency: { value: '100', from: 'USD', to: 'EUR' }
        };

        Object.keys(demos).forEach(type => {
            const demo = demos[type];
            const prefix = type === 'temperature' ? 'temp' : type;
            const fromInput = document.getElementById(`${prefix}-from-value`);
            const fromUnit = document.getElementById(`${prefix}-from-unit`);
            const toUnit = document.getElementById(`${prefix}-to-unit`);

            if (fromInput && fromUnit && toUnit) {
                fromInput.value = demo.value;
                fromUnit.value = demo.from;
                toUnit.value = demo.to;
                this.convertUnits(type, 'from');
            }
        });
    }
}

// Global function for swap buttons
function swapUnits(type) {
    const prefix = type === 'temperature' ? 'temp' : type;
    const fromInput = document.getElementById(`${prefix}-from-value`);
    const toInput = document.getElementById(`${prefix}-to-value`);
    const fromUnit = document.getElementById(`${prefix}-from-unit`);
    const toUnit = document.getElementById(`${prefix}-to-unit`);

    if (fromInput && toInput && fromUnit && toUnit) {
        // Swap values
        const tempValue = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = tempValue;

        // Swap units
        const tempUnit = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = tempUnit;

        // Trigger conversion
        if (window.app) {
            window.app.convertUnits(type, 'from');
        }
    }
}

// Popular conversion shortcuts
function setPopularConversion(type, fromUnit, toUnit, value = '') {
    if (window.app) {
        window.app.switchTab(type);
        
        setTimeout(() => {
            const prefix = type === 'temperature' ? 'temp' : type;
            const fromInput = document.getElementById(`${prefix}-from-value`);
            const fromUnitSelect = document.getElementById(`${prefix}-from-unit`);
            const toUnitSelect = document.getElementById(`${prefix}-to-unit`);

            if (fromInput && fromUnitSelect && toUnitSelect) {
                fromUnitSelect.value = fromUnit;
                toUnitSelect.value = toUnit;
                if (value) fromInput.value = value;
                fromInput.focus();
                window.app.convertUnits(type, 'from');
            }
        }, 100);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new UnitConverterApp();

    // Handle hash navigation
    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
        window.app.switchTab(hash);
    }

    // Add click handlers for popular conversions
    document.querySelectorAll('.popular-item li').forEach(item => {
        item.addEventListener('click', () => {
            const text = item.textContent.toLowerCase();
            
            // Parse popular conversion text and trigger
            if (text.includes('feet to meters')) {
                setPopularConversion('length', 'ft', 'm', '1');
            } else if (text.includes('inches to centimeters')) {
                setPopularConversion('length', 'in', 'cm', '1');
            } else if (text.includes('miles to kilometers')) {
                setPopularConversion('length', 'mi', 'km', '1');
            } else if (text.includes('pounds to kilograms')) {
                setPopularConversion('weight', 'lb', 'kg', '1');
            } else if (text.includes('ounces to grams')) {
                setPopularConversion('weight', 'oz', 'g', '1');
            } else if (text.includes('stones to pounds')) {
                setPopularConversion('weight', 'st', 'lb', '1');
            } else if (text.includes('gallons to liters')) {
                setPopularConversion('volume', 'gal', 'l', '1');
            } else if (text.includes('cups to milliliters')) {
                setPopularConversion('volume', 'cup', 'ml', '1');
            } else if (text.includes('pints to quarts')) {
                setPopularConversion('volume', 'pt', 'qt', '1');
            } else if (text.includes('celsius to fahrenheit')) {
                setPopularConversion('temperature', 'c', 'f', '0');
            } else if (text.includes('fahrenheit to kelvin')) {
                setPopularConversion('temperature', 'f', 'k', '32');
            } else if (text.includes('kelvin to celsius')) {
                setPopularConversion('temperature', 'k', 'c', '273.15');
            } else if (text.includes('square meters to square feet')) {
                setPopularConversion('area', 'sqm', 'sqft', '1');
            } else if (text.includes('acres to hectares')) {
                setPopularConversion('area', 'acre', 'hectare', '1');
            } else if (text.includes('square feet to square meters')) {
                setPopularConversion('area', 'sqft', 'sqm', '1');
            } else if (text.includes('mph to km/h')) {
                setPopularConversion('speed', 'mph', 'kmh', '60');
            } else if (text.includes('knots to mph')) {
                setPopularConversion('speed', 'knot', 'mph', '1');
            } else if (text.includes('m/s to mph')) {
                setPopularConversion('speed', 'ms', 'mph', '10');
            } else if (text.includes('hours to minutes')) {
                setPopularConversion('time', 'hr', 'min', '1');
            } else if (text.includes('days to hours')) {
                setPopularConversion('time', 'day', 'hr', '1');
            } else if (text.includes('weeks to days')) {
                setPopularConversion('time', 'week', 'day', '1');
            }
        });
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.altKey) {
        const key = e.key.toLowerCase();
        const tabs = {
            'l': 'length',
            'w': 'weight',
            'v': 'volume',
            't': 'temperature',
            'a': 'area',
            's': 'speed',
            'm': 'time',
            'c': 'currency'
        };
        
        if (tabs[key] && window.app) {
            e.preventDefault();
            window.app.switchTab(tabs[key]);
        }
    }
});

// Add some utility functions for enhanced UX
function clearAllInputs() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });
    document.querySelectorAll('.conversion-formula').forEach(formula => {
        formula.textContent = '';
    });
}

function resetToDefaults() {
    if (window.app) {
        window.app.initializeConverters();
    }
}