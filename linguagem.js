// ==========================================
// PÁGINAS DE LINGUAGEM: cores, copiar, executar
// ==========================================

// Prism: aponta o carregador para o mesmo CDN (carrega a gramática da linguagem da página)
if (window.Prism && Prism.plugins && Prism.plugins.autoloader) {
    Prism.plugins.autoloader.languages_path =
        'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
}

// COPIAR CÓDIGO
const copyBtn = document.getElementById('copyBtn');
const codeBlock = document.getElementById('codeBlock');

if (copyBtn && codeBlock) {
    function fallbackCopy(text) {
        const area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(area);
    }

    copyBtn.addEventListener('click', function () {
        const text = codeBlock.innerText;
        const done = function () {
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(function () { copyBtn.innerHTML = '<i class="far fa-copy"></i>'; }, 2000);
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
        } else {
            fallbackCopy(text);
            done();
        }
    });
}

// EXECUTAR EXEMPLO (mostra a saída do exemplo, linha por linha)
const runBtn = document.getElementById('runBtn');
const panel = document.getElementById('outputPanel');

if (runBtn && panel) {
    const label = runBtn.querySelector('span');
    const icon = runBtn.querySelector('i');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer = null;

    runBtn.addEventListener('click', function () {
        clearInterval(timer);
        panel.hidden = false;
        label.textContent = panel.dataset.mode === 'preview' ? 'Ver de novo' : 'Executar de novo';
        icon.className = 'fas fa-rotate-right';

        if (panel.dataset.mode !== 'console') return;

        const body = document.getElementById('outputBody');
        const lines = JSON.parse(panel.dataset.lines);
        body.innerHTML = '';

        function addLine(text, index) {
            const row = document.createElement('div');
            if (index === 0) row.className = 'cmd';
            row.textContent = text;
            body.appendChild(row);
        }

        if (reduceMotion) {
            lines.forEach(addLine);
            return;
        }

        let i = 0;
        addLine(lines[i], i);
        i++;
        timer = setInterval(function () {
            if (i >= lines.length) { clearInterval(timer); return; }
            addLine(lines[i], i);
            i++;
        }, 380);
    });
}
