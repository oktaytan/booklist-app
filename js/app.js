// Book Class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}



// UI Class : Handle UI Tasks
class UI {
  static displayBooks() {

    const books = Store.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#bookList');
    const listItem = document.createElement('DIV');

    listItem.setAttribute('class', 'list__item')
    listItem.innerHTML = `
      <span>${book.title}</span>
        <span>${book.author}</span>
        <span>${book.isbn}</span>
        <span class="svg__wrap">
          <a href="#" id="deleteBtn">
            <svg>
              <path d="M5,5,0,10,5,5,0,0,5,5l5-5L5,5l5,5Z" />
            </svg>
          </a>
      </span>
    `;

    list.appendChild(listItem);
  }

  static deleteBook(el) {
    if (el.id === 'deleteBtn') {
      el.parentElement.parentElement.remove();

      // Show success message for delete book
      UI.showAlert('Book Removed', 'success');
    }
  }

  static showAlert(message, className) {
    const messageDiv = document.querySelector('#message');

    messageDiv.innerText = message;

    if (!messageDiv.classList.contains('show')) {
      messageDiv.classList.add('show');
      messageDiv.classList.add(className);
    }

    setTimeout(() => {
      if (messageDiv.classList.contains('show')) {
        messageDiv.classList.remove('show');
        messageDiv.classList.remove(className);
      }
    }, 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// Store Class : Handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event : Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event : Add a Book
document.querySelector('#bookForm').addEventListener('submit', (e) => {
  e.preventDefault();
  // Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // Validate
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill in all fields.', 'alert');
  } else {
    // Instatiate Book
    const book = new Book(title, author, isbn);

    // Add Book to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // Show success message
    UI.showAlert('Book Added', 'success');

    // Clear fields
    UI.clearFields();
  }

});

// Event : Remove a Book
document.querySelector('#bookList').addEventListener('click', (e) => {
  // Remove book from UI
  UI.deleteBook(e.target);

  // Remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});