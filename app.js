/**
 * ==========================================================================
 * CONVITE DE CASAMENTO - CRISLAYNE & DANIEL
 * Baseado na arquitetura, animações e interações de jo-e-val.vercel.app
 * ==========================================================================
 */

// ==========================================
// 1. CONFIGURAÇÃO & SUPABASE INITIALIZER
// ==========================================
const CONFIG = window.WEDDING_CONFIG || {
  SUPABASE_URL: "https://ulqcevrqyfqlhvezreea.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_Fi8BI47PW_1mj3Iuj_aHDA_p5DZqbP4",
  NOTIFICATION_EMAIL: "Crislayneevelin98@gmail.com",
  NOIVOS_PHONE: "5581996946988",
  PIX_KEY: "81996946988",
  PIX_NAME: "Crislayne Evelin",
  WEDDING_DATE_ISO: "2026-11-21T18:00:00-03:00",
  VENUE_NAME: "Maysa Recepções",
  VENUE_ADDRESS: "R. Prof. José Amarino dos Réis, 919-881 - Linha do Tiro, Recife - PE, 52131-320"
};

let supabaseClient = null;
if (typeof supabase !== 'undefined' && supabase.createClient && CONFIG.SUPABASE_URL) {
  try {
    supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
    console.log("✅ Supabase inicializado com sucesso.");
  } catch (err) {
    console.warn("Aviso ao inicializar Supabase:", err);
  }
}

// ==========================================
// 2. GERENCIADOR DE ÁUDIO & SINCRONIZAÇÃO VISUAL
// ==========================================
function atualizarEstadoMusica(estaTocando) {
  const btnIcon = document.getElementById('music-icon');
  const waveBars = document.getElementById('music-wave-bars');
  const floatingDisc = document.getElementById('floating-disc-icon');
  const floatingText = document.getElementById('floating-music-text');

  if (btnIcon) {
    btnIcon.className = estaTocando ? 'fa-solid fa-pause' : 'fa-solid fa-music';
  }

  if (waveBars) {
    if (estaTocando) {
      waveBars.classList.add('playing');
    } else {
      waveBars.classList.remove('playing');
    }
  }

  if (floatingDisc) {
    if (estaTocando) {
      floatingDisc.classList.remove('paused');
    } else {
      floatingDisc.classList.add('paused');
    }
  }

  if (floatingText) {
    floatingText.textContent = estaTocando ? 'Pausar' : 'Só Você';
  }
}

// Controle Manual de Play / Pause do Áudio
window.toggleMusic = function() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  if (audio.paused) {
    audio.play().then(() => {
      atualizarEstadoMusica(true);
      exibirToast('<i class="fa-solid fa-music" style="color: #4CAF50; margin-right: 6px;"></i> Tocando: Só Você — Anderson Freire 🎵');
    }).catch(err => console.log("Erro ao tocar áudio:", err));
  } else {
    audio.pause();
    atualizarEstadoMusica(false);
    exibirToast('Música pausada 🔇');
  }
};

// ==========================================
// 3. ANIMAÇÃO DE ABERTURA DO ENVELOPE (3D BOHO CHIC)
// ==========================================
window.abrirConviteComAnimacao = function() {
  const cover = document.getElementById('cover');
  const envelopeContainer = document.getElementById('envelope-container');
  const audio = document.getElementById('bg-music');

  // Previne múltiplos acionamentos
  if (envelopeContainer && envelopeContainer.classList.contains('opening')) {
    return;
  }

  // Prepara áudio
  if (audio) {
    try { audio.load(); } catch (e) {}
  }

  // 1. Dispara animação 3D da aba do envelope e elevação do convite
  if (envelopeContainer) {
    envelopeContainer.classList.add('opening');
  }

  // Efeito de confetes festivos
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#c2a984', '#e8ddcb', '#ffffff', '#8C3F2B', '#C59B4E']
    });
  }

  // 2. Transição visual suave para a página principal (fade out da capa)
  setTimeout(() => {
    if (cover) {
      cover.classList.add('aberto');
    }
    document.body.style.overflow = 'auto';
  }, 1000);

  // 3. Conclusão total: capa removida -> TOCA A MÚSICA
  setTimeout(() => {
    if (cover) {
      cover.style.display = 'none';
    }

    // 🎵 A música toca aqui suavemente
    if (audio && audio.paused) {
      audio.volume = 0.5;
      audio.play().then(() => {
        atualizarEstadoMusica(true);
      }).catch(err => {
        console.log("Áudio iniciado após abertura:", err);
      });
    }
  }, 1600);
};

