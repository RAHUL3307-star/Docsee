/**
 * ══════════════════════════════════════════════════════════════════════
 * 🩺 DOCSEE SUPABASE CLIENT & CLINICAL DATA LAYER
 * Handles Cloud PostgreSQL Database Sync, Patient Ingestion, Case Sheets & OPD Queue
 * ══════════════════════════════════════════════════════════════════════
 */

// Default Demo / Public Supabase Config (Users can update via UI or localStorage)
const DEFAULT_SUPABASE_CONFIG = {
  url: localStorage.getItem('DOCSEE_SUPABASE_URL') || 'https://xyzcompanydocsee.supabase.co',
  anonKey: localStorage.getItem('DOCSEE_SUPABASE_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummykey',
  isConnected: false
};

class DocSeeDatabase {
  constructor() {
    this.client = null;
    this.config = { ...DEFAULT_SUPABASE_CONFIG };
    this.localQueueKey = 'DOCSEE_LOCAL_QUEUE_V1';
    this.localCasesKey = 'DOCSEE_LOCAL_CASES_V1';
    this.init();
  }

  init() {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        if (this.config.url && this.config.url.startsWith('https://') && this.config.anonKey.length > 20) {
          this.client = window.supabase.createClient(this.config.url, this.config.anonKey);
          this.config.isConnected = true;
          console.log('✅ [DocSee] Connected to Supabase Cloud Database:', this.config.url);
        }
      } catch (err) {
        console.warn('⚠️ [DocSee] Supabase init warning, using resilient fallback store:', err.message);
      }
    } else {
      console.log('ℹ️ [DocSee] Supabase client initialized in local-first hybrid mode.');
    }
    this.initLocalStore();
  }

  initLocalStore() {
    if (!localStorage.getItem(this.localQueueKey)) {
      const defaultQueue = [
        {
          id: 'case-001',
          token_number: 'A-1048',
          patient_name: 'Rahul Kumar',
          age: 42,
          gender: 'Male',
          department: 'General Medicine',
          chief_complaint: 'Chest Pain / Fatigue',
          priority_level: 'Priority',
          status: 'waiting',
          estimated_wait_min: 10,
          vitals: { bp: '142/90', hr: 92, temp: '98.6', spo2: 97, rbs: 145 },
          created_at: new Date().toISOString()
        },
        {
          id: 'case-002',
          token_number: 'A-1049',
          patient_name: 'Savitri Devi',
          age: 58,
          gender: 'Female',
          department: 'General Medicine',
          chief_complaint: 'Joint Pain (Knee arthritis)',
          priority_level: 'Standard',
          status: 'waiting',
          estimated_wait_min: 18,
          vitals: { bp: '130/84', hr: 76, temp: '98.4', spo2: 98, rbs: 110 },
          created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString()
        },
        {
          id: 'case-003',
          token_number: 'A-1050',
          patient_name: 'Anil Deshmukh',
          age: 34,
          gender: 'Male',
          department: 'Ayurveda OPD',
          chief_complaint: 'Digestive issues & Acidity',
          priority_level: 'Standard',
          status: 'waiting',
          estimated_wait_min: 24,
          vitals: { bp: '118/78', hr: 70, temp: '98.6', spo2: 99, rbs: 95 },
          created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString()
        }
      ];
      localStorage.setItem(this.localQueueKey, JSON.stringify(defaultQueue));
    }
  }

  // Update Supabase Project Credentials
  updateConfig(url, key) {
    if (!url || !key) return { success: false, message: 'URL and Anon Key are required.' };
    this.config.url = url.trim();
    this.config.anonKey = key.trim();
    localStorage.setItem('DOCSEE_SUPABASE_URL', this.config.url);
    localStorage.setItem('DOCSEE_SUPABASE_KEY', this.config.anonKey);
    
    try {
      if (window.supabase) {
        this.client = window.supabase.createClient(this.config.url, this.config.anonKey);
        this.config.isConnected = true;
        return { success: true, message: 'Successfully connected to Supabase cloud database!' };
      }
    } catch (e) {
      return { success: false, message: 'Connection failed: ' + e.message };
    }
    return { success: true, message: 'Configuration saved. Ready for sync.' };
  }

  // 1. SAVE PATIENT INTAKE & CREATE DIGITAL CASE RECORD
  async savePatientIntake(caseData) {
    const timestamp = new Date().toISOString();
    const token = caseData.tokenNumber || ('A-' + Math.floor(1040 + Math.random() * 50));
    
    // Auto calculate triage priority
    let priority = 'Standard';
    if ((caseData.vitals && caseData.vitals.spo2 && parseInt(caseData.vitals.spo2) < 94) || 
        (caseData.vitals && caseData.vitals.bpSys && parseInt(caseData.vitals.bpSys) > 175) ||
        (caseData.complaint && caseData.complaint.toLowerCase().includes('chest'))) {
      priority = 'Priority';
    }
    if ((caseData.vitals && caseData.vitals.spo2 && parseInt(caseData.vitals.spo2) < 90) || 
        (caseData.vitals && caseData.vitals.bpSys && parseInt(caseData.vitals.bpSys) > 200)) {
      priority = 'Emergency';
    }

    const patientRecord = {
      id: 'pat-' + Date.now(),
      token_number: token,
      full_name: caseData.name || 'Anonymous Patient',
      age: parseInt(caseData.age) || 0,
      gender: caseData.gender || 'Not specified',
      phone: caseData.phone || '',
      abha_id: caseData.abha || '91-' + Math.floor(1000+Math.random()*9000) + '-' + Math.floor(1000+Math.random()*9000) + '-' + Math.floor(1000+Math.random()*9000),
      department: caseData.department || 'General Medicine',
      language: caseData.language || 'en',
      address: caseData.address || '',
      created_at: timestamp
    };

    const caseRecord = {
      id: 'case-' + Date.now(),
      token_number: token,
      patient_name: patientRecord.full_name,
      age: patientRecord.age,
      gender: patientRecord.gender,
      department: patientRecord.department,
      chief_complaint: caseData.complaint || 'General Checkup',
      symptoms_narrative: caseData.symptomsDescription || '',
      live_translation_text: caseData.translationText || '',
      dynamic_qa_answers: caseData.qaAnswers || {},
      existing_conditions: caseData.conditions || [],
      current_medications: caseData.medications || 'None',
      known_allergies: caseData.allergies || 'NKDA',
      past_surgeries: caseData.surgeries || 'None',
      family_history: caseData.familyHistory || [],
      vitals: caseData.vitals || {},
      priority_level: priority,
      status: 'waiting',
      clinical_summary: `Patient ${patientRecord.full_name} (${patientRecord.age}y/${patientRecord.gender}) presents with ${caseData.complaint || 'unspecified complaint'}. Vitals: BP ${caseData.vitals?.bpSys || 120}/${caseData.vitals?.bpDia || 80}, SpO2 ${caseData.vitals?.spo2 || 98}%, HR ${caseData.vitals?.hr || 74} bpm. Priority: ${priority}.`,
      created_at: timestamp
    };

    // Save to LocalStorage first (instant UI responsiveness & offline resiliency)
    const localQueue = JSON.parse(localStorage.getItem(this.localQueueKey) || '[]');
    localQueue.unshift({
      id: caseRecord.id,
      token_number: token,
      patient_name: patientRecord.full_name,
      age: patientRecord.age,
      gender: patientRecord.gender,
      department: patientRecord.department,
      chief_complaint: caseRecord.chief_complaint,
      priority_level: priority,
      status: 'waiting',
      estimated_wait_min: Math.floor(8 + Math.random() * 15),
      vitals: caseRecord.vitals,
      created_at: timestamp
    });
    localStorage.setItem(this.localQueueKey, JSON.stringify(localQueue));

    const localCases = JSON.parse(localStorage.getItem(this.localCasesKey) || '{}');
    localCases[token] = caseRecord;
    localStorage.setItem(this.localCasesKey, JSON.stringify(localCases));

    // Try Supabase Cloud Insert if connected
    if (this.client && this.config.isConnected) {
      try {
        const { data: pData, error: pErr } = await this.client
          .from('docsee_patients')
          .insert([patientRecord])
          .select();
        
        if (!pErr && pData && pData[0]) {
          const pId = pData[0].id;
          await this.client.from('docsee_cases').insert([{
            patient_id: pId,
            token_number: token,
            chief_complaint: caseRecord.chief_complaint,
            symptoms_narrative: caseRecord.symptoms_narrative,
            dynamic_qa_answers: caseRecord.dynamic_qa_answers,
            existing_conditions: caseRecord.existing_conditions,
            current_medications: caseRecord.current_medications,
            known_allergies: caseRecord.known_allergies,
            bp_systolic: parseInt(caseData.vitals?.bpSys) || 120,
            bp_diastolic: parseInt(caseData.vitals?.bpDia) || 80,
            heart_rate: parseInt(caseData.vitals?.hr) || 72,
            temperature_f: parseFloat(caseData.vitals?.temp) || 98.6,
            spo2_percent: parseInt(caseData.vitals?.spo2) || 98,
            priority_level: priority,
            clinical_summary: caseRecord.clinical_summary
          }]);

          await this.client.from('docsee_queue').insert([{
            patient_id: pId,
            token_number: token,
            patient_name: patientRecord.full_name,
            age: patientRecord.age,
            gender: patientRecord.gender,
            department: patientRecord.department,
            chief_complaint: caseRecord.chief_complaint,
            priority_level: priority,
            status: 'waiting',
            estimated_wait_min: 12
          }]);

          console.log('☁️ [DocSee] Record synced to Supabase Cloud Database for Token:', token);
        }
      } catch (cloudErr) {
        console.warn('⚠️ [DocSee] Supabase cloud sync deferred (offline/network):', cloudErr.message);
      }
    }

    return { success: true, tokenNumber: token, caseRecord };
  }

  // 2. FETCH OPD PATIENT QUEUE
  async getQueue() {
    if (this.client && this.config.isConnected) {
      try {
        const { data, error } = await this.client
          .from('docsee_queue')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('⚠️ [DocSee] Reading from local storage queue fallback');
      }
    }
    return JSON.parse(localStorage.getItem(this.localQueueKey) || '[]');
  }

  // 3. FETCH CASE SHEET FOR SPECIFIC TOKEN OR PATIENT
  async getCaseSheet(token) {
    if (this.client && this.config.isConnected) {
      try {
        const { data, error } = await this.client
          .from('docsee_cases')
          .select('*, docsee_patients(*)')
          .eq('token_number', token)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('⚠️ [DocSee] Reading case from local storage');
      }
    }
    const localCases = JSON.parse(localStorage.getItem(this.localCasesKey) || '{}');
    return localCases[token] || null;
  }
}

// Global Singleton Instance
window.DocSeeDB = new DocSeeDatabase();
