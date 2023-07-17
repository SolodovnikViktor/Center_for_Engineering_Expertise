const requestURL = 'https://randomuser.me/api';
let countPosts = 1;

$('#form').submit(function (e) {
  e.preventDefault();
  countPosts = $('input').val();
  getData(countPosts);
  $('.pagination').html('');
  clean();
});

function getData(countPosts) {
  $.ajax({
    url: requestURL,
    method: 'GET',
    dataType: 'json',
    data: { results: countPosts },
    success: function (data) {
      createTable(data.results);
    },
    error: function (jqXHR, exception) {
      if (jqXHR.status === 0) {
        alert('Not connect. Verify Network.');
      } else if (jqXHR.status == 404) {
        alert('Requested page not found (404).');
      } else if (jqXHR.status == 500) {
        alert('Internal Server Error (500).');
      } else if (exception === 'parsererror') {
        alert('Requested JSON parse failed.');
      } else if (exception === 'timeout') {
        alert('Time out error.');
      } else if (exception === 'abort') {
        alert('Ajax request aborted.');
      } else {
        alert('Uncaught Error. ' + jqXHR.responseText);
      }
    },
  });
}

async function createTable(postsData) {
  let currentPage = 1;
  let rows = 10;

  function displayList(arrData, rowPerPage, page) {
    clean();
    page--;

    const start = rowPerPage * page;
    const end = start + rowPerPage;
    const paginatedData = arrData.slice(start, end);

    paginatedData.forEach((key) => {
      let date = key.dob.date.substr(0, 10);
      $('#table_rows').append(
        `<tr>
      <td>${key.name.title} ${key.name.first}<br>${key.name.last}</td>
      <td>${key.gender}</td>
      <td><img src="${key.picture.thumbnail}" alt=""></td>
      <td>${date}</td>
      <td> страна: ${key.location.country} <br> город: ${key.location.city}</td><td>${key.email}</td>
      </tr>`,
      );
    });
  }

  function displayPagination(arrData, rowPerPage) {
    const paginationEl = document.querySelector('.pagination');
    const pagesCount = Math.ceil(arrData.length / rowPerPage);
    const ulEl = document.createElement('ul');
    ulEl.classList.add('pagination__list');

    for (let i = 0; i < pagesCount; i++) {
      const liEl = displayPaginationBtn(i + 1);
      ulEl.appendChild(liEl);
    }
    paginationEl.appendChild(ulEl);
  }

  function displayPaginationBtn(page) {
    const liEl = document.createElement('li');
    liEl.classList.add('pagination__item');
    liEl.innerText = page;

    if (currentPage == page) liEl.classList.add('pagination__item--active');

    liEl.addEventListener('click', () => {
      currentPage = page;
      displayList(postsData, rows, currentPage);

      let currentItemLi = document.querySelector('li.pagination__item--active');
      currentItemLi.classList.remove('pagination__item--active');

      liEl.classList.add('pagination__item--active');
    });

    return liEl;
  }

  displayList(postsData, rows, currentPage);
  displayPagination(postsData, rows);
}

function clean() {
  $('input').val('');
  $('#table_rows').html('');
}
