// ═══════════════════════════════════════════════
// script.js — Pedido de Compra Pedro.INC
// ═══════════════════════════════════════════════

function gerar(pdf = false, print = false) {

    // 1. Mapeamento c1..c8 → r1..r8 (base da aula)
    for (let i = 1; i <= 8; i++) {
        const campo     = document.getElementById(`c${i}`);
        const resultado = document.getElementById(`r${i}`);
        if (campo && resultado) {
            resultado.textContent = campo.value || '—';
        }
    }

    // 2. Observações (campo extra fora do c1..c8)
    document.getElementById('r-obs').textContent =
        document.getElementById('cobs').value || 'Sem observações.';

    // 3. Monta a tabela de 8 itens
    const tbody = document.getElementById('tabela-itens');
    tbody.innerHTML = ''; // limpa antes de re-gerar
    let totalGeral = 0;

    for (let i = 1; i <= 8; i++) {
        const desc = document.getElementById(`i${i}d`).value  || `Item ${i}`;
        const qtd  = parseFloat(document.getElementById(`i${i}q`).value)                     || 0;
        const un   = document.getElementById(`i${i}un`).value || 'UN';
        const unit = parseFloat(document.getElementById(`i${i}u`).value.replace(',', '.'))   || 0;
        const tot  = parseFloat(document.getElementById(`i${i}t`).value.replace(',', '.'))   || (qtd * unit);

        totalGeral += tot;

        // Cria a linha da tabela
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i}</td>
            <td>${desc}</td>
            <td style="text-align:right">${qtd}</td>
            <td style="text-align:right">${un}</td>
            <td style="text-align:right">R$ ${unit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            <td style="text-align:right">R$ ${tot.toLocaleString('pt-BR',  { minimumFractionDigits: 2 })}</td>
        `;
        tbody.appendChild(tr);
    }

    // 4. Atualiza o total geral no rodapé da tabela
    document.getElementById('total-geral').textContent =
        'R$ ' + totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    // 5. Exibe o relatório (era invisível / fora da tela)
    const relatorio = document.getElementById('relatorio');
    relatorio.style.visibility = 'visible';
    relatorio.style.position   = 'static';
    relatorio.classList.add('visivel');

    // 6. PDF ou Impressão
    if (pdf) {
        html2pdf()
            .set({
                margin:     0,
                filename:   'pedido-compra-pedro-inc.pdf',
                image:      { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF:      { unit: 'mm', format: 'a4', orientation: 'portrait' }
            })
            .from(relatorio)
            .save();
    } else if (print) {
        window.print();
    }
}

// ── Pré-preenche data atual e número de pedido aleatório ──
const hoje = new Date();
document.getElementById('c1').value = hoje.toLocaleDateString('pt-BR');
document.getElementById('c2').value =
    'PC-' + hoje.getFullYear() + '-' + String(Math.floor(Math.random() * 900) + 100);