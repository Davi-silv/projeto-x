      
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
const token = localStorage.getItem('gestaomei_token');
if (token) {
  fetch('http://localhost:3001/produtos', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(response => {
      if (!response.ok) throw new Error('Não autorizado');
      return response.json();
    })
    .then(produtos => {
      const lista = document.getElementById('produtos-lista');
      const filtro = document.getElementById('filtro-produtos');
      function renderProdutos(filtrar = '') {
        const filtrados = produtos.filter(produto =>
          produto.nome.toLowerCase().includes(filtrar.toLowerCase()) ||
          produto.descricao.toLowerCase().includes(filtrar.toLowerCase())
        );
        lista.innerHTML = filtrados.map((produto, i) => `
          <div class="produto-card fade-in" style="animation-delay:${i * 80}ms">
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <a href="${produto.link}" class="saiba-mais-btn" target="_blank">Saiba mais</a>
          </div>
        `).join('');
      }
      if (lista) renderProdutos();
      if (filtro) {
        filtro.addEventListener('input', e => {
          renderProdutos(e.target.value);
        });
      }
    })
    .catch(err => {
      const lista = document.getElementById('produtos-lista');
      if (lista) lista.innerHTML = '<div style="color:#d32f2f;">Acesso não autorizado. Faça login para ver os produtos.</div>';
    });
} else {
  const lista = document.getElementById('produtos-lista');
  if (lista) lista.innerHTML = '<div style="color:#d32f2f;">Faça login para ver os produtos.</div>';
}

// Animação de entrada para os cards de produtos e seções
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.1 });
function observarFadeIn() {
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}
setTimeout(observarFadeIn, 800);

// Botão de voltar ao topo
const voltarTopo = document.getElementById('voltar-topo');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    voltarTopo.style.display = 'block';
  } else {
    voltarTopo.style.display = 'none';
  }
});
if (voltarTopo) {
  voltarTopo.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Validação de formulário de contato
const contatoForm = document.querySelector('.contact form');
if (contatoForm) {
  contatoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const [nome, email, mensagem] = this.querySelectorAll('input, textarea');
    let erro = '';
    if (!nome.value.trim()) erro = 'Por favor, preencha seu nome.';
    else if (!email.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) erro = 'E-mail inválido.';
    else if (!mensagem.value.trim()) erro = 'Descreva como podemos ajudar.';
    let msgDiv = this.querySelector('.form-msg');
    if (!msgDiv) {
      msgDiv = document.createElement('div');
      msgDiv.className = 'form-msg';
      this.appendChild(msgDiv);
    }
    if (erro) {
      msgDiv.textContent = erro;
      msgDiv.style.color = '#d32f2f';
      return;
    }
    msgDiv.textContent = 'Mensagem enviada com sucesso!';
    msgDiv.style.color = '#388e3c';
    this.reset();
    setTimeout(() => { msgDiv.textContent = ''; }, 4000);
  });
} 