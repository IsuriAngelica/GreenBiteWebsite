const recipesContainer = document.getElementById('recipes-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
// recipe model elements
const modal = document.getElementById('recipe-modal');
const modalContent = document.getElementById('modal-recipe-content');
const closeModal = document.querySelector('.close-modal');

let recipes = [];
let currentPage = 1;
const recipesPerPage = 4;
let filteredRecipes = []; 
let currentFilter = 'all';
let currentSearchTerm = '';

async function loadRecipes() {
  try {
    const response = await fetch('./HealthyRecipesPage/data/recipes.json');
    const data = await response.json();
    return data.recipes;
  } catch (error) {
    console.error('Error loading recipes:', error);
    
    return [
      
      {
        title: "Sample Recipe",
        description: "A sample recipe for demonstration",
        category: "breakfast",
        image: "placeholder.jpg",
        alt: "Sample recipe",
        keywords: ["sample"],
        ingredients: ["Ingredient 1", "Ingredient 2"],
        instructions: ["Step 1", "Step 2"],
        nutrition: {
          calories: "200",
          protein: "10g",
          carbs: "20g",
          fat: "5g",
          fiber: "3g"
        }
      }
    ];
  }
}


async function initialize() {
  recipes = await loadRecipes();
  filteredRecipes = [...recipes];
  filterRecipes();
}

// Filter function
function filterRecipes() {
    filteredRecipes = recipes.filter(recipe => {
        // Category filter
        const categoryMatch = currentFilter === 'all' || recipe.category === currentFilter;
        
        // Search term filter
        const searchMatch = currentSearchTerm === '' || 
            recipe.title.toLowerCase().includes(currentSearchTerm) ||
            recipe.description.toLowerCase().includes(currentSearchTerm) ||
            (recipe.keywords && recipe.keywords.some(keyword => 
              keyword.toLowerCase().includes(currentSearchTerm)));
        
        return categoryMatch && searchMatch;
    });
    
   
    currentPage = 1;
    displayRecipes();
}


function displayRecipes() {
    recipesContainer.innerHTML = '';
    
    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const currentRecipes = filteredRecipes.slice(startIndex, endIndex);
    
 
    if (filteredRecipes.length === 0) {
        recipesContainer.innerHTML = `
            <div class="search-results-message">
                <p>No recipes found matching your criteria. Try a different search or filter!</p>
            </div>
        `;
    } else {
        currentRecipes.forEach(recipe => {
          const recipeElement = document.createElement('section');
          recipeElement.className = 'flex-item-recipe';
          recipeElement.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.alt}">
            <div>
              <h2>${recipe.title}</h2>
              <p>${recipe.description}</p>
              <span class="recipe-category">${recipe.category.toUpperCase()}</span>
            </div>
          `;
          
       
          recipeElement.addEventListener('click', () => {
            openRecipeModal(recipe);
          });
          
          recipesContainer.appendChild(recipeElement);
        });
    }
    

    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}


document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
       
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
    
        currentFilter = button.dataset.filter;
        filterRecipes();
    });
});


document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    currentSearchTerm = document.getElementById('search-input').value.toLowerCase();
    filterRecipes();
});


document.getElementById('search-input').addEventListener('input', (e) => {
    if (e.target.value === '') {
        currentSearchTerm = '';
        filterRecipes();
    }
});


prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayRecipes();
        window.scrollTo({ top: recipesContainer.offsetTop - 100, behavior: 'smooth' });
    }
});

nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayRecipes();
        window.scrollTo({ top: recipesContainer.offsetTop - 100, behavior: 'smooth' });
    }
});

// Modal with recipe details
function openRecipeModal(recipe) {
  modalContent.innerHTML = `
    <h2>${recipe.title}</h2>
    <img src="${recipe.image}" alt="${recipe.alt}">
    <p>${recipe.description}</p>
    
    <div class="ingredients-list">
      <h3>Ingredients</h3>
      <ul>
        ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
      </ul>
    </div>
    
    <div class="instructions-list">
      <h3>Instructions</h3>
      <ol>
        ${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
      </ol>
    </div>
    
    <div class="nutrition-info">
      <h3>Nutrition Information</h3>
      <table class="nutrition-table">
        <tr><th>Nutrient</th><th>Amount</th></tr>
        <tr><td>Calories</td><td>${recipe.nutrition.calories}</td></tr>
        <tr><td>Protein</td><td>${recipe.nutrition.protein}</td></tr>
        <tr><td>Carbs</td><td>${recipe.nutrition.carbs}</td></tr>
        <tr><td>Fat</td><td>${recipe.nutrition.fat}</td></tr>
        <tr><td>Fiber</td><td>${recipe.nutrition.fiber}</td></tr>
      </table>
    </div>
  `;
  
  modal.style.display = 'block';
}


closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});



document.addEventListener('DOMContentLoaded', function() {
  
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
       
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
         
            currentFilter = button.dataset.filter;
            filterRecipes();
        });
    });


    document.getElementById('search-form').addEventListener('submit', (e) => {
        e.preventDefault();
        currentSearchTerm = document.getElementById('search-input').value.toLowerCase();
        filterRecipes();
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
        if (e.target.value === '') {
            currentSearchTerm = '';
            filterRecipes();
        }
    });


    initialize();
});


