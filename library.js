// Library FTW!!!
// jQuery fun
$(document).ready(function(){
	$('#selected_book_info_outer').hide();
	$('#add_book').hide();
	$('#search_book').hide();
	$('#remove_book').hide();
	$('#login_inputs').hide();
	$('#logout_button').hide();
	$('#logout_button').click(function(){
		library.logout;
	});
	$('#login_button').click(function(){
		$('#login_inputs').toggle();
	});
	$('#add_book_button').click(function(){
		$('#add_book').toggle();
	});
	$('#search_book_button').click(function(){
		$('#search_book').toggle();
	});
	$('#remove_book_button').click(function(){
		$('#remove_book').toggle();
	});
	$('.book_in_list').click(function(){
		library.selectBook;
	});
});

// Library object
var library = {

	// Empty array for book objects.
	books: [],

	elements: {
		title: document.getElementById("title_input"),
		author: document.getElementById("author_input"),
		year: document.getElementById("year_input"),
		pages: document.getElementById("page_input"),
		book_list: document.getElementById("book_list"),
		search_title: document.getElementById("search_title_input"),
		remove_title: document.getElementById("remove_title_input"),
		username_input: document.getElementById('username_input'),
		password_input: document.getElementById('password_input')
	},

	username: '',

	addBook: function(){

		// Uses the book constructor to create a new Book object and stores it in the last index of the books array.
		this.books[this.books.length] = new Book(this.elements.title.value, this.elements.author.value, this.elements.year.value, this.elements.pages.value);
		alert(this.elements.title.value+" added!");

		// Add the book to the list of books on the html page.
		this.elements.book_list.insertAdjacentHTML("beforeend", "<div class='book_in_list' id='"+spaceToUnderscore(this.elements.title.value)+"'>" + this.elements.title.value + "</div>");
		
		// Add event listener.
		var books = document.querySelectorAll('.book_in_list');
		for(var i = 0; i < books.length; i++) {
			books[i].addEventListener('click', library.selectBook);
		};

		// Resets the text boxes to empty.
		this.elements.title.value = "";
		this.elements.author.value = "";
		this.elements.year.value = "";
		this.elements.pages.value = "";
	},

	addBookFromConsole: function(title,author,year,pages,read){
		this.books[this.books.length] = new Book(title,author,year,pages,read);
	},

	displayBook: function(book){ // Receives book object and sets display to book's specifics and shows div.
		
		$('#display_book_title').html(book.title);
		$('#display_book_author').html(book.author);
		$('#display_publish_date').html(book.year);
		$('#display_num_pages').html(book.pages);
		$('#selected_book_info_outer').show();

	},

	editBook: function(){

	},

	list: function(){

		// Loop through the book objects and create a div with the book title for each book in the array.
		for (book in this.books){
			console.log(this.books[book].title);
		};

	},

	help: function(){
		console.log('Functions:');
		for (var i in this){
			console.log(i);
		};
	},

	hideBook: function(){ // Console use to deselect a book
		$('#selected_book_info_outer').hide();
		$('.selected_book').removeClass('selected_book');
	},

	logout: function(){
		console.log('logging out!');
	},

	pack: function(username){

		localStorage.setItem(username,JSON.stringify(library.books));

	},

	populatePage: function(){

		for (bookobj in this.books) {

			// Add the book to the list of books on the html page.
			this.elements.book_list.insertAdjacentHTML("beforeend", "<div class='book_in_list' id='"+ this.books[bookobj].title +"'>" + this.books[bookobj].title + "</div>");
			
		};
		
		// Add event listener.
		var bookhtml = document.querySelectorAll('.book_in_list');
		for(var i = 0; i < bookhtml.length; i++) {
			bookhtml[i].addEventListener('click', library.selectBook);
		};

		// Add username to options bar
		document.getElementById('user_name_display').insertAdjacentHTML('beforeend', this.username);

	},

	removeBook: function(){

		// Set a variable equal to book title
		var remove_title = $('.selected_book').attr('id');
		
		// Delete book object from library book list
		this.books.splice(this.searchByTitle(remove_title),1);
				
		// Deselect any books and remove the HTMl for the deleted book
		$('.selected_book').removeClass('selected_book');
		$('#'+remove_title).remove();

		// Hide selected book html
		$('#selected_book_info_outer').hide();

		alert("Deleted " + remove_title + " from your library!");

	},

	searchBook: function(){

		// Loop through book objects in the books array.
		var raw_search_title = this.elements.search_title.value;
		var search_title = spaceToUnderscore(raw_search_title);
		if (library.books){
			var no_book = true;
			for (book in library.books){
				if (library.books[book].title === raw_search_title){ // if the title of the object in the books array is equal to the argument we passed to it, log the object.
					no_book = false;
					$('.selected_book').removeClass('selected_book');
					$('#'+search_title).addClass('selected_book');
					//var book_name = $('.selected_book').attr('id');
					//var display_book = library.searchByTitle(book_name);
					var display_book = library.searchByTitle(raw_search_title);
					library.displayBook(display_book);
					break;
				};
			};

			if (no_book){
				alert("Did not find book ("+raw_search_title+") in your library.");
			};

		}else{
			alert('There are no books in your library!');
		};
		this.elements.search_title.value = "";
	},

	searchByTitle: function(book_title){ // Searches through the list of objects by title. Returns book object.
		for (var i=0; i<library.books.length; i++){
			if (this.books[i].title === book_title){
				return this.books[i];
			}
		};
		return false;

	},

	selectBook: function(event){

		$('.selected_book').removeClass('selected_book');
		$(this).addClass('selected_book');
		var book_name = underscoreToSpace($('.selected_book').attr('id'));

		var display_book = library.searchByTitle(book_name);

		library.displayBook(display_book);

	},

	unpack: function(){

		//clear all existing info from page
		this.hideBook();
		
		
		this.username = this.elements.username_input.value;

		this.books = JSON.parse(localStorage.getItem(this.username));

		this.populatePage();

		this.elements.username_input.value = '';
		this.elements.password_input.value = '';
		$('#login_inputs').hide();
		$('#login_button').hide();
		$('#logout_button').show();



	}
};

// Book constructor
function Book(title,author,year,pages,read){
	this.title = title;
	this.author = author;
	this.year = year;
	this.pages = pages;
	this.read = read;
};

// Space to underscore function
function spaceToUnderscore(string){
	var new_string = '';
	var new_letter = '';
	for (letter in string) {
		new_letter = string[letter];
		if (string[letter] === ' ') {
			new_letter = '_';
		};
		new_string += new_letter;
	};
	return new_string;
};

// Underscore to space function
function underscoreToSpace(string){

	var new_string = '';
	var new_letter = '';
	for (letter in string) {
		new_letter = string[letter];
		if (string[letter] === '_') {
			new_letter = ' ';
		};
		new_string += new_letter;
	};
	return new_string;

};