// Cookie Consent Management System
class CookieConsent {
    constructor() {
        this.consentKey = 'cookie-consent';
        this.preferencesKey = 'cookie-preferences';
        this.defaults = {
            necessary: true,
            analytics: false,
            advertising: false
        };
        this.init();
    }

    init() {
        this.createConsentBanner();
        this.loadPreferences();
        
        // Check if consent has been given
        const consent = this.getConsent();
        if (!consent) {
            this.showBanner();
        } else {
            this.applyConsent(consent);
        }
    }

    createConsentBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-banner">
                <div class="cookie-content">
                    <div class="cookie-text">
                        <h3>🍪 We use cookies</h3>
                        <p>We use cookies to improve your experience, analyze site traffic, and serve personalized ads. You can choose which cookies you accept.</p>
                    </div>
                    <div class="cookie-actions">
                        <button id="cookie-accept-all" class="cookie-btn cookie-btn-primary">Accept All</button>
                        <button id="cookie-customize" class="cookie-btn cookie-btn-secondary">Customize</button>
                        <button id="cookie-reject" class="cookie-btn cookie-btn-minimal">Reject All</button>
                    </div>
                </div>
                
                <div id="cookie-preferences" class="cookie-preferences" style="display: none;">
                    <h4>Cookie Preferences</h4>
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <label class="cookie-toggle">
                                <input type="checkbox" id="necessary-cookies" checked disabled>
                                <span class="cookie-slider"></span>
                                <strong>Necessary Cookies</strong>
                            </label>
                        </div>
                        <p>Required for the website to function properly. Cannot be disabled.</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <label class="cookie-toggle">
                                <input type="checkbox" id="analytics-cookies">
                                <span class="cookie-slider"></span>
                                <strong>Analytics Cookies</strong>
                            </label>
                        </div>
                        <p>Help us understand how visitors interact with our website (Google Analytics).</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <label class="cookie-toggle">
                                <input type="checkbox" id="advertising-cookies">
                                <span class="cookie-slider"></span>
                                <strong>Advertising Cookies</strong>
                            </label>
                        </div>
                        <p>Used to show relevant ads and measure ad performance (Google AdSense).</p>
                    </div>
                    
