import os, re

print("Starting generation of MediKiosk landing page...")

# 1. Read the clean root HTML
with open('clean_root_fixed.html', 'r', encoding='utf-8') as f:
    root_html = f.read()

# 2. Add full FAQ answers into the FAQ items
# FAQ 0 already has its answer.
# Let's replace the empty button-only items 1, 2, 3 with complete answer containers.

faq_1_old = re.search(r'<div[^>]*class="mk-faq-item"[^>]*data-testid="item-faq-1".*?</div>(?=<div[^>]*class="mk-faq-item"[^>]*data-testid="item-faq-2")', root_html, re.DOTALL)
if faq_1_old:
    faq_1_new = '''<div data-component-name="div" class="mk-faq-item" data-testid="item-faq-1">
  <button data-component-name="button" class="mk-faq-trigger" aria-expanded="false" data-testid="button-faq-1" id="button-faq-1">
    <span data-component-name="span">What languages can patients use?</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
  </button>
  <div data-component-name="div" class="mk-faq-answer mk-reveal" id="text-faq-answer-1" data-testid="text-faq-answer-1" style="display: none;">Patients can speak or tap in Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, and English. The kiosk automatically detects regional dialects, clarifies colloquial health terms naturally, and translates them into standardized clinical terminology for the physician.</div>
</div>'''
    root_html = root_html.replace(faq_1_old.group(0), faq_1_new)

faq_2_old = re.search(r'<div[^>]*class="mk-faq-item"[^>]*data-testid="item-faq-2".*?</div>(?=<div[^>]*class="mk-faq-item"[^>]*data-testid="item-faq-3")', root_html, re.DOTALL)
if faq_2_old:
    faq_2_new = '''<div data-component-name="div" class="mk-faq-item" data-testid="item-faq-2">
  <button data-component-name="button" class="mk-faq-trigger" aria-expanded="false" data-testid="button-faq-2" id="button-faq-2">
    <span data-component-name="span">Does AI make clinical decisions?</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
  </button>
  <div data-component-name="div" class="mk-faq-answer mk-reveal" id="text-faq-answer-2" data-testid="text-faq-answer-2" style="display: none;">No. MediKiosk never diagnoses, prescribes, or makes triage decisions. It acts strictly as an intake scribe and organizer&mdash;structuring the patient's narrative, past prescriptions, and lab values so the physician can begin the consultation fully informed.</div>
</div>'''
    root_html = root_html.replace(faq_2_old.group(0), faq_2_new)

faq_3_old = re.search(r'<div[^>]*class="mk-faq-item"[^>]*data-testid="item-faq-3".*?</div>(?=\s*</div>\s*</div>\s*</section>)', root_html, re.DOTALL)
if faq_3_old:
    faq_3_new = '''<div data-component-name="div" class="mk-faq-item" data-testid="item-faq-3">
  <button data-component-name="button" class="mk-faq-trigger" aria-expanded="false" data-testid="button-faq-3" id="button-faq-3">
    <span data-component-name="span">How do you support a busy OPD rollout?</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
  </button>
  <div data-component-name="div" class="mk-faq-answer mk-reveal" id="text-faq-answer-3" data-testid="text-faq-answer-3" style="display: none;">We deploy turnkey kiosk hardware with dual offline/online sync, train OPD nurse facilitators on intake guidance, and integrate with your existing hospital information system (HIS/EHR) within a two-week pilot phase.</div>
</div>'''
    root_html = root_html.replace(faq_3_old.group(0), faq_3_new)

# Add IDs to buttons for demo tabs and faq 0 if missing
root_html = root_html.replace('data-testid="button-faq-0"', 'data-testid="button-faq-0" id="button-faq-0"')
root_html = root_html.replace('data-testid="button-demo-patient"', 'data-testid="button-demo-patient" id="button-demo-patient"')
root_html = root_html.replace('data-testid="button-demo-clinician"', 'data-testid="button-demo-clinician" id="button-demo-clinician"')