function abrirConviteComAnimacao() {
  window.abrirConviteComAnimacao();
}

// ==========================================
// 4. DINÂMICA DO FORMULÁRIO RSVP
// ==========================================
function atualizarFormularioRsvp() {
  const selectStatus = document.getElementById('rsvp-status');
  const boxAcompWrapper = document.getElementById('box-tem-acompanhante-wrapper');
  const boxQtdAcomp = document.getElementById('box-qtd-acompanhantes');
  const btnSubmit = document.getElementById('btn-rsvp');

  if (!selectStatus || !btnSubmit) return;

  const valor = selectStatus.value;
  const naoVai = valor.toLowerCase().includes('não') || valor.toLowerCase().includes('nao');

  if (naoVai) {
    btnSubmit.innerText = 'Enviar Resposta';
    if (boxAcompWrapper) boxAcompWrapper.style.display = 'none';
    if (boxQtdAcomp) boxQtdAcomp.style.display = 'none';
  } else {
    btnSubmit.innerText = 'Confirmar Presença';
    if (boxAcompWrapper) boxAcompWrapper.style.display = 'block';
    const selectAcomp = document.getElementById('rsvp-tem-acompanhante');
    if (selectAcomp && selectAcomp.value === 'Sim') {
      if (boxQtdAcomp) boxQtdAcomp.style.display = 'block';
    }
  }
}

window.toggleAcompanhantes = function(valor) {
  const box = document.getElementById('box-qtd-acompanhantes');
  if (box) {
    box.style.display = (valor === 'Sim') ? 'block' : 'none';
  }
};

// ==========================================
// 5. MURAL DE RECADOS (SUPABASE + LOCALSTORAGE)
// ==========================================
const MURAL_STORAGE_KEY = 'casamento_crislayne_daniel_recados';

