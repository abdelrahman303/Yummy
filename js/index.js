let rowcontent = document.getElementById('rowContent');
let mealsdetails = document.getElementById('mealsdetails');
let sidenav = document.getElementById('mySidenav')
let search = document.getElementById('search');
let contactus = document.getElementById('contactus');
const loading = document.querySelector('.loading');

//  side nav
function toggleNav() {
    const toggleBtn = document.getElementById("toggleBtn");
    if (sidenav.style.left === "-280px" || sidenav.style.left === "") {
        sidenav.style.left = "0";
        toggleBtn.innerHTML = "&times;";
        $('.sidenav-inner a').each(function (i) {
            $(this).delay(i * 100).animate({ top: '0', opacity: '1' }, 300);
        });
    } else {
        $('.sidenav-inner a').each(function (i) {
            $(this).delay(i * 100).animate({ top: '20px', opacity: '0' }, 300);
        });
        setTimeout(() => {
            sidenav.style.left = "-280px";
            toggleBtn.innerHTML = "&#9776;";
        }, 700);
    }
}
document.querySelectorAll('.sidenav-inner .nav-link').forEach(link => {
    link.addEventListener('click', toggleNav);
});

document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        // Check if the navbar is open, then toggle it closed
        if (navbarCollapse.classList.contains('show')) {
            navbarToggler.click();  // Programmatically trigger the button click
        }
    });
});


// get meals
async function getMeals() {
    loading.classList.remove('d-none');
    try {
        let mealsdata = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
        let respone = await mealsdata.json();
        displayMeals(respone.meals);
    } catch (error) {
        console.log(' Error fetching Meals Data :' + error);
    } finally {
        loading.classList.add('d-none');
    }
}
getMeals();

// display meals
function displayMeals(arr) {
    let cartona = '';
    if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            cartona += `
            <div class="col-lg-3 mealCard col-md-6" data-id="${arr[i].idMeal}">
                <div class="meal-card position-relative rounded-2 overflow-hidden cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="">
                    <div class="card-layer position-absolute d-flex overflow-hidden align-items-center text-black p-2">
                        <h3 class="fs-4 fw-semibold ">${arr[i].strMeal}</h3> 
                    </div>
                </div>
            </div>`;
        }
    } else {
        // If no meals found
        cartona = `<div class="col-12 text-center"><h3>No meals found</h3></div>`;
    }

    rowcontent.innerHTML = cartona;

    // Add event listeners to each meal card
    document.querySelectorAll(".mealCard").forEach((card) => {
        card.addEventListener("click", () => {
            const mealId = card.dataset.id;
            getMealsDetials(mealId);

            // Scroll to the top of the page
            window.scrollTo({
                top: 0,
                behavior: 'smooth' 
            });

            // Show meal details and hide other sections
            rowcontent.classList.add('d-none');
            mealsdetails.classList.remove('d-none');
            sidenav.classList.add('d-none');
        });
    });
}

// get meal details
async function getMealsDetials(id) {
    loading.classList.remove('d-none');
    try {
        let mealsDetialsData = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        let response = await mealsDetialsData.json();
        displayMealsDetials(response.meals);
    } catch (error) {
        console.log(' error feting meals details :  ' + error);
    } finally {
        loading.classList.add('d-none');
    }
}

// display meal details
function displayMealsDetials(arr) {
    let meal = arr[0];
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
        }
    }
    let tags = '';
    if (meal.strTags) {
        let tagsArray = meal.strTags.split(',');
        for (let tag of tagsArray) {
            tags += `<li class="alert alert-danger m-2 p-1">${tag}</li>`;
        }
    }
    let cartona = `
    <div class="row g-4 position-relative">
    <button class="btn-close btn-close-white fs-4 position-absolute " id="btnClose"></button>
        <div class="col-md-4">
            <img src="${meal.strMealThumb}" class="w-100 rounded-2 mb-3" alt="">
            <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3><span class="fw-bolder">Area:</span> ${meal.strArea}</h3>
            <h3><span class="fw-bolder">Category:</span> ${meal.strCategory}</h3>
            <h3 class="fw-bolder">Recipes:</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${ingredients}
            </ul>
            <h3 class="fw-bolder">Tags:</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${tags}
            </ul>
            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>
    </div>`;
    mealsdetails.innerHTML = cartona;
    //  close btn
    document.getElementById('btnClose').addEventListener('click', function () {
        mealsdetails.classList.add('d-none')
        rowcontent.classList.remove('d-none')
        sidenav.classList.remove('d-none')
    })
}

