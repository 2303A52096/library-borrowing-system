// controller.js — orchestrates user actions
const Controller = (function(Model, View){
  function init(){
    Model.seed();
    View.init(renderBooks, renderBorrowed);
    if(Model.isAdminLogged()){
      View.showAdmin();
      renderBorrowed();
    }
  }

  function renderBooks(){
    const books = Model.getBooks();
    const borrowed = Model.getBorrowed();
    View.renderBooks(books, borrowed);
  }

  function renderBorrowed(){
    const borrowed = Model.getBorrowed();
    const books = Model.getBooks();
    View.renderBorrowed(borrowed, books);
  }

  function handleBorrow(bookId){
    const books = Model.getBooks();
    const book = books.find(b => b.id === bookId);
    const borrowed = Model.getBorrowed();
    const copiesBorrowed = borrowed.filter(b => b.bookId === bookId).length;
    if(copiesBorrowed >= (book.copies||1)){
      alert('No copies available');
      return;
    }
    Model.borrowBook(bookId);
    renderBooks();
    renderBorrowed();
    alert('Book borrowed ✅');
  }

  function handleAddBook(bookData){
    Model.addBook(bookData);
    renderBooks();
    alert('Book added ✅');
  }

  function handleReturn(index){
    Model.returnBorrow(index);
    renderBooks();
    renderBorrowed();
  }

  function handleLogin(user, pass){
    if(user==='admin' && pass==='admin'){
      Model.loginAdmin();
      View.hideModal();
      View.showAdmin();
      renderBorrowed();
    } else {
      alert('Invalid credentials');
    }
  }

  function handleLogout(){
    Model.logoutAdmin();
    View.hideAdmin();
  }

  return {
    init, renderBooks, renderBorrowed, handleBorrow, handleAddBook, handleReturn,
    handleLogin, handleLogout
  };
})(Model, null);