function obterRecadosLocais() {
  try {
    return JSON.parse(localStorage.getItem(MURAL_STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function salvarRecadoLocal(recado) {
  try {
    const lista = obterRecadosLocais();
    lista.unshift(recado);
    localStorage.setItem(MURAL_STORAGE_KEY, JSON.stringify(lista.slice(0, 50)));
  } catch (e) {}
}

function renderizarMural(lista) {
  const wallContainer = document.getElementById('mural-lista');
  if (!wallContainer) return;

  if (!lista || lista.length === 0) {
    wallContainer.innerHTML = `
      <div class="mural-empty-box">
        <p>Seja o primeiro a deixar um recado carinhoso para os noivos! 🤍</p>
      </div>
    `;
    return;
  }

  wallContainer.innerHTML = lista.map(r => {
    const autorNome = r.nome || r.autor || 'Convidado';
    const dataFormatada = r.created_at 
      ? new Date(r.created_at).toLocaleDateString('pt-BR') 
      : new Date().toLocaleDateString('pt-BR');
    return `
      <div class="mural-item">
        <div class="mural-header">
          <p class="mural-author">
            <i class="fa-solid fa-heart" style="font-size: 0.75rem; margin-right: 4px; color: #8C3F2B;"></i> ${autorNome}
          </p>
          <span class="mural-date">${dataFormatada}</span>
        </div>
        <p class="mural-msg">${r.mensagem || ''}</p>
      </div>
    `;
  }).join('');
}

async function carregarRecados() {
  const wallContainer = document.getElementById('mural-lista');
  if (!wallContainer) return;

  const locais = obterRecadosLocais();
  if (locais.length > 0) {
    renderizarMural(locais);
  }

  if (supabaseClient) {
    try {
      const { data: recados, error } = await supabaseClient
        .from('recados')
        .select('*')
        .order('id', { ascending: false });

      if (!error && recados && recados.length > 0) {
        const textos = new Set(recados.map(r => (r.mensagem || '') + (r.nome || r.autor || '')));
        const extras = locais.filter(l => !textos.has((l.mensagem || '') + (l.nome || l.autor || '')));
        renderizarMural([...extras, ...recados]);
      } else if (locais.length === 0) {
        renderizarMural([]);
      }
    } catch (err) {
      console.log("Aviso ao buscar recados no Supabase:", err);
      if (locais.length === 0) renderizarMural([]);
    }
  }
}

// ==========================================
// 6. CÓPIA UNIVERSAL (CLIPBOARD + FALLBACK)
// ==========================================
function copiarTextoUniversal(texto) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(texto).catch(() => copiarFallback(texto));
  }
  return copiarFallback(texto);
}

function copiarFallback(texto) {
  return new Promise((resolve, reject) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = texto;
      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      textArea.style.left = "-9999px";
      textArea.setAttribute("readonly", "");
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, 99999);
      const copiado = document.execCommand("copy");
      document.body.removeChild(textArea);
      if (copiado) resolve();
      else reject(new Error("Falha ao copiar"));
    } catch (err) {
      reject(err);
    }
  });
}

// ==========================================
// 7. TOAST NOTIFICATION
// ==========================================
function exibirToast(mensagem) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerHTML = mensagem;
    toast.classList.add('show');
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  } else {
    alert(mensagem.replace(/<[^>]*>?/gm, ''));
  }
}