// get category
async function getCategory() {
    loading.classList.remove('d-none');
    try {
        let categorydata = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        let response = await categorydata.json();
        displayCategories(response.categories);
    } catch (error) {
        console.log('Error to fetch category : ' + error);
    } finally {
        loading.classList.add('d-none');
    }
}

// display category
function displayCategories(arr) {

    let carrtona = '';
    for (let i = 0; i < arr.length; i++) {
        carrtona += `
        <div class="col-lg-3 categoryCard col-md-6" data-category="${arr[i].strCategory}">
            <div class="meal-card position-relative rounded-2 overflow-hidden cursor-pointer">
                <img class="w-100" src="${arr[i].strCategoryThumb}" alt="">
                <div class="card-layer text-center position-absolute text-black p-2">
                    <h3 class="fs-2 fw-semibold">${arr[i].strCategory}</h3>
                    <p class="text-black">${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>`;
    }
    rowcontent.innerHTML = carrtona;
    document.querySelectorAll(".categoryCard").forEach((card) => {
        card.addEventListener("click", () => {
            const category = card.dataset.category;
            getCategoryDetails(category);
            rowcontent.classList.remove('d-none');

        });
    });
}

// get category details
async function getCategoryDetails(category) {
    loading.classList.remove('d-none');
    try {
        let categorydetails = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        let response = await categorydetails.json();
        displayMeals(response.meals);
    } catch (error) {
        console.log(' Error to fetch category details : ' + error);
    } finally {
        loading.classList.add('d-none');
    }

}

//  get area 
async function getArea() {
    loading.classList.remove('d-none');
    try {
        let areadata = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
        let respone = await areadata.json();
        displayArea(respone.meals)
    } catch (error) {
        console.log(' Error to fetch area : ' + error);
    } finally {
        loading.classList.add('d-none');
    }
}

//  display area
function displayArea(arr) {
    let cartona = '';
    for (let i = 0; i < arr.length; i++) {
        cartona += `
             <div class="col-lg-3 areaCard col-md-6 " data-area="${arr[i].strArea}">
                <div class="area text-center cursor-pointer">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${arr[i].strArea}</h3>
                </div>
            </div>
        `;
    }
    rowcontent.innerHTML = cartona
    document.querySelectorAll('.areaCard').forEach((card) => {
        card.addEventListener('click', () => {
            const area = card.dataset.area;
            getAreaDetails(area);
            rowcontent.classList.remove('d-none');
        })
    });
}

//  get area details
async function getAreaDetails(area) {
    loading.classList.remove('d-none');
    try {
        let areaDetails = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        let response = await areaDetails.json();
        displayMeals(response.meals);
    } catch (error) {
        console.log(' Error to fetch area details : ' + error);
    } finally {
        loading.classList.add('d-none');
    }
}

//  get ingredient
async function getIngredient() {
    loading.classList.remove('d-none');
    try {
        let ingredientdata = await fetch(` https://www.themealdb.com/api/json/v1/1/list.php?i=list  `);
        let respone = await ingredientdata.json();
        displayIngredient(respone.meals)
    } catch (error) {
        console.log(' Error to fetch Ingredient : ' + error);
    } finally {
        loading.classList.add('d-none');
    }
}

//  display ingredient
function displayIngredient(arr) {
    let cartona = '';
    for (let i = 0; i < 20; i++) {
        cartona += ` 
             <div class="col-lg-3 col-md-4 ingredientCard" data-ingredient="${arr[i].strIngredient}">
                <div onclick="" class="cursor-pointer text-center">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3>${arr[i].strIngredient}</h3>
                    <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
     `;
    }
    rowcontent.innerHTML = cartona;
    document.querySelectorAll('.ingredientCard').forEach((card) => {
        card.addEventListener('click', () => {
            const ingredient = card.dataset.ingredient;
            getIngredientDetails(ingredient);
            rowcontent.classList.remove('d-none')
        })
    });
}