# Also add the Patient View DOM inside display-product-demo alongside display-clinician-view
patient_view_html = '''
<div data-component-name="div" class="mk-demo-body mk-reveal" id="display-patient-view" data-testid="display-patient-view" style="display: none;">
  <div data-component-name="div" class="mk-demo-side">
    <div data-component-name="div" class="mk-demo-side-label">Kiosk Touchscreen</div>
    <div data-component-name="div" class="mk-demo-side-item active">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-languages"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>
      Hindi / English
    </div>
    <div data-component-name="div" class="mk-demo-side-item">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines"><path d="M2 10v3"></path><path d="M6 6v11"></path><path d="M10 3v18"></path><path d="M14 8v7"></path><path d="M18 5v13"></path><path d="M22 10v3"></path></svg>
      Voice Intake
    </div>
    <div data-component-name="div" class="mk-demo-side-item">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-scan"><path d="M20 10V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M16 14a2 2 0 0 0-2 2"></path><path d="M20 14a2 2 0 0 1 2 2"></path><path d="M20 22a2 2 0 0 0 2-2"></path><path d="M16 22a2 2 0 0 1-2-2"></path></svg>
      Scan Reports
    </div>
  </div>
  <div data-component-name="div" class="mk-demo-main">
    <div data-component-name="div" class="mk-kicker">Step 1 of 3 · Chief Complaint</div>
    <h3 data-component-name="h3">नमस्ते Rahul, आप कैसा महसूस कर रहे हैं?</h3>
    <div data-component-name="div" class="mk-demo-main-sub">Speak freely in your native language or tap below</div>
    <div data-component-name="div" class="mk-patient-strip" style="background: hsl(var(--card)); border: 1px solid hsl(var(--primary)/.3); padding: 12px 16px;">
      <div data-component-name="div" class="mk-patient-id" style="gap: 12px; align-items: flex-start;">
        <span data-component-name="span" class="mk-patient-avatar" style="background: hsl(var(--primary)); color: white;">🎙</span>
        <div>
          <div style="font-weight: 600; color: hsl(var(--foreground)); font-size: 0.95rem; line-height: 1.4;">"3 हफ्ते से बहुत ज्यादा थकान लग रही है और शाम को सिरदर्द होता है..."</div>
          <div style="font-size: 0.8rem; color: hsl(var(--muted-foreground)); margin-top: 4px;">English: "Feeling severe fatigue for 3 weeks and headache in evenings..."</div>
        </div>
      </div>
      <span data-component-name="span" class="mk-chip" style="background: hsl(var(--secondary)/.15); color: hsl(var(--secondary)); font-weight: 600; align-self: flex-start;">Live Translation</span>
    </div>
    <div data-component-name="div" class="mk-chart" style="margin-top: 18px;">
      <div data-component-name="div" class="mk-chart-head">
        <span>Extracted Clinical Signals</span>
        <span style="color: hsl(var(--secondary)); font-weight: 600;">● Auto-structured</span>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin: 12px 0;">
        <span class="mk-chip" style="background: hsl(var(--muted));">⚡ Chronic Fatigue (3 wks)</span>
        <span class="mk-chip" style="background: hsl(var(--muted));">🤕 Bilateral Evening Headache</span>
        <span class="mk-chip" style="background: hsl(var(--muted));">📄 1 Prior Prescription Attached</span>
      </div>
      <div data-component-name="div" class="mk-demo-note" style="border-top: 1px solid hsl(var(--border)); padding-top: 10px; margin-top: 8px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>
        Summary verified by patient. Ready to handoff to Doctor.
      </div>
    </div>
  </div>
</div>
'''

# Insert patient_view_html right after display-clinician-view
clinician_view_end = root_html.find('</div><div data-component-name="div" class="mk-inset-label">structured, not sterile</div>')
if clinician_view_end != -1:
    root_html = root_html[:clinician_view_end] + patient_view_html + root_html[clinician_view_end:]

# Add language dropdown menu inside .mk-lang-wrap
lang_dropdown_html = '''
<div class="mk-lang-menu" id="menu-language" style="display: none;">
  <button class="mk-lang-option" data-lang="en">✓ English</button>
  <button class="mk-lang-option" data-lang="hi">हिन्दी (Hindi)</button>
  <button class="mk-lang-option" data-lang="bn">বাংলা (Bengali)</button>
  <button class="mk-lang-option" data-lang="te">తెలుగు (Telugu)</button>
  <button class="mk-lang-option" data-lang="mr">मराठी (Marathi)</button>
  <button class="mk-lang-option" data-lang="ta">தமிழ் (Tamil)</button>
  <button class="mk-lang-option" data-lang="gu">ગુજરાતી (Gujarati)</button>
  <button class="mk-lang-option" data-lang="kn">ಕನ್ನಡ (Kannada)</button>
</div>
'''
btn_lang_pos = root_html.find('id="button-language"')
if btn_lang_pos == -1:
    btn_lang_pos = root_html.find('data-testid="button-language"')