                    <div class="cookie-preference-actions">
                        <button id="cookie-save-preferences" class="cookie-btn cookie-btn-primary">Save Preferences</button>
                        <button id="cookie-close-preferences" class="cookie-btn cookie-btn-secondary">Close</button>
                    </div>
                </div>
            </div>
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            #cookie-consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: #ffffff;
                border-top: 1px solid #e5e5e5;
                box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }
            
            .cookie-banner {
                max-width: 1200px;
                margin: 0 auto;
                padding: 1.5rem;
            }
            
            .cookie-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 2rem;
                flex-wrap: wrap;
            }
            
            .cookie-text h3 {
                margin: 0 0 0.5rem 0;
                font-size: 1.125rem;
                color: #1e293b;
            }
            
            .cookie-text p {
                margin: 0;
                color: #64748b;
                font-size: 0.875rem;
                line-height: 1.5;
            }
            
            .cookie-actions {
                display: flex;
                gap: 0.75rem;
                flex-wrap: wrap;
            }
            
            .cookie-btn {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 6px;
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .cookie-btn-primary {
                background: #2563eb;
                color: white;
            }
            
            .cookie-btn-primary:hover {
                background: #1d4ed8;
            }
            
            .cookie-btn-secondary {
                background: #f1f5f9;
                color: #334155;
                border: 1px solid #cbd5e1;
            }
            
            .cookie-btn-secondary:hover {
                background: #e2e8f0;
            }
            
            .cookie-btn-minimal {
                background: transparent;
                color: #64748b;
                text-decoration: underline;
            }
            
            .cookie-btn-minimal:hover {
                color: #334155;
            }
            
            .cookie-preferences {
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid #e5e5e5;
            }
            
            .cookie-preferences h4 {
                margin: 0 0 1rem 0;
                font-size: 1rem;
                color: #1e293b;
            }
            
            .cookie-category {
                margin-bottom: 1rem;
                padding: 1rem;
                background: #f8fafc;
                border-radius: 6px;
            }
            
            .cookie-category-header {
                margin-bottom: 0.5rem;
            }
            
            .cookie-toggle {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                cursor: pointer;
            }
            
            .cookie-toggle input[type="checkbox"] {
                display: none;
            }
            
            .cookie-slider {
                position: relative;
                width: 44px;
                height: 24px;
                background: #cbd5e1;
                border-radius: 24px;
                transition: background-color 0.3s ease;
            }
            
            .cookie-slider:before {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                top: 2px;
                left: 2px;
                transition: transform 0.3s ease;
            }
            
            .cookie-toggle input:checked + .cookie-slider {
                background: #2563eb;
            }
            
            .cookie-toggle input:checked + .cookie-slider:before {
                transform: translateX(20px);
            }
            
            .cookie-toggle input:disabled + .cookie-slider {
                background: #94a3b8;
                cursor: not-allowed;
            }
            
            .cookie-category p {
                margin: 0;
                font-size: 0.875rem;
                color: #64748b;
                line-height: 1.4;
            }
            
            .cookie-preference-actions {
                margin-top: 1.5rem;
                display: flex;
                gap: 0.75rem;
            }
            
            @media (max-width: 768px) {
                .cookie-content {
                    flex-direction: column;
                    text-align: center;
                }
                
                .cookie-actions {
                    justify-content: center;
                }
                
                .cookie-preference-actions {
                    flex-direction: column;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(banner);

        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        document.getElementById('cookie-accept-all').addEventListener('click', () => {
            this.acceptAll();
        });

        document.getElementById('cookie-reject').addEventListener('click', () => {
            this.rejectAll();
        });

        document.getElementById('cookie-customize').addEventListener('click', () => {
            this.showPreferences();
        });

        document.getElementById('cookie-save-preferences').addEventListener('click', () => {
            this.savePreferences();
        });

        document.getElementById('cookie-close-preferences').addEventListener('click', () => {
            this.hidePreferences();
        });
    }

    showBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.display = 'block';
        }
    }

    hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    showPreferences() {
        document.getElementById('cookie-preferences').style.display = 'block';
        
        // Load current preferences
        const prefs = this.getPreferences();
        document.getElementById('analytics-cookies').checked = prefs.analytics;
        document.getElementById('advertising-cookies').checked = prefs.advertising;
    }

    hidePreferences() {
        document.getElementById('cookie-preferences').style.display = 'none';
    }

    acceptAll() {
        const consent = {
            necessary: true,
            analytics: true,
            advertising: true,
            timestamp: Date.now()
        };
        
        this.setConsent(consent);
        this.setPreferences(consent);
        this.applyConsent(consent);
        this.hideBanner();
    }

    rejectAll() {
        const consent = {
            necessary: true,
            analytics: false,
            advertising: false,
            timestamp: Date.now()
        };
        
        this.setConsent(consent);
        this.setPreferences(consent);
        this.applyConsent(consent);
        this.hideBanner();
    }

    savePreferences() {
        const consent = {
            necessary: true,
            analytics: document.getElementById('analytics-cookies').checked,
            advertising: document.getElementById('advertising-cookies').checked,
            timestamp: Date.now()
        };
        
        this.setConsent(consent);
        this.setPreferences(consent);
        this.applyConsent(consent);
        this.hideBanner();
    }

    getConsent() {
        const consent = localStorage.getItem(this.consentKey);
        return consent ? JSON.parse(consent) : null;
    }

    setConsent(consent) {
        localStorage.setItem(this.consentKey, JSON.stringify(consent));
    }

    getPreferences() {
        const prefs = localStorage.getItem(this.preferencesKey);
        return prefs ? JSON.parse(prefs) : this.defaults;
    }

    setPreferences(prefs) {
        localStorage.setItem(this.preferencesKey, JSON.stringify(prefs));
    }

    loadPreferences() {
        const consent = this.getConsent();
        if (consent) {
            this.applyConsent(consent);
        }
    }

    applyConsent(consent) {
        // Enable analytics scripts if consent given
        if (consent.analytics) {
            this.enableScripts('analytics');
        }

        // Enable advertising scripts if consent given
        if (consent.advertising) {
            this.enableScripts('advertising');
        }

        // Store consent globally for other scripts
        window.cookieConsent = consent;
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
            detail: consent 
        }));
    }

    enableScripts(consentType) {
        // Find all blocked scripts with matching consent type
        const scripts = document.querySelectorAll(`script[type="text/plain"][data-consent="${consentType}"]`);
        
        scripts.forEach(blockedScript => {
            // Create a new script element
            const newScript = document.createElement('script');
            
            // Copy all attributes except type and data-consent
            Array.from(blockedScript.attributes).forEach(attr => {
                if (attr.name !== 'type' && attr.name !== 'data-consent') {
                    newScript.setAttribute(attr.name, attr.value);
                }
            });
            
            // If script has src, it's an external script
            if (blockedScript.src) {
                newScript.src = blockedScript.src;
            } else {
                // If no src, it's an inline script
                newScript.textContent = blockedScript.textContent;
            }
            
            // Set correct type
            newScript.type = 'text/javascript';
            
            // Replace the blocked script with the active one
            blockedScript.parentNode.replaceChild(newScript, blockedScript);
        });
        
        console.log(`${consentType} scripts enabled`);
    }

    // Method to update consent (for settings page)
    updateConsent(newConsent) {
        const consent = { ...this.getConsent(), ...newConsent, timestamp: Date.now() };
        this.setConsent(consent);
        this.setPreferences(consent);
        this.applyConsent(consent);
    }

    // Method to revoke consent
    revokeConsent() {
        localStorage.removeItem(this.consentKey);
        localStorage.removeItem(this.preferencesKey);
        location.reload();
    }
}

// Initialize cookie consent when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cookieConsentManager = new CookieConsent();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookieConsent;
}