// Script des particules animées
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = Array.from({ length: 80 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2 + 1,
  dx: Math.random() - 0.5,
  dy: Math.random() - 0.5,
}));

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  }
  requestAnimationFrame(draw);
}

draw();

// Script des calculs financiers + graphiques
const form = document.getElementById('financeForm');
const resultat = document.getElementById('resultat');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const data = new FormData(form);
  const matin = ['mtn_matin', 'moov_matin', 'celtis_matin', 'cash_matin'].map(k => parseFloat(data.get(k)) || 0);
  const soir = ['mtn_soir', 'moov_soir', 'celtis_soir', 'cash_soir'].map(k => parseFloat(data.get(k)) || 0);

  const total_matin = matin.reduce((a, b) => a + b);
  const total_soir = soir.reduce((a, b) => a + b);
  const diff_numerique = (matin[0] + matin[1] + matin[2]) - (soir[0] + soir[1] + soir[2]);
  const diff_cash = soir[3] - matin[3];

  let message = `💰 Total matin : ${total_matin} F CFA<br>💰 Total soir : ${total_soir} F CFA<br>`;
  if (Math.abs(diff_numerique - diff_cash) < 1) {
    message += "✅ Tes finances sont équilibrées !";
  } else {
    message += "⚠️ Il semble y avoir une incohérence dans les mouvements !";
  }
  resultat.innerHTML = message;

  renderBarChart(matin, soir);
  renderDonutChart(soir);
});

function renderBarChart(matin, soir) {
  const ctx = document.getElementById('barChart').getContext('2d');
  if (window.barChart) window.barChart.destroy();
  window.barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['MTN', 'Moov', 'Celtis', 'Espèces'],
      datasets: [
        {
          label: 'Matin',
          data: matin,
          backgroundColor: 'rgba(59, 130, 246, 0.6)'
        },
        {
          label: 'Actuel',
          data: soir,
          backgroundColor: 'rgba(16, 185, 129, 0.6)'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Comparaison des montants' }
      }
    }
  });
}

function renderDonutChart(soir) {
  const ctx = document.getElementById('donutChart').getContext('2d');
  if (window.donutChart) window.donutChart.destroy();
  window.donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['MTN', 'Moov', 'Celtis', 'Espèces'],
      datasets: [
        {
          data: soir,
          backgroundColor: ['#3B82F6', '#FACC15', '#9333EA', '#10B981']
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Répartition actuelle' }
      }
    }
  });
}