if btn_lang_pos != -1:
    btn_end = root_html.find('</button>', btn_lang_pos) + 9
    root_html = root_html[:btn_end] + lang_dropdown_html + root_html[btn_end:]

print("Root HTML updated with FAQ, Patient View, and Language Menu.")

# 3. Create Pilot Consultation Modal
pilot_modal_html = '''
<!-- Hospital Pilot Modal -->
<div id="pilot-modal" class="mk-modal-overlay" style="display: none;" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="mk-modal-card">
    <div class="mk-modal-header">
      <div>
        <div class="mk-kicker">Clinical Implementation</div>
        <h3 id="modal-title" style="font: 2.2rem/1 var(--app-font-serif); margin-top: 6px; letter-spacing: -0.03em;">Plan an OPD Pilot with MediKiosk</h3>
        <p style="color: hsl(var(--muted-foreground)); font-size: 0.9rem; margin-top: 6px; line-height: 1.5;">Deploy multilingual AI clinical intake at your hospital OPD in under two weeks with zero disruption.</p>
      </div>
      <button class="mk-modal-close" id="modal-close" aria-label="Close modal">&times;</button>
    </div>
    <form id="pilot-form" class="mk-modal-form">
      <div class="mk-form-row">
        <div class="mk-form-group">
          <label for="input-hospital">Hospital / Healthcare Facility *</label>
          <input type="text" id="input-hospital" required placeholder="e.g. Apollo Hospitals / AIIMS" class="mk-input">
        </div>
        <div class="mk-form-group">
          <label for="input-department">OPD Department *</label>
          <select id="input-department" required class="mk-input">
            <option value="">Select Department</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Central Multi-specialty OPD">Central / Multi-specialty OPD</option>
          </select>
        </div>
      </div>
      <div class="mk-form-row">
        <div class="mk-form-group">
          <label for="input-name">Contact Person *</label>
          <input type="text" id="input-name" required placeholder="Dr. / Administrator Name" class="mk-input">
        </div>
        <div class="mk-form-group">
          <label for="input-role">Clinical / Administrative Role</label>
          <input type="text" id="input-role" placeholder="e.g. Medical Superintendent, HOD" class="mk-input">
        </div>
      </div>
      <div class="mk-form-row">
        <div class="mk-form-group">
          <label for="input-email">Work Email *</label>
          <input type="email" id="input-email" required placeholder="name@hospital.org" class="mk-input">
        </div>
        <div class="mk-form-group">
          <label for="input-phone">Phone / WhatsApp *</label>
          <input type="tel" id="input-phone" required placeholder="+91 98765 43210" class="mk-input">
        </div>
      </div>
      <div class="mk-form-group">
        <label for="input-volume">Expected Daily OPD Patient Volume</label>
        <select id="input-volume" class="mk-input">
          <option value="200-500">200 – 500 patients / day</option>
          <option value="500-1500">500 – 1,500 patients / day</option>
          <option value="1500+">1,500+ high-volume OPD</option>
        </select>
      </div>
      <div class="mk-form-actions">
        <button type="button" class="mk-button mk-button-quiet" id="modal-cancel">Cancel</button>
        <button type="submit" class="mk-button mk-button-primary" id="modal-submit">Request Consultation &amp; Pilot Demo</button>
      </div>
    </form>
  </div>
</div>

<!-- Mobile Nav Drawer -->
<div id="mobile-nav-drawer" class="mk-mobile-drawer" style="display: none;">
  <button id="mobile-drawer-close" style="position: absolute; top: 24px; right: 24px; background: transparent; border: 0; font-size: 32px; color: hsl(var(--foreground)); cursor: pointer;">&times;</button>
  <a href="#why" class="mk-mobile-link">Why MediKiosk</a>
  <a href="#journey" class="mk-mobile-link">Patient Journey</a>
  <a href="#for-teams" class="mk-mobile-link">For Care Teams</a>
  <a href="#faq" class="mk-mobile-link">FAQ</a>
  <button class="mk-button mk-button-primary" id="button-mobile-contact" style="margin-top: 16px;">Talk to our team</button>
</div>

<!-- Toast Container -->
<div id="toast-container" class="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] pointer-events-none"></div>
'''