// ==========================================
// 8. CONTAGEM REGRESSIVA EM TEMPO REAL
// ==========================================
function iniciarContagemRegressiva() {
  const weddingDate = new Date(CONFIG.WEDDING_DATE_ISO).getTime();
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  function atualizar() {
    const agora = new Date().getTime();
    const distancia = weddingDate - agora;

    if (distancia <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const d = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const h = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distancia % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');
  }

  atualizar();
  setInterval(atualizar, 1000);
}

// ==========================================
// 9. INICIALIZAÇÃO APÓS DOM PRONTO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Áudio pausado inicialmente
  const audio = document.getElementById('bg-music');
  if (audio) {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (e) {}
  }
  atualizarEstadoMusica(false);

  // 2. Eventos de abertura da capa
  const btnAbrir = document.getElementById('btn-abrir');
  if (btnAbrir) btnAbrir.onclick = window.abrirConviteComAnimacao;

  const flap = document.getElementById('envelope-flap');
  if (flap) flap.onclick = window.abrirConviteComAnimacao;

  const seal = document.getElementById('wax-seal-btn');
  if (seal) seal.onclick = window.abrirConviteComAnimacao;

  // 3. Form RSVP dinamismo
  const selectStatus = document.getElementById('rsvp-status');
  if (selectStatus) {
    selectStatus.addEventListener('change', atualizarFormularioRsvp);
    atualizarFormularioRsvp();
  }

  // Máscara de Telefone
  const telInput = document.getElementById('rsvp-telefone');
  if (telInput) {
    telInput.addEventListener('input', (e) => {
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

  // 4. Copiar Pix com feedback tátil e visual
  const btnPix = document.getElementById('btn-copiar-pix');
  if (btnPix) {
    btnPix.addEventListener('click', async () => {
      if (navigator.vibrate) navigator.vibrate(50);
      const pixKey = CONFIG.PIX_KEY;

      try {
        await copiarTextoUniversal(pixKey);

        const textoOriginal = btnPix.innerHTML;
        btnPix.style.background = "#2E7D32";
        btnPix.style.color = "#FFFFFF";
        btnPix.innerHTML = '<i class="fa-solid fa-check" style="margin-right: 0.4rem;"></i><span>Chave Pix Copiada!</span>';

        const avisoFixo = document.getElementById('pix-copiado-aviso');
        if (avisoFixo) avisoFixo.style.display = 'block';

        exibirToast('<i class="fa-solid fa-circle-check" style="color: #4CAF50; margin-right: 6px;"></i> <strong>Chave Pix Copiada!</strong><br>Abra o app do seu banco e cole.');

        setTimeout(() => {
          btnPix.style.background = "";
          btnPix.style.color = "";
          btnPix.innerHTML = textoOriginal;
        }, 4000);
      } catch (err) {
        prompt("Copie a chave Pix abaixo:", pixKey);
      }
    });
  }

  // Copiar Endereço
  const btnCopyAddress = document.getElementById('btn-copy-address');
  if (btnCopyAddress) {
    btnCopyAddress.addEventListener('click', async () => {
      await copiarTextoUniversal(CONFIG.VENUE_ADDRESS);
      exibirToast('<i class="fa-solid fa-location-dot" style="color: #4CAF50; margin-right: 6px;"></i> Endereço copiado com sucesso! 📍');
    });
  }

  // Salvar no Calendário
  const btnAddCalendar = document.getElementById('btn-add-calendar');
  if (btnAddCalendar) {
    btnAddCalendar.addEventListener('click', () => {
      const title = 'Casamento Crislayne & Daniel';
      const description = 'Celebração de casamento de Crislayne & Daniel no Maysa Recepções, Recife - PE.';
      const location = CONFIG.VENUE_ADDRESS;
      const startDateTime = '20261121T210000Z'; // 18:00 Recife UTC-3 = 21:00 UTC
      const endDateTime = '20261122T030000Z';
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
      window.open(gcalUrl, '_blank');
      exibirToast('Abrindo calendário... 📅');
    });
  }

  // 5. Submit RSVP Form
  const formRsvp = document.getElementById('form-rsvp');
  if (formRsvp) {
    formRsvp.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnSubmit = document.getElementById('btn-rsvp');
      const textoOriginal = btnSubmit ? btnSubmit.innerText : 'Confirmar Presença';

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerText = 'Enviando resposta...';
      }

      const inputNome = document.getElementById('rsvp-nome');
      const inputTel = document.getElementById('rsvp-telefone');
      const selectStatus = document.getElementById('rsvp-status');
      const selectAcomp = document.getElementById('rsvp-tem-acompanhante');
      const inputQtd = document.getElementById('rsvp-qtd-acompanhantes');
      const inputNomesAcomp = document.getElementById('rsvp-nomes-acompanhantes');
      const inputMsg = document.getElementById('rsvp-mensagem');

      const nome = inputNome ? inputNome.value.trim() : '';
      const telefone = inputTel ? inputTel.value.trim() : '';
      const status = selectStatus ? selectStatus.value : 'Sim, estarei presente!';
      const naoVai = status.toLowerCase().includes('não') || status.toLowerCase().includes('nao');
      const temAcomp = (!naoVai && selectAcomp) ? selectAcomp.value : 'Não';
      const qtdAcomp = (!naoVai && temAcomp === 'Sim' && inputQtd) ? parseInt(inputQtd.value, 10) || 1 : 0;
      const nomesAcomp = (!naoVai && temAcomp === 'Sim' && inputNomesAcomp) ? inputNomesAcomp.value.trim() : '';
      const mensagem = inputMsg ? inputMsg.value.trim() : '';

      if (!nome) {
        alert('Por favor, preencha o seu nome completo.');
        if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.innerText = textoOriginal; }
        return;
      }

      try {
        // 1. Gravação no Supabase (tabela 'rsvp')
        if (supabaseClient) {
          const { error: dbErr } = await supabaseClient.from('rsvp').insert([{
            name: nome,
            phone: telefone,
            attending: !naoVai,
            guests_count: qtdAcomp,
            guests_names: nomesAcomp || (temAcomp === 'Sim' ? `${qtdAcomp} acompanhante(s)` : 'Nenhum'),
            message: mensagem
          }]);
          if (dbErr) console.warn("Aviso Supabase rsvp:", dbErr.message);
        }

        // 2. Envio de Notificação por E-mail para Crislayneevelin98@gmail.com
        const emailDestino = CONFIG.NOTIFICATION_EMAIL || 'Crislayneevelin98@gmail.com';
        const dataHora = new Date().toLocaleString('pt-BR');

        try {
          await fetch(`https://formsubmit.co/ajax/${emailDestino}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              _subject: naoVai
                ? `[Casamento Crislayne & Daniel] Não comparecerá: ${nome}`
                : `💍 [Casamento Crislayne & Daniel] CONFIRMAÇÃO: ${nome} ${temAcomp === 'Sim' ? `(+${qtdAcomp} acomp.)` : '(Sem acomp.)'}`,
              _template: 'table',
              _captcha: 'false',
              "Convidado": nome,
              "Telefone": telefone,
              "Presença": naoVai ? "Não comparecerá" : "Confirmada (Irá comparecer!)",
              "Acompanhantes": naoVai ? "Não se aplica" : (temAcomp === 'Sim' ? `Sim (${qtdAcomp}: ${nomesAcomp || 'Não informado'})` : "Não (irá sozinho)"),
              "Recado aos Noivos": mensagem || "Nenhum recado",
              "Data do Registro": dataHora
            })
          });
        } catch (fsErr) {
          console.log("FormSubmit aviso:", fsErr);
        }

        if (navigator.vibrate) navigator.vibrate(50);

        // Confetes se for confirmação positiva
        if (!naoVai && typeof confetti === 'function') {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#c2a984', '#e8ddcb', '#ffffff', '#8C3F2B', '#2E7D32']
          });
        }

        const msgSucesso = naoVai
          ? `Obrigado por nos avisar, ${nome}! Agradecemos o carinho e sua resposta foi registrada.`
          : `🎉 Presença confirmada, ${nome}! Mal podemos esperar para comemorar juntos!`;

        exibirToast(msgSucesso);
        alert(msgSucesso);
        formRsvp.reset();
        atualizarFormularioRsvp();

      } catch (err) {
        console.error("Erro ao enviar RSVP:", err);
        const msgFallback = `Obrigado, ${nome}! Sua resposta foi registrada com sucesso.`;
        exibirToast(msgFallback);
        alert(msgFallback);
      } finally {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerText = textoOriginal;
        }
      }
    });
  }

  // 6. Submit Mural de Recados
  const formMsg = document.getElementById('messageForm');
  if (formMsg) {
    formMsg.addEventListener('submit', async (e) => {
      e.preventDefault();

      const autorInput = document.getElementById('msgAuthor');
      const msgInput = document.getElementById('msgContent');
      const nome = autorInput ? autorInput.value.trim() : '';
      const mensagem = msgInput ? msgInput.value.trim() : '';

      if (!nome || !mensagem) return;

      const novoRecado = {
        nome: nome,
        autor: nome,
        mensagem: mensagem,
        created_at: new Date().toISOString()
      };

      salvarRecadoLocal(novoRecado);
      carregarRecados();
      formMsg.reset();

      if (navigator.vibrate) navigator.vibrate(30);
      exibirToast("❤️ Mensagem publicada no mural com sucesso!");

      if (supabaseClient) {
        supabaseClient.from('recados').insert([{
          nome: nome,
          autor: nome,
          mensagem: mensagem
        }]).then(({ error }) => {
          if (error) console.log("Aviso Supabase recados:", error.message);
        }).catch(err => console.log("Aviso Supabase recados:", err));
      }
    });
  }

  // 7. Iniciar Mural e Contagem
  carregarRecados();
  iniciarContagemRegressiva();
});
