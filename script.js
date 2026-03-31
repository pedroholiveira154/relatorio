
function gerar(pdf = false, print = false) {

    // 1. Mapeamento c1..c8 → r1..r8 (base da aula)
    for (let i = 1; i <= 8; i++) {
        const campo = document.getElementById(`c${i}`);
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
        const desc = document.getElementById(`i${i}d`).value || `Item ${i}`;
        const qtd = parseFloat(document.getElementById(`i${i}q`).value) || 0;
        const un = document.getElementById(`i${i}un`).value || 'UN';
        const tot = parseFloat(document.getElementById(`i${i}t`).value.replace(',', '.')) || (qtd * un);

        totalGeral += tot;

        // Cria a linha da tabela
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i}</td>
            <td>${desc}</td>
            <td style="text-align:right">${qtd}</td>
            <td style="text-align:right">${un}</td>
            <td style="text-align:right">R$ ${un.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            <td style="text-align:right">R$ ${tot.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        `;
        tbody.appendChild(tr);
    }

    // 4. Atualiza o total geral no rodapé da tabela
    document.getElementById('total-geral').textContent =
        'R$ ' + totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    // 5. Exibe o relatório (era invisível / fora da tela)
    const relatorio = document.getElementById('relatorio');
    relatorio.style.visibility = 'visible';
    relatorio.style.position = 'static';
    relatorio.classList.add('visivel');

    // 6. PDF ou Impressão
    if (pdf) {
        relatorio.style.width    = '794px';
        relatorio.style.maxWidth = '794px';
        html2pdf()
            .set({
                margin:      [0, 0, 0, 0],
                filename:    'pedido-compra-pedro-inc.pdf',
                image:       { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale:      1.5,        // qualidade sem estourar memória
                    useCORS:    true,
                    width:      794,        // captura exatamente a largura A4
                    windowWidth: 794        // simula viewport de 794px
                },
                jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' }
                //        ↑ px em vez de mm evita conversão que causa corte
            })
            .from(relatorio)
            .save()
            .then(() => {
                // Restaura o tamanho visual após gerar o PDF
                relatorio.style.width    = '';
                relatorio.style.maxWidth = '';
            });
 
    } else if (print) {
        window.print();
    }
}
// ── Pré-preenche data atual e número de pedido aleatório ──
const hoje = new Date();
document.getElementById('c1').value = hoje.toLocaleDateString('pt-BR');
document.getElementById('c2').value =
    'PC-' + hoje.getFullYear() + '-' + String(Math.floor(Math.random() * 900) + 100);