// get ingredient details 
async function getIngredientDetails(ingredient) {
    loading.classList.remove('d-none');
    try {
        let ingredientData = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        let response = await ingredientData.json();
        displayMeals(response.meals)
    } catch (error) {
        console.log(' Error to fetch Ingredient Details : ' + error);
    } finally {
        loading.classList.add('d-none');
    }
}

// ---------------------------------------search-------------------------------------
function showSInputs() {
    let cartona = '';
    cartona = `
     <div class="container">
        <div class="row g-3 my-4 showsearchinputs" id="search">
            <div class="col-lg-6">
                <input onkeyup="searchByName(this.value);" type="text" class="form-control" placeholder="Search By Name">
            </div>
            <div class="col-lg-6">
                <input onkeyup="searchByFLetter(this.value);" type="text" class="form-control" maxlength="1" placeholder="Search By First Letter">
            </div>
        </div>
    </div>`;
    rowcontent.innerHTML = cartona;
    document.querySelectorAll('.showsearchinputs').forEach((search) => {
        search.addEventListener('click', function () {
            rowcontent.classList.remove('d-none');
        });
    });
}

async function searchByName(item) {
    loading.classList.remove('d-none');
    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${item}`);
        response = await response.json();
        displayMeals(response.meals);
    } catch (error) {
        console.log(' Error to fetch data to search by name : ' + error);
    } finally {
        loading.classList.add('d-none');
    }
}
async function searchByFLetter(item) {
    loading.classList.remove('d-none');
    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${item}`);
        response = await response.json();
        displayMeals(response.meals);
    } catch (error) {
        console.log(' Error to fetch data to search by first letter: ' + error);

    } finally {
        loading.classList.add('d-none');
    }
}

// ------------------------------------- login Form
function showInputs() {
    mealsdetails.innerHTML = `
      <div class="contact min-vh-100 d-flex justify-content-center position-relative align-items-center">
      <button class="btn-close btn-close-white fs-4 position-absolute " id="btnClose"></button>
        <div class="container w-75 text-center">
          <div class="row g-4">
            <div class="col-md-6">
              <input id="nameInput" onkeyup="validateName()" type="text" class="form-control" placeholder="Enter Your Name">
              <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                Special characters and numbers not allowed
              </div>
            </div>
            <div class="col-md-6">
              <input id="emailInput" onkeyup="validateEmail()" type="email" class="form-control " placeholder="Enter Your Email">
              <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                Email not valid *example@yyy.zzz
              </div>
            </div>
            <div class="col-md-6">
              <input id="phoneInput" onkeyup="validatePhone()" type="text" class="form-control maxlength="11" " placeholder="Enter Your Phone">
              <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                Enter valid Phone Number
              </div>
            </div>
            <div class="col-md-6">
              <input id="ageInput" onkeyup="validateAge()" type="number" class="form-control " placeholder="Enter Your Age">
              <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                Enter valid age
              </div>
            </div>
            <div class="col-md-6">
              <input id="passwordInput" onkeyup="validatePassword()" type="password" class="form-control " placeholder="Enter Your Password">
              <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                Enter valid password Minimum eight characters, at least one letter and one number
              </div>
            </div>
            <div class="col-md-6">
              <input id="repasswordInput" onkeyup="validatePassword()" type="password" class="form-control " placeholder="Re-enter Password">
              <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                Passwords do not match
              </div>
            </div>
          </div>
          <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3" onclick="clearInputs()">Submit</button>
        </div>
      </div>
    `;
    rowcontent.classList.add('d-none')
    mealsdetails.classList.remove('d-none')
    sidenav.classList.add('d-none')
    document.getElementById('btnClose').addEventListener('click', function () {
        mealsdetails.classList.add('d-none')
        rowcontent.classList.remove('d-none')
        sidenav.classList.remove('d-none')
    })
    submitBtn = document.getElementById("submitBtn");
}

//  validation name input
function validateName() {
    let nameInput = document.getElementById("nameInput");
    let nameAlert = document.getElementById("nameAlert");
    let isValidName = /^[a-zA-Z ]+$/.test(nameInput.value);
    updateValidationState(nameInput, isValidName, nameAlert);
    validateForm();
}

