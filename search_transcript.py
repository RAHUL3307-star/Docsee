import json

with open(r'C:\Users\Rahul J\.gemini\antigravity-ide\brain\ca6cef7e-0695-42cd-8bb5-23d2749a2f3e\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if any(term in line for term in ['medikiosk_features_section', 'Small moments', 'A closer look', 'Architecture', 'FAQ', 'Frequently asked']):
            try:
                data = json.loads(line)
                print(f"Line {i} - Step {data.get('step_index')}: {data.get('type')}")
                content = str(data.get('content', ''))
                if content:
                    print("Content:", content[:400])
                for c in data.get('tool_calls', []):
                    print("Tool:", c.get('name'), str(c.get('args'))[:200])
            except Exception as e:
                pass
