import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
 testDir:'./tests/e2e', fullyParallel:true, reporter:'list', timeout:60000, expect:{timeout:15000},
 use:{channel:process.env.PLAYWRIGHT_CHANNEL,launchOptions:process.env.PLAYWRIGHT_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH} : undefined,baseURL:'http://127.0.0.1:3000',trace:'retain-on-failure'},
 projects:[{name:'desktop',use:{...devices['Desktop Chrome']}},{name:'tablet',use:{...devices['iPad Mini'],defaultBrowserType:'chromium'}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
 // Always test this build, never an unrelated or stale server on port 3000.
 webServer:{env:{SITE_URL:'http://127.0.0.1:3000'},command:'node node_modules/next/dist/bin/next start --hostname 127.0.0.1',url:'http://127.0.0.1:3000',reuseExistingServer:false,timeout:120000},
});

