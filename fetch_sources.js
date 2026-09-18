const fs = require('fs');

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await res.json();
  const targetTab = tabs.find(t => t.id === '909BEE7928C5B3EB8C7ABF62D4960816' || t.title.includes('MediKiosk Clinical Intake'));

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
      console.log('Connected to CDP to fetch source files...');

      // List of candidate Vite source files
      const filesToFetch = [
        '/package.json',
        '/index.html',
        '/vite.config.ts',
        '/vite.config.js',
        '/tailwind.config.js',
        '/tailwind.config.ts',
        '/src/main.tsx',
        '/src/main.jsx',
        '/src/App.tsx',
        '/src/App.jsx',
        '/src/index.css',
        '/src/App.css',
        '/src/types.ts',
        '/src/data.ts',
        '/src/constants.ts'
      ];

      for (const file of filesToFetch) {
        try {
          const evalRes = await send('Runtime.evaluate', {
            expression: `fetch('${file}').then(async r => {
              if (!r.ok) return { error: r.status };
              const text = await r.text();
              return { success: true, text };
            }).catch(e => ({ error: e.toString() }))`,
            awaitPromise: true,
            returnByValue: true
          });

          const result = evalRes.result.value;
          if (result && result.success) {
            console.log(`Successfully fetched ${file} (${result.text.length} bytes)`);
            const localPath = '.' + file;
            const dir = localPath.substring(0, localPath.lastIndexOf('/'));
            if (dir && !fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(localPath, result.text, 'utf-8');
          } else {
            // console.log(`File not found or failed: ${file}`, result ? result.error : 'unknown');
          }
        } catch (e) {
          console.error(`Error fetching ${file}:`, e);
        }
      }

      // Also inspect src/App.tsx or imported modules from main.tsx if we got main.tsx
      if (fs.existsSync('./src/main.tsx')) {
        console.log('main.tsx content:\n', fs.readFileSync('./src/main.tsx', 'utf-8'));
      }

      ws.close();
      process.exit(0);
    } catch (err) {
      console.error('Error:', err);
      ws.close();
      process.exit(1);
    }
  };
}

main().catch(console.error);
