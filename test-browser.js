import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch({ 
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        const page = await browser.newPage();
        
        page.on('pageerror', error => console.log('BROWSER ERROR:', error.message, error.stack));
        const fs = await import('fs');
        page.on('console', msg => {
            console.log('LOG:', msg.text());
            fs.appendFileSync('browser-log.txt', msg.text() + '\n');
        });
        
        // Login first
        console.log("Navigating to login...");
        await page.goto('http://127.0.0.1:8000/login', { waitUntil: 'networkidle0' });
        
        // Fill out login form (assuming standard Laravel Breeze fields)
        await page.type('input[type="email"]', 'admin@theknoweros.com');
        await page.type('input[type="password"]', 'password');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);
        
        // Navigate to finance page
        console.log("Navigating to finance...");
        await page.goto('http://127.0.0.1:8000/finance', { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: 'screenshot_finance.png', fullPage: true });

        console.log("Navigating to leads...");
        await page.goto('http://127.0.0.1:8000/leads', { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: 'screenshot_leads.png', fullPage: true });

        console.log("Done.");
        
        await browser.close();
    } catch (e) {
        console.error("SCRIPT ERROR:", e);
    }
})();
