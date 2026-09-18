const fs = require('fs');

async function main() {
  // 1. Get tab list
  const res = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await res.json();
  const targetTab = tabs.find(t => t.id === '909BEE7928C5B3EB8C7ABF62D4960816' || t.title.includes('MediKiosk Clinical Intake'));
  
  if (!targetTab) {
    console.error('Target tab not found:', tabs.map(t => ({ id: t.id, title: t.title })));
    return;
  }
  
  console.log('Connecting to tab:', targetTab.title, targetTab.webSocketDebuggerUrl);
  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);

  let id = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onopen = async () => {
    try {
      console.log('Connected to CDP!');

      // Evaluate document.documentElement.outerHTML
      const evalRes = await send('Runtime.evaluate', {
        expression: 'document.documentElement.outerHTML',
        returnByValue: true
      });

      const html = evalRes.result.value;
      console.log('Extracted HTML length:', html.length);
      fs.writeFileSync('exact_page.html', html, 'utf-8');
      console.log('Saved exact_page.html');

      // Also extract document title, all stylesheets, computed font families, colors, etc.
      const inspectRes = await send('Runtime.evaluate', {
        expression: `(() => {
          return {
            title: document.title,
            bodyClasses: document.body.className,
            styles: Array.from(document.querySelectorAll('style')).map(s => s.innerHTML),
            links: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href),
            innerText: document.body.innerText
          };
        })()`,
        returnByValue: true
      });

      fs.writeFileSync('page_extracted_data.json', JSON.stringify(inspectRes.result.value, null, 2), 'utf-8');
      console.log('Saved page_extracted_data.json');

      // Take full screenshot
      const layoutRes = await send('Page.getLayoutMetrics');
      const { width, height } = layoutRes.contentSize;
      console.log('Page content size:', width, 'x', height);

      // Set viewport for full page screenshot
      await send('Emulation.setDeviceMetricsOverride', {
        width: Math.max(1280, Math.floor(width)),
        height: Math.floor(height),
        deviceScaleFactor: 1,
        mobile: false
      });

      const screenshotRes = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true
      });

      fs.writeFileSync('medikiosk_full_exact.png', Buffer.from(screenshotRes.data, 'base64'));
      console.log('Saved medikiosk_full_exact.png');

      ws.close();
      process.exit(0);
    } catch (err) {
      console.error('CDP Error:', err);
      ws.close();
      process.exit(1);
    }
  };

  ws.onerror = (err) => {
    console.error('WebSocket Error:', err);
  };
}

main().catch(console.error);
