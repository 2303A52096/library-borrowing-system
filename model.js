// model.js — handles data & localStorage
const Model = (function(){
  const BOOKS_KEY = 'lib_books_v1';
  const BORROW_KEY = 'lib_borrow_v1';
  const DEFAULT_USER = 'student_local';

  function seed(){
    if(!localStorage.getItem(BOOKS_KEY)){
      const sample = [
        {id:1,title:"Intro to Algorithms",author:"Cormen",category:"CS",copies:2},
        {id:2,title:"Clean Code",author:"Robert C. Martin",category:"CS",copies:1},
        {id:3,title:"The Alchemist",author:"Paulo Coelho",category:"Fiction",copies:3},
        {id:4,title:"Principles of Economics",author:"N. Gregory",category:"Economics",copies:2},
        {id:5,title:"Organic Chemistry",author:"Paula",category:"Science",copies:1}
      ];
      localStorage.setItem(BOOKS_KEY, JSON.stringify(sample));
      localStorage.setItem(BORROW_KEY, JSON.stringify([]));
    }
  }

  function getBooks(){ return JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]'); }
  function setBooks(list){ localStorage.setItem(BOOKS_KEY, JSON.stringify(list)); }
  function getBorrowed(){ return JSON.parse(localStorage.getItem(BORROW_KEY) || '[]'); }
  function setBorrowed(list){ localStorage.setItem(BORROW_KEY, JSON.stringify(list)); }

  function addBook(book){
    const books = getBooks();
    const nextId = books.reduce((m,b)=>Math.max(m,b.id||0),0)+1;
    book.id = nextId;
    books.push(book);
    setBooks(books);
  }

  function borrowBook(bookId){
    const borrowed = getBorrowed();
    borrowed.push({bookId, borrower:DEFAULT_USER, date:new Date().toLocaleString()});
    setBorrowed(borrowed);
  }

  function returnBorrow(index){
    const borrowed = getBorrowed();
    borrowed.splice(index,1);
    setBorrowed(borrowed);
  }

  function isAdminLogged(){ return localStorage.getItem('lib_is_admin') === 'true'; }
  function loginAdmin(){ localStorage.setItem('lib_is_admin','true'); }
  function logoutAdmin(){ localStorage.removeItem('lib_is_admin'); }

  return {
    seed, getBooks, setBooks, getBorrowed, setBorrowed,
    addBook, borrowBook, returnBorrow,
    isAdminLogged, loginAdmin, logoutAdmin
  };
})();
