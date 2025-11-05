// view.js — DOM rendering & events
const View = (function(){
  // helpers
  function $(id){ return document.getElementById(id); }
  function escapeHtml(s){ return (''+s).replace(/[&<>"'`]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[m])); }

  // render functions
  function renderBooks(books, borrowed){
    const grid = $('booksGrid'); grid.innerHTML = '';
    books.forEach(book => {
      const copiesBorrowed = borrowed.filter(b => b.bookId === book.id).length;
      const available = Math.max(0, (book.copies||1) - copiesBorrowed);
      const card = document.createElement('div'); card.className='book';
      card.innerHTML = `
        <h3>${escapeHtml(book.title)}</h3>
        <div class="muted">${escapeHtml(book.author)} • ${escapeHtml(book.category)}</div>
        <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
          <div class="small">${available} copy(ies) available</div>
          <div>${ available > 0 ? `<button class="btn" data-borrow="${book.id}">Borrow</button>` : `<span class="muted">Unavailable</span>` }</div>
        </div>
      `;
      grid.appendChild(card);
    });

    // attach events
    document.querySelectorAll('[data-borrow]').forEach(btn=>{
      btn.addEventListener('click', e => {
        const id = parseInt(e.currentTarget.getAttribute('data-borrow'),10);
        Controller.handleBorrow(id);
      });
    });
  }

  function renderBorrowed(borrowed, books){
    const tbody = document.querySelector('#borrowedTable tbody');
    tbody.innerHTML = '';
    if(borrowed.length===0){
      tbody.innerHTML = '<tr><td colspan="4" class="muted small">No borrowed records</td></tr>';
      return;
    }
    borrowed.forEach((b,i) => {
      const book = books.find(x => x.id === b.bookId) || {title:'[deleted]'};
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${escapeHtml(book.title)}</td><td>${escapeHtml(b.borrower)}</td><td>${escapeHtml(b.date)}</td>
        <td><button class="btn ghost" data-return="${i}">Mark Returned</button></td>`;
      tbody.appendChild(tr);
    });

    document.querySelectorAll('[data-return]').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const idx = parseInt(e.currentTarget.getAttribute('data-return'),10);
        Controller.handleReturn(idx);
      });
    });
  }

  // modal / admin UI
  function showModal(){ $('loginModal').style.display='flex'; }
  function hideModal(){ $('loginModal').style.display='none'; }
  function showAdmin(){ $('adminPanel').style.display='block'; $('openLoginBtn').style.display='none'; }
  function hideAdmin(){ $('adminPanel').style.display='none'; $('openLoginBtn').style.display='inline-block'; }

  // init & wire global events
  function init(renderBooksFn, renderBorrowFn){
    // render initial
    renderBooksFn(); renderBorrowFn();

    // buttons
    $('refreshBtn').addEventListener('click', ()=>{ renderBooksFn(); renderBorrowFn(); });
    $('openLoginBtn').addEventListener('click', showModal);
    $('cancelLoginBtn').addEventListener('click', hideModal);
    $('loginBtn').addEventListener('click', ()=> {
      const u = $('loginUser').value; const p = $('loginPass').value;
      Controller.handleLogin(u,p);
    });
    $('logoutBtn').addEventListener('click', ()=> Controller.handleLogout());

    $('addBookBtn').addEventListener('click', ()=>{
      const title = $('titleInput').value.trim();
      const author = $('authorInput').value.trim();
      const category = $('categoryInput').value.trim() || 'General';
      const copies = parseInt($('copiesInput').value || '1',10) || 1;
      if(!title || !author){ alert('Enter title and author'); return; }
      Controller.handleAddBook({title,author,category,copies});
      $('titleInput').value=''; $('authorInput').value=''; $('categoryInput').value=''; $('copiesInput').value='1';
    });
  }

  return { init, renderBooks, renderBorrowed, showModal, hideModal, showAdmin, hideAdmin };
})();
