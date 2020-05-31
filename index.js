let allUsers = [];
let searchUsers = [];
let searchInput = document.querySelector('#search');
let btnSearch = document.querySelector('.btn');

function start() {
    render();
    fetchUsers();
    search();
}

async function fetchUsers() {
    const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    const users = await res.json();

    users.results.map(user => {
        const { name, dob, picture, gender } = user;

        allUsers = [...allUsers, { name: `${name.first + ' ' + name.last}`, age: dob.age, photo: picture.medium, gender }];

    });
}

function search() {
    searchInput.focus();
    searchInput.addEventListener('keyup', handletype);
    btnSearch.addEventListener('click', (event) => {
        event.preventDefault();
        handletype(event)
    })
}

function handletype(event) {
    const content = event.target.value;

    if (event.key === 'Enter' && content.trim() !== '' || event.type === 'click') {
        searchUsers = allUsers.filter(user => user.name.indexOf(content) > -1);
        render();
    }
}

function render() {
    renderSearch();
    renderSummary();
}

function renderSearch() {
    let result = document.querySelector('.result');
    let text = createdElem('h3');
    let list = createdElem('ul', 'search-list');

    result.innerHTML = '';

    text.textContent = 'Nenhum usuário filtrado';
    result.appendChild(text);

    searchUsers.forEach(user => {
        const { name, age, photo } = user;

        let li = createdElem('li', 'search-item');

        li.innerHTML = `
            <img alt="${name}" src="${photo}">
            <span>${name}, ${age} anos</span>
        `

        list.appendChild(li);

    });

    if (searchUsers.length) {
        text.textContent = `${searchUsers.length} Usuário(s) Encontrado(s)`;
        result.appendChild(list);
    }


}

function renderSummary() {
    let summary = document.querySelector('.summary');
    let text = createdElem('h3');
    let list = createdElem('ul', 'summary-list');

    let ageTotal = searchUsers.reduce((acc, crr) => {
        return acc + crr.age;
    }, 0);

    let ageMed = ageTotal / searchUsers.length;

    let masculine = searchUsers.filter(user => user.gender === 'male');
    let female = searchUsers.filter(user => user.gender === 'female');


    summary.innerHTML = '';
    text.textContent = 'Nada a ser exibido';

    if (searchUsers.length) {
        list.innerHTML = `
            <li>Sexo masculino: ${masculine.length}</li>
            <li>Sexo Feminino: ${female.length}</li>
            <li>Soma das idades: ${ageTotal}</li>
            <li>Média das idades: ${Math.ceil(ageMed)}</li>
        `

        text.textContent = 'Estatísticas';
    }

    summary.appendChild(text);
    summary.appendChild(list);
}

function createdElem(element, className) {
    let elem = document.createElement(element);
    elem.setAttribute('class', className);

    return elem;
}

start();