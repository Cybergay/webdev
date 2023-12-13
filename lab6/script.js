let page = 1;
let perPage = 5;
let totalPage = 0;

let btnBack = document.querySelector('.footer');


function loadData() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 
        `http://cat-facts-api.std-900.ist.mospolytech.ru/facts?page=${page}&per-page=${perPage}`);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.response);
            let posts = document.querySelector('.posts');
            let template = document.querySelector('#post');
            posts.innerHTML = '';
            for (const record of response.records) {
                let clone = template.content.cloneNode(true);
                let text = clone.querySelector('.upper_post');
                text.textContent = record.text;
                let author = clone.querySelector('.author');
                author.textContent = `${record.user.name.first} 
                ${record.user.name.last}`;
                let upvotes = clone.querySelector('.upvotes');
                upvotes.textContent = record.upvotes;
                posts.append(clone);
            }
            totalPage = response._pagination.total_pages;
        } else {
            console.log('Ошибка при выполнении запроса');
        }
    };
}

function clickFooter(event) {
    const target = event.target;
    if (target.classList.contains('btn-back')) {
        if (page - 1 < 1) {
            return;
        }   
        page -= 1;
        loadData();

    }
    if (target.classList.contains('btn-forward')) {
        if (page + 1 > totalPage) {
            return;
        }   
        page += 1;
        loadData();

    }
}

btnBack.addEventListener('click', clickFooter);

window.onload = loadData;
