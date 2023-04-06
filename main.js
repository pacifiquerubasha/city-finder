
const app = document.querySelector('.app');
const navigation = `
<div class="navigation w-full flex items-center h-24">
        <div class="header flex w-4/5 mx-auto justify-between">
          <a href="#" class="text-4xl font-semibold color-yellow logo">City Finder</a>
          
          <div class="toggle">
            <button class="relative group toggle-btn">
              <div class="relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-slate-700 ring-0 ring-gray-300 hover:ring-8 group-focus:ring-4 ring-opacity-30 duration-200 shadow-md">
                <div class="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden">
                  <div class="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:translate-x-10"></div>
                  <div class="bg-white h-[2px] w-7 rounded transform transition-all duration-300 group-focus:translate-x-10 delay-75"></div>
                  <div class="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:translate-x-10 delay-150"></div>
      
                  <div class="absolute items-center justify-between transform transition-all duration-500 top-2.5 -translate-x-10 group-focus:translate-x-0 flex w-0 group-focus:w-12">
                    <div class="absolute bg-white h-[2px] w-5 transform transition-all duration-500 rotate-0 delay-300 group-focus:rotate-45"></div>
                    <div class="absolute bg-white h-[2px] w-5 transform transition-all duration-500 -rotate-0 delay-300 group-focus:-rotate-45"></div>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div class="nav-curtain hidden"></div>


          <div class="flex items-center w-3/5 flex gap-12 text-xl nav-items ">
            <a href="/" class="">Home</a>
            <a href="countries.html" class="">Compare</a>
            <a href="about.html" class="">About Us</a>
            <a href="contact.html" class="">Contact Us</a>

          </div>
        </div>  

      </div>

`

app.insertAdjacentHTML('afterbegin', navigation);

const pagesHeader = document.querySelector('.navigation');
const logo = document.querySelector('.logo');
const menuItems = document.querySelectorAll('.nav-items a');

window.addEventListener('scroll', ()=>{
  if(window.scrollY >= 100){
    pagesHeader.classList.add('nav-bg');
    logo.classList.add('color-darkgreen');
    menuItems.forEach((item)=>item.classList.add('color-darkgreen'))
  }

  else{
    pagesHeader.classList.remove('nav-bg');
    logo.classList.remove('color-darkgreen');
    menuItems.forEach((item)=>item.classList.remove('color-darkgreen'))

  }
})

const toggleBtn = document.querySelector('.toggle');
const navItemsContainer = document.querySelector('.nav-items');

toggleBtn.addEventListener('click', ()=>{
    navItemsContainer.classList.toggle('animate-nav');
})

const navItems = document.querySelectorAll('.nav-items a');

navItems.forEach((item)=>{
    item.addEventListener('click', ()=>{
        if(window.innerWidth <= 1024){
            navItemsContainer.classList.toggle('animate-nav');
        }
    })
})


const loadMap = (id, lat, lng, countryName)=>{

  var map = L.map(id).setView([lat, lng], 5);
  
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  L.marker([lat, lng]).addTo(map)
      .bindPopup(`Country ${countryName}`)
      .openPopup();
}



let countries = [];

const selectCityContainer = document.querySelectorAll(".city-select");

const loadDataInSelect = (data)=>{
  selectCityContainer.forEach((select)=>{
    data.forEach((country)=>{
      const template = `<span>${country.name.common}</span>`
      select.insertAdjacentHTML('beforeend', template);
    })
    
  })
}

const loadCountries = async(isLoading, setState)=>{

  
  const response = await fetch('https://cyrruscodex.onrender.com/countries');

  if(!response.ok){

  }

  else{
    const data = await response.json();

    if(data){
      countries = data.data;
      loadDataInSelect(countries)
    }

  }
    
}

loadCountries();

const countryInputs = document.querySelectorAll('.country-input');

countryInputs.forEach((input, key)=>{
  input.addEventListener('keyup', (e)=>{
    const filteredData = countries.filter((country)=>country.name.common.toLowerCase().includes(e.target.value.toLowerCase()))
    selectCityContainer[key].innerHTML = '';

    loadDataInSelect(filteredData)
    selectCityContainer[key].classList.remove('hidden');

    selectCityContainer[key].childNodes.forEach((child)=>{
      child.addEventListener('click', ()=>{
        input.value = child.textContent;
        selectCityContainer[key].classList.add('hidden');
      })
    })

  })

})


const compareForm = document.getElementById("compare-countries");

