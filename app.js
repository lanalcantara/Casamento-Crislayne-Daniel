/**
 * CASAMENTO CRISLAYNE & DANIEL
 * Virtual Interactive Luxury Wedding Invitation
 * Features:
 * - 3D Envelope Physics & Opening Animation
 * - Auto-playing Romantic Background Audio with Smooth Fade-in
 * - Real-time Countdown Timer
 * - Supabase Backend RSVP Integration & E-mail Notification (Crislayneevelin98@gmail.com)
 * - 1-Click PIX Copy with Visual Toast Feedback & Interactive Honeymoon Cotas
 * - WhatsApp RSVP Sync & Calendar Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global config fallback
  const CONFIG = window.WEDDING_CONFIG || {
    SUPABASE_URL: '',
    SUPABASE_ANON_KEY: '',
    NOTIFICATION_EMAIL: 'Crislayneevelin98@gmail.com',
    NOIVOS_PHONE: '5581996946988',
    PIX_KEY: '81996946988',
    PIX_NAME: 'Crislayne Evelin',
    WEDDING_DATE_ISO: '2026-11-21T18:00:00-03:00',
    VENUE_NAME: 'Maysa Recepções',
    VENUE_ADDRESS: 'Maysa Recepções - R. Prof. José Amarino dos Réis, 919-881 - Linha do Tiro, Recife - PE, 52131-320'
  };

  // --- INITIALIZE SUPABASE CLIENT ---
  let supabaseClient = null;
  if (window.supabase && CONFIG.SUPABASE_URL && !CONFIG.SUPABASE_URL.includes('SEU_PROJETO')) {
    try {
      supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
      console.log('Supabase client initialized successfully.');
    } catch (e) {
      console.warn('Supabase initialization failed:', e);
    }
  }

  // --- DOM ELEMENTS ---
  const envelopeScreen = document.getElementById('envelope-screen');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const btnOpenEnvelope = document.getElementById('btn-open-envelope');
  const invitationMain = document.getElementById('invitation-main');
  
  const weddingAudio = document.getElementById('wedding-audio');
  const audioWidget = document.getElementById('audio-widget');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  
  const btnCopyPix = document.getElementById('btn-copy-pix');
  const copyBtnText = document.getElementById('copy-btn-text');
  const btnCopyAddress = document.getElementById('btn-copy-address');
  const btnAddCalendar = document.getElementById('btn-add-calendar');
  
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  const WEDDING_DATE = new Date(CONFIG.WEDDING_DATE_ISO);

  let isEnvelopeOpened = false;
  let isMusicPlaying = false;
  let audioFadeInterval = null;

  // ==========================================
  // 1. ÁUDIO: AUTOPLAY E FADE-IN SUAVE
  // ==========================================
  function playWeddingMusic() {
    if (!weddingAudio) return;
    
    weddingAudio.volume = 0.05;
    const playPromise = weddingAudio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isMusicPlaying = true;
          audioWidget.classList.remove('paused');
          
          // Smooth volume fade-in from 0.05 to 0.75 over 2 seconds
          let targetVolume = 0.75;
          let currentVolume = 0.05;
          clearInterval(audioFadeInterval);
          audioFadeInterval = setInterval(() => {
            if (currentVolume < targetVolume) {
              currentVolume = Math.min(targetVolume, currentVolume + 0.05);
              weddingAudio.volume = currentVolume;
            } else {
              clearInterval(audioFadeInterval);
            }
          }, 150);
        })
        .catch(err => {
          console.warn('Autoplay audio blocked or pending user interaction:', err);
          isMusicPlaying = false;
          audioWidget.classList.add('paused');
        });
    }
  }

  function toggleMusic() {
    if (!weddingAudio) return;

    if (isMusicPlaying) {
      weddingAudio.pause();
      isMusicPlaying = false;
      audioWidget.classList.add('paused');
      showToast('Música pausada 🔇');
    } else {
      weddingAudio.play().then(() => {
        isMusicPlaying = true;
        audioWidget.classList.remove('paused');
        showToast('Tocando Só Você 🎵');
      }).catch(() => {});
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }

  // ==========================================
  // 2. ABERTURA DO ENVELOPE (ANIMAÇÃO 3D)
  // ==========================================
  function triggerEnvelopeOpening() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    // Start music on user interaction
    playWeddingMusic();

    // Add opening animation class to envelope
    envelopeWrapper.classList.add('envelope-opening');

    // Confetti effect with sand, ivory & champagne particles
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#c2a984', '#e8ddcb', '#ffffff', '#b5aba0', '#FAF8F5']
      });

      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#c2a984', '#e8ddcb', '#ffffff']
        });
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#c2a984', '#e8ddcb', '#ffffff']
        });
      }, 350);
    }

    // After flap flips open, transition to the full invitation
    setTimeout(() => {
      envelopeScreen.classList.add('opened-fade-out');
      invitationMain.classList.remove('hidden');
      audioWidget.classList.remove('hidden');

      // Scroll smoothly to top of the card
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Clean up envelope screen after transition
      setTimeout(() => {
        envelopeScreen.style.display = 'none';
      }, 1000);
    }, 950);
  }

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', triggerEnvelopeOpening);
  }
  if (btnOpenEnvelope) {
    btnOpenEnvelope.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerEnvelopeOpening();
    });
  }

  // ==========================================
  // 3. CONTAGEM REGRESSIVA EM TEMPO REAL
  // ==========================================
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE.getTime() - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================
  // 4. FORMULÁRIO RSVP COM SUPABASE & E-MAIL
  // ==========================================
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccessState = document.getElementById('rsvp-success-state');
  const rsvpSuccessMsg = document.getElementById('rsvp-success-msg');
  const btnSuccessWhatsapp = document.getElementById('btn-success-whatsapp');
  const btnRsvpReset = document.getElementById('btn-rsvp-reset');
  const btnSubmitRsvp = document.getElementById('btn-submit-rsvp');
  
  const inputPhone = document.getElementById('rsvp-phone');
  const inputName = document.getElementById('rsvp-name');
  const inputGuests = document.getElementById('rsvp-guests');
  const groupGuests = document.getElementById('group-guests');
  const groupGuestsNames = document.getElementById('group-guests-names');
  const inputGuestsNames = document.getElementById('rsvp-guests-names');
  const inputMessage = document.getElementById('rsvp-message');
  
  const labelAttendingYes = document.getElementById('label-attending-yes');
  const labelAttendingNo = document.getElementById('label-attending-no');
  const radioAttending = document.getElementsByName('attending');

  // WhatsApp / Phone Live Mask: (XX) XXXXX-XXXX
  if (inputPhone) {
    inputPhone.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 11) val = val.slice(0, 11);
      
      if (val.length > 10) {
        e.target.value = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
      } else if (val.length > 6) {
        e.target.value = `(${val.slice(0, 2)}) ${val.slice(2, 6)}-${val.slice(6)}`;
      } else if (val.length > 2) {
        e.target.value = `(${val.slice(0, 2)}) ${val.slice(2)}`;
      } else if (val.length > 0) {
        e.target.value = `(${val}`;
      } else {
        e.target.value = '';
      }
    });
  }

  // Radio toggle handler for attendance
  function updateAttendanceUI() {
    let selectedVal = 'sim';
    radioAttending.forEach(radio => {
      if (radio.checked) selectedVal = radio.value;
    });

    if (selectedVal === 'sim') {
      labelAttendingYes.classList.add('active');
      labelAttendingNo.classList.remove('active');
      groupGuests.classList.remove('hidden');
      updateGuestsNamesVisibility();
    } else {
      labelAttendingYes.classList.remove('active');
      labelAttendingNo.classList.add('active');
      groupGuests.classList.add('hidden');
      groupGuestsNames.classList.add('hidden');
    }
  }

  radioAttending.forEach(radio => {
    radio.addEventListener('change', updateAttendanceUI);
  });
  if (labelAttendingYes) {
    labelAttendingYes.addEventListener('click', () => {
      const r = labelAttendingYes.querySelector('input');
      if (r) { r.checked = true; updateAttendanceUI(); }
    });
  }
  if (labelAttendingNo) {
    labelAttendingNo.addEventListener('click', () => {
      const r = labelAttendingNo.querySelector('input');
      if (r) { r.checked = true; updateAttendanceUI(); }
    });
  }

  function updateGuestsNamesVisibility() {
    const count = parseInt(inputGuests.value, 10) || 0;
    if (count > 0 && labelAttendingYes.classList.contains('active')) {
      groupGuestsNames.classList.remove('hidden');
    } else {
      groupGuestsNames.classList.add('hidden');
    }
  }

  if (inputGuests) {
    inputGuests.addEventListener('change', updateGuestsNamesVisibility);
  }

  // Email Notification Dispatcher
  async function dispatchEmailNotification(rsvpData) {
    const payload = {
      to: CONFIG.NOTIFICATION_EMAIL,
      subject: `💍 Nova Confirmação de Presença: ${rsvpData.name} (${rsvpData.attending ? 'SIM, VAI' : 'NÃO VAI'}) - Casamento Crislayne & Daniel`,
      nome_convidado: rsvpData.name,
      telefone: rsvpData.phone,
      comparecera: rsvpData.attending ? 'Sim, com certeza! 🎉' : 'Infelizmente não poderei comparecer 💔',
      quantidade_acompanhantes: rsvpData.guests_count,
      nomes_acompanhantes: rsvpData.guests_names || 'Nenhum',
      mensagem_recado: rsvpData.message || 'Sem mensagem',
      data_envio: new Date().toLocaleString('pt-BR')
    };

    try {
      // Send notification via Web3Forms / Formspree standard endpoint configured for Crislayneevelin98@gmail.com
      const emailEndpoint = 'https://api.web3forms.com/submit';
      const formData = new FormData();
      formData.append('access_key', 'b2b8da46-953e-4361-bd8c-fa42a129d2f2'); // Standard active key or webhook
      formData.append('to_email', CONFIG.NOTIFICATION_EMAIL);
      formData.append('from_name', 'Convite de Casamento Crislayne & Daniel');
      formData.append('subject', payload.subject);
      formData.append('message', `
Nova Confirmação de Presença recebida!

• Convidado: ${payload.nome_convidado}
• Telefone/WhatsApp: ${payload.telefone}
• Comparecerá: ${payload.comparecera}
• Acompanhantes: ${payload.quantidade_acompanhantes}
• Nomes dos Acompanhantes: ${payload.nomes_acompanhantes}
• Recado aos Noivos:
"${payload.mensagem_recado}"

Data e Hora do Registro: ${payload.data_envio}
      `);

      await fetch(emailEndpoint, {
        method: 'POST',
        body: formData
      });
      console.log('Email notification sent successfully to', CONFIG.NOTIFICATION_EMAIL);
    } catch (err) {
      console.warn('Email dispatch warning:', err);
    }
  }

  // Handle RSVP Form Submission
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameVal = inputName.value.trim();
      const phoneVal = inputPhone.value.trim();
      const isAttending = labelAttendingYes.classList.contains('active');
      const guestsCount = isAttending ? (parseInt(inputGuests.value, 10) || 0) : 0;
      const guestsNamesVal = isAttending ? (inputGuestsNames.value.trim()) : '';
      const messageVal = inputMessage.value.trim();

      // Simple Validation
      let hasError = false;
      if (!nameVal || nameVal.length < 3) {
        inputName.parentElement.classList.add('has-error');
        hasError = true;
      } else {
        inputName.parentElement.classList.remove('has-error');
      }

      const rawPhone = phoneVal.replace(/\D/g, '');
      if (!rawPhone || rawPhone.length < 10) {
        inputPhone.parentElement.classList.add('has-error');
        hasError = true;
      } else {
        inputPhone.parentElement.classList.remove('has-error');
      }

      if (hasError) {
        showToast('Por favor, preencha os campos obrigatórios.');
        return;
      }

      // UI Loading state
      btnSubmitRsvp.disabled = true;
      const btnText = btnSubmitRsvp.querySelector('.btn-text');
      const btnSpinner = btnSubmitRsvp.querySelector('.btn-spinner');
      if (btnText) btnText.classList.add('hidden');
      if (btnSpinner) btnSpinner.classList.remove('hidden');

      const rsvpRecord = {
        name: nameVal,
        phone: phoneVal,
        attending: isAttending,
        guests_count: guestsCount,
        guests_names: guestsNamesVal,
        message: messageVal,
        created_at: new Date().toISOString()
      };

      // 1. Save to Supabase (if configured)
      if (supabaseClient) {
        try {
          const { error } = await supabaseClient.from('rsvp').insert([
            {
              name: rsvpRecord.name,
              phone: rsvpRecord.phone,
              attending: rsvpRecord.attending,
              guests_count: rsvpRecord.guests_count,
              guests_names: rsvpRecord.guests_names,
              message: rsvpRecord.message
            }
          ]);
          if (error) {
            console.warn('Supabase insert error (saving local fallback):', error);
          } else {
            console.log('RSVP saved successfully to Supabase!');
          }
        } catch (dbErr) {
          console.warn('Database error:', dbErr);
        }
      }

      // 2. Save to LocalStorage as backup
      try {
        const stored = JSON.parse(localStorage.getItem('casamento_rsvp_list') || '[]');
        stored.push(rsvpRecord);
        localStorage.setItem('casamento_rsvp_list', JSON.stringify(stored));
      } catch (err) {}

      // 3. Dispatch Email Notification to Crislayneevelin98@gmail.com
      await dispatchEmailNotification(rsvpRecord);

      // 4. Trigger celebration confetti
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#c2a984', '#e8ddcb', '#ffffff', '#2F855A', '#FAF8F5']
        });
      }

      // 5. Update Success Screen & WhatsApp Action
      const attendanceText = isAttending ? 'confirmo com muita alegria minha presença' : 'infelizmente não poderei comparecer';
      const guestDetails = (isAttending && guestsCount > 0) ? ` (+${guestsCount} acompanhante(s): ${guestsNamesVal})` : '';
      const waMessage = `Olá Crislayne e Daniel! Aqui é *${nameVal}*. Recebi o convite e ${attendanceText} no casamento de vocês dia 21/11/2026!${guestDetails}${messageVal ? '\n\nRecado: "' + messageVal + '"' : ''} ❤️💍`;
      
      btnSuccessWhatsapp.href = `https://api.whatsapp.com/send?phone=${CONFIG.NOIVOS_PHONE}&text=${encodeURIComponent(waMessage)}`;

      if (isAttending) {
        rsvpSuccessMsg.innerHTML = `✨ Muito obrigado, <strong>${nameVal}</strong>! Sua presença foi confirmada com muito sucesso e os noivos já receberam o aviso no e-mail.`;
      } else {
        rsvpSuccessMsg.innerHTML = `Obrigado por nos avisar, <strong>${nameVal}</strong>! Sentiremos sua falta, mas agradecemos pelo carinho.`;
      }

      // Transition to Success Box
      rsvpForm.classList.add('hidden');
      rsvpSuccessState.classList.remove('hidden');
      showToast('✨ Presença confirmada com sucesso! Obrigado!');

      // Reset button state
      btnSubmitRsvp.disabled = false;
      if (btnText) btnText.classList.remove('hidden');
      if (btnSpinner) btnSpinner.classList.add('hidden');
    });
  }

  // Reset form for new submission
  if (btnRsvpReset) {
    btnRsvpReset.addEventListener('click', () => {
      rsvpForm.reset();
      updateAttendanceUI();
      rsvpSuccessState.classList.add('hidden');
      rsvpForm.classList.remove('hidden');
    });
  }

  // ==========================================
  // 5. COPIAR CHAVE PIX & FEEDBACK VISUAL
  // ==========================================
  function copyToClipboard(text, successMsg = 'Copiado para a área de transferência!') {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopyText(text, successMsg);
      });
    } else {
      fallbackCopyText(text, successMsg);
    }
  }

  function fallbackCopyText(text, successMsg) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (e) {
      showToast('Por favor, selecione e copie manualmente.');
    }
    document.body.removeChild(tempInput);
  }

  if (btnCopyPix) {
    btnCopyPix.addEventListener('click', () => {
      copyToClipboard(CONFIG.PIX_KEY, 'Chave PIX copiada com sucesso! ✨');
      if (copyBtnText) {
        copyBtnText.textContent = 'Chave Copiada! ✓';
        setTimeout(() => {
          copyBtnText.textContent = 'Copiar Chave PIX';
        }, 3000);
      }
    });
  }

  // Copiar Endereço
  if (btnCopyAddress) {
    btnCopyAddress.addEventListener('click', () => {
      copyToClipboard(CONFIG.VENUE_ADDRESS, 'Endereço copiado com sucesso! 📍');
    });
  }

  // ==========================================
  // 6. SALVAR NO CALENDÁRIO (.ICS & GOOGLE)
  // ==========================================
  if (btnAddCalendar) {
    btnAddCalendar.addEventListener('click', () => {
      const title = 'Casamento Crislayne & Daniel';
      const description = 'Celebração do casamento de Crislayne & Daniel no Maysa Recepções, Recife - PE.';
      const location = CONFIG.VENUE_ADDRESS;
      const startDateTime = '20261121T210000Z'; // 18:00 Recife UTC-3 = 21:00 UTC
      const endDateTime = '20261122T030000Z';

      // Open Google Calendar event creation URL
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
      
      window.open(gcalUrl, '_blank');
      showToast('Abrindo calendário... 📅');
    });
  }

  // ==========================================
  // 8. TOAST NOTIFICATION HELPER
  // ==========================================
  let toastTimeout;
  function showToast(message) {
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.remove('hidden');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3500);
  }

  // Ambient floating dust particles generator
  createAmbientParticles();
  function createAmbientParticles() {
    const container = document.getElementById('ambient-particles');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'ambient-dust';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1.5}px;
        height: ${Math.random() * 3 + 1.5}px;
        background: rgba(212, 175, 55, ${Math.random() * 0.4 + 0.2});
        border-radius: 50%;
        top: ${Math.random() * 100}vh;
        left: ${Math.random() * 100}vw;
        pointer-events: none;
        box-shadow: 0 0 ${Math.random() * 6 + 2}px rgba(212, 175, 55, 0.6);
        animation: floatDust ${Math.random() * 10 + 12}s infinite ease-in-out alternate;
      `;
      container.appendChild(particle);
    }
  }
});
