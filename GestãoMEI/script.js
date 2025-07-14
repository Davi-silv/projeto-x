      
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}); 

// Newsletter/Lead Capture
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    const messageDiv = document.getElementById('newsletter-message');
    if (emailInput.value.trim() === '') {
      messageDiv.textContent = 'Por favor, insira um e-mail válido.';
      messageDiv.style.color = '#d32f2f';
      return;
    }
    // Simulação de envio
    messageDiv.textContent = 'Cadastro realizado com sucesso!';
    messageDiv.style.color = '#388e3c';
    emailInput.value = '';
    setTimeout(() => {
      messageDiv.textContent = '';
    }, 4000);
  });
} 

// Produtos Financeiros (cards dinâmicos)
fetch('produtos.json')
  .then(response => response.json())
  .then(produtos => {
    const lista = document.getElementById('produtos-lista');
    if (lista && Array.isArray(produtos)) {
      lista.innerHTML = produtos.map(produto => `
        <div class="produto-card">
          <h3>${produto.nome}</h3>
          <p>${produto.descricao}</p>
          <a href="${produto.link}" class="saiba-mais-btn" target="_blank">Saiba mais</a>
        </div>
      `).join('');
    }
  }); 