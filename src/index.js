let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // FETCH TOYS AND RENDER
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => {
      toys.forEach(renderToyCard);
    });

  // RENDER SINGLE TOY CARD
  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    // LIKE BUTTON LISTENER
    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => {
      const likesP = card.querySelector("p");
      const newLikes = toy.likes + 1;

      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ likes: newLikes })
      })
      .then(res => res.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes;
        likesP.textContent = `${updatedToy.likes} Likes`;
      });
    });

    toyCollection.appendChild(card);
  }

  // SUBMIT FORM TO ADD NEW TOY
  toyForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name,
        image,
        likes: 0
      })
    })
    .then(res => res.json())
    .then(newToy => {
      renderToyCard(newToy);
      toyForm.reset(); // clear form
      toyFormContainer.style.display = "none";
      addToy = false;
    });
  });
});
