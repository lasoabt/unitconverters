// Unit conversion factors and formulas
const UnitConverters = {
    // Length conversions (all relative to meters)
    length: {
        factors: {
            m: 1,
            cm: 0.01,
            mm: 0.001,
            km: 1000,
            in: 0.0254,
            ft: 0.3048,
            yd: 0.9144,
            mi: 1609.344
        },
        convert: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            const meters = value * this.factors[fromUnit];
            const result = meters / this.factors[toUnit];
            
            return this.formatResult(result);
        },
        getFormula: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            const fromFactor = this.factors[fromUnit];
            const toFactor = this.factors[toUnit];
            const ratio = fromFactor / toFactor;
            
            return `${value} ${fromUnit} = ${value} × ${ratio.toFixed(6)} = ${this.convert(value, fromUnit, toUnit)} ${toUnit}`;
        },
        formatResult: function(result) {
            if (Math.abs(result) >= 1000000) {
                return result.toExponential(6);
            } else if (Math.abs(result) < 0.0001 && result !== 0) {
                return result.toExponential(6);
            } else {
                return parseFloat(result.toFixed(8));
            }
        }
    },

    // Weight conversions (all relative to kilograms)
    weight: {
        factors: {
            kg: 1,
            g: 0.001,
            mg: 0.000001,
            lb: 0.453592,
            oz: 0.0283495,
            st: 6.35029,
            t: 1000
        },
        convert: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            const kg = value * this.factors[fromUnit];
            const result = kg / this.factors[toUnit];
            
            return this.formatResult(result);
        },
        getFormula: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            const fromFactor = this.factors[fromUnit];
            const toFactor = this.factors[toUnit];
            const ratio = fromFactor / toFactor;
            
            return `${value} ${fromUnit} = ${value} × ${ratio.toFixed(6)} = ${this.convert(value, fromUnit, toUnit)} ${toUnit}`;
        },
        formatResult: function(result) {
            if (Math.abs(result) >= 1000000) {
                return result.toExponential(6);
            } else if (Math.abs(result) < 0.0001 && result !== 0) {
                return result.toExponential(6);
            } else {
                return parseFloat(result.toFixed(8));
            }
        }
    },

    // Volume conversions (all relative to liters)
    volume: {
        factors: {
            l: 1,
            ml: 0.001,
            gal: 3.78541,      // US gallon
            qt: 0.946353,      // US quart
            pt: 0.473176,      // US pint
            cup: 0.236588,     // US cup
            floz: 0.0295735,   // US fluid ounce
            tbsp: 0.0147868,   // US tablespoon
            tsp: 0.00492892    // US teaspoon
        },
        convert: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            const liters = value * this.factors[fromUnit];
            const result = liters / this.factors[toUnit];
            
            return this.formatResult(result);
        },
        getFormula: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            const fromFactor = this.factors[fromUnit];
            const toFactor = this.factors[toUnit];
            const ratio = fromFactor / toFactor;
            
            return `${value} ${fromUnit} = ${value} × ${ratio.toFixed(6)} = ${this.convert(value, fromUnit, toUnit)} ${toUnit}`;
        },
        formatResult: function(result) {
            if (Math.abs(result) >= 1000000) {
                return result.toExponential(6);
            } else if (Math.abs(result) < 0.0001 && result !== 0) {
                return result.toExponential(6);
            } else {
                return parseFloat(result.toFixed(8));
            }
        }
    },

    // Temperature conversions (special handling required)
    temperature: {
        convert: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            const num = parseFloat(value);
            let celsius;
            
            // Convert to Celsius first
            switch (fromUnit) {
                case 'c':
                    celsius = num;
                    break;
                case 'f':
                    celsius = (num - 32) * 5/9;
                    break;
                case 'k':
                    celsius = num - 273.15;
                    break;
                case 'r':
                    celsius = (num - 491.67) * 5/9;
                    break;
                default:
                    return '';
            }
            
            // Convert from Celsius to target unit
            let result;
            switch (toUnit) {
                case 'c':
                    result = celsius;
                    break;
                case 'f':
                    result = celsius * 9/5 + 32;
                    break;
                case 'k':
                    result = celsius + 273.15;
                    break;
                case 'r':
                    result = celsius * 9/5 + 491.67;
                    break;
                default:
                    return '';
            }
            
            return parseFloat(result.toFixed(4));
        },
        getFormula: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            const formulas = {
                'c-f': `${value}°C × 9/5 + 32 = ${this.convert(value, fromUnit, toUnit)}°F`,
                'f-c': `(${value}°F - 32) × 5/9 = ${this.convert(value, fromUnit, toUnit)}°C`,
                'c-k': `${value}°C + 273.15 = ${this.convert(value, fromUnit, toUnit)}K`,
                'k-c': `${value}K - 273.15 = ${this.convert(value, fromUnit, toUnit)}°C`,
                'f-k': `(${value}°F - 32) × 5/9 + 273.15 = ${this.convert(value, fromUnit, toUnit)}K`,
                'k-f': `(${value}K - 273.15) × 9/5 + 32 = ${this.convert(value, fromUnit, toUnit)}°F`,
                'c-r': `${value}°C × 9/5 + 491.67 = ${this.convert(value, fromUnit, toUnit)}°R`,
                'r-c': `(${value}°R - 491.67) × 5/9 = ${this.convert(value, fromUnit, toUnit)}°C`
            };
            
            const key = `${fromUnit}-${toUnit}`;
            return formulas[key] || `${value} ${fromUnit} = ${this.convert(value, fromUnit, toUnit)} ${toUnit}`;
        }
    },

    // Area conversions (all relative to square meters)
    area: {
        factors: {
            sqm: 1,
            sqcm: 0.0001,
            sqmm: 0.000001,
            sqkm: 1000000,
            hectare: 10000,
            sqin: 0.00064516,
            sqft: 0.092903,
            sqyd: 0.836127,
            acre: 4046.86,
            sqmi: 2590000
        },
        convert: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            const sqm = value * this.factors[fromUnit];
            const result = sqm / this.factors[toUnit];
            
            return this.formatResult(result);
        },
        getFormula: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            const fromFactor = this.factors[fromUnit];
            const toFactor = this.factors[toUnit];
            const ratio = fromFactor / toFactor;
            
            return `${value} ${fromUnit} = ${value} × ${ratio.toExponential(3)} = ${this.convert(value, fromUnit, toUnit)} ${toUnit}`;
        },
        formatResult: function(result) {
            if (Math.abs(result) >= 1000000 || (Math.abs(result) < 0.0001 && result !== 0)) {
                return result.toExponential(6);
            } else {
                return parseFloat(result.toFixed(8));
            }
        }
    },

    // Speed conversions (all relative to meters per second)
    speed: {
        factors: {
            'ms': 1,
            'kmh': 0.277778,
            'mph': 0.44704,
            'fts': 0.3048,
            'knot': 0.514444
        },
        convert: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            const ms = value * this.factors[fromUnit];
            const result = ms / this.factors[toUnit];
            
            return this.formatResult(result);
        },
        getFormula: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            const fromFactor = this.factors[fromUnit];
            const toFactor = this.factors[toUnit];
            const ratio = fromFactor / toFactor;
            
            return `${value} ${fromUnit} = ${value} × ${ratio.toFixed(6)} = ${this.convert(value, fromUnit, toUnit)} ${toUnit}`;
        },
        formatResult: function(result) {
            return parseFloat(result.toFixed(6));
        }
    },

    // Currency conversions (approximate rates for demo)
    currency: {
        // Exchange rates relative to USD (approximate)
        rates: {
            'USD': 1,
            'EUR': 0.85,
            'GBP': 0.73,
            'JPY': 110,
            'CAD': 1.25,
            'AUD': 1.35,
            'CHF': 0.92,
            'CNY': 6.45
        },
        convert: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            // Convert to USD first, then to target currency
            const usdValue = value / this.rates[fromUnit];
            const result = usdValue * this.rates[toUnit];
            
            return parseFloat(result.toFixed(2));
        },
        getFormula: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            const rate = (this.rates[toUnit] / this.rates[fromUnit]);
            return `${value} ${fromUnit} × ${rate.toFixed(4)} = ${this.convert(value, fromUnit, toUnit)} ${toUnit}`;
        }
    },

    // Time conversions (all relative to seconds)
    time: {
        factors: {
            sec: 1,
            min: 60,
            hr: 3600,
            day: 86400,
            week: 604800,
            month: 2629746,  // Average month (30.44 days)
            year: 31556952,  // Average year (365.25 days)
            ms: 0.001
        },
        convert: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            const seconds = value * this.factors[fromUnit];
            const result = seconds / this.factors[toUnit];
            
            return this.formatResult(result);
        },
        getFormula: function(value, fromUnit, toUnit) {
            if (!value || isNaN(value)) return '';
            
            const fromFactor = this.factors[fromUnit];
            const toFactor = this.factors[toUnit];
            const ratio = fromFactor / toFactor;
            
            return `${value} ${fromUnit} = ${value} × ${ratio.toExponential(3)} = ${this.convert(value, fromUnit, toUnit)} ${toUnit}`;
        },
        formatResult: function(result) {
            if (Math.abs(result) >= 1000000 || (Math.abs(result) < 0.001 && result !== 0)) {
                return result.toExponential(6);
            } else {
                return parseFloat(result.toFixed(8));
            }
        }
    }
};