const loadTemplate = (container, country, key)=>{
  container.innerHTML = '';

  const template = `
      <div class="flex items-center">
          <img src=${country.flag} alt="" class="flag">
          <span class="text-4xl ml-4 ">${country.name.common}</span>
      </div>
      <div class="mt-12">
          <div class="text-xl flex flex-col mb-4">
              <span class="font-semibold">Official Name</span>
              <span>${country?.name?.official}</span>
          </div>
          <div class="text-xl flex flex-col mb-4">
              <span class="font-semibold">Capital City</span>
              <span>${country.capital[0]}</span>
          </div>
          <div class="text-xl flex flex-col mb-4">
              <span class="font-semibold">callingCodes</span>
              
              <span>
                ${country.callingCodes[0]}
              </span>
          </div>
          <div class="text-xl flex flex-col mb-4">
              <span class="font-semibold">currencies</span>
              <span>
                ${Object.keys(country.currencies).map((currency)=>{
                  return currency
                })}
              
              </span>
          </div>
          <div class="text-xl flex flex-col mb-4">
              <span class="font-semibold">Is Independent</span>
              <span>${country.independent ? "Yes" : "No"}</span>
          </div>
          <div class="text-xl flex flex-col mb-4">
              <span class="font-semibold">Is Landlocked</span>
              <span>${country.landlocked ? "Yes" : "No"}</span>
          </div>
          <div class="text-xl flex flex-col mb-4">
              <span class="font-semibold">Is UN Member</span>
              <span>${country.unMember ? "Yes" : "No"}</span>
          </div>

          <div class="text-xl flex flex-col mb-4">
              <span class="font-semibold">Languages</span>
              <span>
                ${Object.values(country.languages).map((language)=>{
                  return language
                })}
              </span>
          </div>
          <div class="text-xl flex flex-col mb-4">
              <span class="font-semibold">Region</span>
              <span>${country.region}</span>
          </div>
          <div class="text-xl flex flex-col mb-4">
              <span class="font-semibold">Subregion</span>
              <span>${country.subregion}</span>
          </div>
          <div class="text-xl flex flex-col mb-4">
              <span class="font-semibold">Top Level Domain</span>
              <span>${country.tld.map((domain)=>domain)}</span>
          </div>
          
      </div>

      <div id="map${key}" class="map"></div>
  
  `
  container.insertAdjacentHTML('beforeend', template);

  loadMap(`map${key}`, country.latlng[0], country.latlng[1], country.name.common)
}




const cityDatContainer = document.querySelector('.capital-data');
const citySection = document.querySelector('.capital-city-details');

const fillCitiesTemplates = (city1, city2, data)=>{

  const headerCells = document.querySelectorAll('.cities-header-cell');
  headerCells[0].textContent = city1;
  headerCells[1].textContent = city2;

  
  data.forEach((datum)=>{
    const template = `
      <div class="w-full flex my-2">
          <div class="w-1/2">${datum.item}</div>
          <div class="w-1/4">${datum.priceCity1}</div>
          <div class="w-1/4">${datum.priceCity2}</div>
      </div>
    `;

    cityDatContainer.insertAdjacentHTML('beforeend', template);

  })

}



const loadCityPrices = async(data)=>{

  const cityLoader = document.querySelector('.cities-loader');

  const {city1, country1, city2, country2} = data;

  const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '0cec3de41bmsh38c2b51c51157dcp11589cjsn275e5828a274',
        'X-RapidAPI-Host': 'cost-of-living-and-prices.p.rapidapi.com'
    }
  };

  citySection.classList.remove('hidden');
  cityDatContainer.innerHTML = '';
  cityLoader.classList.remove('hidden');

  const response1 = await fetch(`https://cost-of-living-and-prices.p.rapidapi.com/prices?city_name=${city1}&country_name=${country1}`, options);
  const response2 = await fetch(`https://cost-of-living-and-prices.p.rapidapi.com/prices?city_name=${city2}&country_name=${country2}`, options);


  if(!response1.ok || !response2.ok){
      console.log("FAILED")
      cityLoader.classList.add('hidden');

  }

  else{
      const cityData1 = await response1.json();
      const cityData2 = await response2.json();

      //CITY DATA
      if(cityData1 && cityData2){

              const wrangledData = [];

                cityData1?.prices?.forEach((price, i)=>{
                  
                    const matches = cityData2?.prices?.filter((item)=>item.item_name.includes(price.item_name));
                                       
                    if(matches.length > 0)
                        wrangledData.push({
                            item:price.item_name,
                            priceCity1:`${price.usd?.avg}`,
                            priceCity2:`${matches[0].usd?.avg}`

                    })

                });

              cityLoader.classList.add('hidden');

              fillCitiesTemplates(city1, city2, wrangledData);


      }

      else cityLoader.classList.add('hidden');


  }



}


const resultContainerTitle = document.querySelector('.results-title');


compareForm.addEventListener('submit', (e)=>{
  e.preventDefault();

  const firstCountry = countries.find((country)=>country.name.common.toLowerCase().includes(countryInputs[0].value.toLowerCase()))
  const secondCountry = countries.find((country)=>country.name.common.toLowerCase().includes(countryInputs[1].value.toLowerCase()))

  const firstcontainer = document.querySelector('.compare-left');
  const secondcontainer = document.querySelector('.compare-right');

  resultContainerTitle.classList.remove('hidden');

  if(firstCountry){
    loadTemplate(firstcontainer, firstCountry, 1)
  }

  else firstcontainer.innerHTML = `Could not find data about the country ${countryInputs[0].value}`

  if(secondCountry){
    loadTemplate(secondcontainer, secondCountry, 2)
  }

  if(firstCountry && secondCountry){
    const data = {
      city1:firstCountry.capital[0], 
      country1:firstCountry.name.common, 
      city2:secondCountry.capital[0], 
      country2:secondCountry.name.common
    }

    loadCityPrices(data);
  }

  else secondcontainer.innerHTML = `Could not find data about the country ${countryInputs[1].value}`

})


// document.getElementById('contact-frame').style.background='white';