# 4. Assemble the full index.html
index_html = f'''<!DOCTYPE html>
<html lang="en" class="h-full antialiased">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MediKiosk — AI Clinical Intake &amp; Smart Hospital OPD Triage System</title>
  <meta name="description" content="MediKiosk transforms rushed OPD queues into calm, multilingual clinical intakes. Voice &amp; touchscreen kiosk for patients with instant structured timeline handoff for physicians.">
  <meta name="keywords" content="MediKiosk, Clinical Intake, OPD Triage, Hospital AI, Multilingual Patient Intake, EHR Integration, Healthcare AI">
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ea580c'><circle cx='12' cy='12' r='10'/><path d='M12 7v10M7 12h10' stroke='white' stroke-width='2.5' stroke-linecap='round'/></svg>">
  
  <!-- Preconnect & Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Instrument+Serif:ital@0;1&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Main Stylesheet -->
  <link rel="stylesheet" href="style.css">
  
  <style>
    /* Modal, Toast, and Interactivity styles */
    .mk-modal-overlay {{
      position: fixed;
      inset: 0;
      z-index: 999;
      background: rgba(20, 16, 12, 0.65);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: mkFadeIn 0.25s ease-out;
    }}
    @keyframes mkFadeIn {{
      from {{ opacity: 0; }}
      to {{ opacity: 1; }}
    }}
    @keyframes mkScaleUp {{
      from {{ opacity: 0; transform: scale(0.95) translateY(12px); }}
      to {{ opacity: 1; transform: scale(1) translateY(0); }}
    }}
    .mk-modal-card {{
      background: hsl(var(--background));
      border: 1px solid hsl(var(--border));
      border-radius: 20px;
      width: 100%;
      max-width: 620px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 34px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.28);
      animation: mkScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }}
    .mk-modal-header {{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid hsl(var(--border));
    }}
    .mk-modal-close {{
      background: transparent;
      border: 0;
      font-size: 28px;
      line-height: 1;
      color: hsl(var(--muted-foreground));
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: all 0.2s;
    }}
    .mk-modal-close:hover {{
      background: hsl(var(--muted));
      color: hsl(var(--foreground));
    }}
    .mk-form-row {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }}
    @media (max-width: 600px) {{
      .mk-form-row {{
        grid-template-columns: 1fr;
      }}
    }}
    .mk-form-group {{
      margin-bottom: 16px;
    }}
    .mk-form-group label {{
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      color: hsl(var(--foreground));
      margin-bottom: 6px;
      letter-spacing: -0.01em;
    }}
    .mk-input {{
      width: 100%;
      padding: 10px 14px;
      border-radius: 10px;
      border: 1px solid hsl(var(--border));
      background: hsl(var(--card));
      color: hsl(var(--foreground));
      font-family: inherit;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }}
    .mk-input:focus {{
      border-color: hsl(var(--primary));
      box-shadow: 0 0 0 3px hsl(var(--primary) / 0.15);
    }}
    .mk-form-actions {{
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid hsl(var(--border));
    }}
    .mk-toast {{
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 12px;
      background: hsl(var(--foreground));
      color: hsl(var(--background));
      padding: 14px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25);
      font-size: 0.88rem;
      font-weight: 500;
      margin-top: 10px;
      animation: mkToastEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      transition: opacity 0.3s, transform 0.3s;
    }}
    @keyframes mkToastEnter {{
      from {{ opacity: 0; transform: translateY(16px) scale(0.95); }}
      to {{ opacity: 1; transform: translateY(0) scale(1); }}
    }}
    .mk-mobile-drawer {{
      position: fixed;
      inset: 0;
      z-index: 998;
      background: hsl(var(--background) / 0.98);
      backdrop-filter: blur(14px);
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 24px;
      animation: mkFadeIn 0.25s ease-out;
    }}
    .mk-mobile-drawer a {{
      font: 2.2rem/1.2 var(--app-font-serif);
      color: hsl(var(--foreground));
      text-decoration: none;
      transition: color 0.2s;
    }}
    .mk-mobile-drawer a:hover {{
      color: hsl(var(--primary));
    }}
    /* Smooth reveal transitions */
    .mk-reveal {{
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }}
  </style>
</head>
<body style="padding-top: 0px;" class="">
  <div id="root">
    {root_html}
  </div>

  {pilot_modal_html}

  <script src="script.js"></script>
</body>
</html>
'''

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_html)

print("Saved index.html (size:", len(index_html), "bytes)")
