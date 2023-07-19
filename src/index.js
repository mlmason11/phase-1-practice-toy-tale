let addToy = false;

const toyFormContainer = document.querySelector(".container");
const toyCollection = document.getElementById('toy-collection');
const addToyForm = document.getElementById('add-toy-form');
const addBtn = document.querySelector("#new-toy-btn").addEventListener("click", () => {
  // hide & seek with the form
  addToy = !addToy;
  if (addToy) {
    toyFormContainer.style.display = "block";
  } else {
    toyFormContainer.style.display = "none";
  } 
});

// --- Event listeners --- //
addToyForm.addEventListener('submit', event => {
  event.preventDefault();
  const newToy = event.target;
  addNewToy(newToy);
})

// renders a single toy
function renderOneToy(toy) {

  const card = document.createElement('div');
  card.setAttribute('class', 'card');

  const title = document.createElement('h2');
  title.textContent = toy.name;

  const image = document.createElement('img');
  image.setAttribute('class', 'toy-avatar');
  image.src  = toy.image;

  const likes = document.createElement('p');
  likes.textContent = `Likes: ${toy.likes}`;
  
  const likeBtn = document.createElement('button');
  likeBtn.textContent = 'Like';
  likeBtn.setAttribute('class', 'btn');
  likeBtn.id = 'toy.id';
  likeBtn.addEventListener('click', () => {
    fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      likes: ++toy.likes
    })
    }).then(r => r.json())
    .then(updatedToy => {return updatedToy})
    .catch(error => alert(error));
    likes.textContent = `Likes: ${toy.likes}`;
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.setAttribute('class', 'btn');
  deleteBtn.id = 'toy.id';
  deleteBtn.addEventListener('click', () => {
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'DELETE'
    }).then(r => r.ok && card.remove())
    // .then(r => { if (r.ok) { card.remove() } })
    .catch(error => alert(error));
  })

  
  card.append(title, image, likes, likeBtn, deleteBtn);
  toyCollection.append(card);
}

// renders all toys by calling renderOneToy recursively
function renderAllToys(toys) {
  toys.forEach(toyObject => {
    renderOneToy(toyObject);
  })
}

function addNewToy(newToy) {
  fetch(`http://localhost:3000/toys/`, {
    method: 'POST',
    headers: {
      // This is what we are sending (newly submitted toy)
      'Content-Type': 'application/json',
      // What we expect to receive (toy that was just added to the database)
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: newToy.name.value,
      image: newToy.image.value,
      likes: 0
    })
  })
  .then(r => r.json())
  .then(newToyObject => renderOneToy(newToyObject))
  .catch(error => alert(error));
}



// function likeToy(toy) {
//   fetch(`http://localhost:3000/toys/${toy.id}`, {
//     method: 'PATCH',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       likes: ++toy.likes
//     })
//   }).then(r => r.json())
//   .then(updatedToy => {return updatedToy})
//   .catch(error => alert(error));
// }



function fetchToys() {
  fetch('http://localhost:3000/toys')
  .then(r => r.json())
  .then(toyObjectArray => renderAllToys(toyObjectArray))
  .catch((error) => alert(error));
}

fetchToys();