//  validation email input
function validateEmail() {
    let emailInput = document.getElementById("emailInput");
    let emailAlert = document.getElementById("emailAlert");
    let isValidEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailInput.value);
    updateValidationState(emailInput, isValidEmail, emailAlert);
    validateForm();
}

//  validation phone input
function validatePhone() {
    let phoneInput = document.getElementById("phoneInput");
    let phoneAlert = document.getElementById("phoneAlert");
    let isValidPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phoneInput.value);
    updateValidationState(phoneInput, isValidPhone, phoneAlert);
    validateForm();
}

//  validation age input
function validateAge() {
    let ageInput = document.getElementById("ageInput");
    let ageAlert = document.getElementById("ageAlert");
    let isValidAge = /^[0-9]+$/.test(ageInput.value);
    updateValidationState(ageInput, isValidAge, ageAlert);
    validateForm();
}

// validation password & repassword
function validatePassword() {
    let passwordInput = document.getElementById("passwordInput");
    let repasswordInput = document.getElementById("repasswordInput");
    let passwordAlert = document.getElementById("passwordAlert");
    let repasswordAlert = document.getElementById("repasswordAlert");

    // Validation password 
    let isValidPassword = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(passwordInput.value);
    if (!isValidPassword) {
        passwordInput.classList.add("is-invalid");
        passwordInput.classList.remove("is-valid");
        passwordAlert.classList.remove("d-none");
        passwordAlert.classList.add("d-block");
    } else {
        passwordInput.classList.remove("is-invalid");
        passwordInput.classList.add("is-valid");
        passwordAlert.classList.remove("d-block");
        passwordAlert.classList.add("d-none");
    }

    // Validation repassword
    if (repasswordInput.value !== passwordInput.value) {
        repasswordInput.classList.add("is-invalid");
        repasswordInput.classList.remove("is-valid");
        repasswordAlert.classList.remove("d-none");
        repasswordAlert.classList.add("d-block");
    } else {
        repasswordInput.classList.remove("is-invalid");
        repasswordInput.classList.add("is-valid");
        repasswordAlert.classList.remove("d-block");
        repasswordAlert.classList.add("d-none");
    }
    validateForm();
}

// update validation
function updateValidationState(inputElement, isValid, alertElement) {
    if (isValid) {
        inputElement.classList.remove("is-invalid");
        inputElement.classList.add("is-valid");
        alertElement.classList.remove("d-block");
        alertElement.classList.add("d-none");
    } else {
        inputElement.classList.remove("is-valid");
        inputElement.classList.add("is-invalid");
        alertElement.classList.remove("d-none");
        alertElement.classList.add("d-block");
    }
}


function validateForm() {
    let nameInput = document.getElementById("nameInput");
    let emailInput = document.getElementById("emailInput");
    let phoneInput = document.getElementById("phoneInput");
    let ageInput = document.getElementById("ageInput");
    let passwordInput = document.getElementById("passwordInput");
    let repasswordInput = document.getElementById("repasswordInput");
    let isValidName = /^[a-zA-Z ]+$/.test(nameInput.value);
    let isValidEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailInput.value);
    let isValidPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phoneInput.value);
    let isValidAge = /^[0-9]+$/.test(ageInput.value);
    let isValidPassword = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(passwordInput.value);
    let passwordsMatch = (repasswordInput.value === passwordInput.value);
    let isValidForm = isValidName && isValidEmail && isValidPhone && isValidAge && isValidPassword && passwordsMatch;
    submitBtn.disabled = !isValidForm;
}

//   clear inputs
function clearInputs() {
    nameInput.value = '';
    nameInput.classList.remove("is-valid")
    emailInput.value = '';
    emailInput.classList.remove("is-valid")
    phoneInput.value = '';
    phoneInput.classList.remove("is-valid")
    ageInput.value = '';
    ageInput.classList.remove("is-valid")
    passwordInput.value = '';
    passwordInput.classList.remove("is-valid")
    repasswordInput.value = ''
    repasswordInput.classList.remove("is-valid")
}