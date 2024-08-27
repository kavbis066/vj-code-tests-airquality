document.addEventListener('DOMContentLoaded', () => {
    let currLanguage = 'english';
    let cities = []; // to store current languages's data

    // fetching and initializing data
    fetchData(currLanguage);

    // languge toggle
    const langButton = document.querySelector('.lang-toggle');
    langButton.addEventListener('click', () => {
        currLanguage = currLanguage === 'english' ? 'hindi' : 'english';
        fetchData(currLanguage);
    });

    // dropdown change
    const citySelect = document.querySelector('.city-select');
    citySelect.addEventListener('change', (e) => {
        const selectedCityName = e.target.value;
        const selectedCity = cities.find(city => city.name === selectedCityName);
        // console.log(selectedCityName);
        
        if (selectedCity) {
            displayData(selectedCity);
        }
    });

    // fetching data based on language selected
    function fetchData(language) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/data/${language}.json`, true);
        xhr.onload = function() {
            if (this.status === 200) {
                const data = JSON.parse(this.responseText);
                // console.log('cities', data);

                updatePageContent(data);
                cities = parseCityData(data);
                populateDropdown(cities);
                resetDisplay();
            }
            else {
                console.error('Error in fetching data: ', this.status);
            }
        };
        xhr.onerror = function () {
            console.error('Request error...');
        };
        xhr.send();
    }

    // parsing the data from the json
    function parseCityData(data) {
        const cityData = [];
        
        const totalCities = parseInt(data['total_cities_1_value'], 10) || 0;
        // console.log(totalCities);

        for (let i = 1; i <= totalCities; i++) {
            const nameKey = `compare-tabs_1_city_${i}_name`;
            const aqiKey = `compare-tabs_1_city_${i}_aqi`;
            const ciggKey = `compare-tabs_1_city_${i}_cigg`;

            const name = data[nameKey];
            const aqi = data[aqiKey];
            const cigg = data[ciggKey];

            if (name && aqi && cigg) {
                // Extract numeric AQI from string (e.g., "283 PM2.5" -> 283)
                const aqiValue = parseInt(aqi, 10);
                const ciggValue = parseInt(cigg, 10);
                cityData.push({
                    name: name,
                    aqi: aqi, // Keep the full string for display
                    cigg: isNaN(ciggValue) ? 0 : ciggValue
                });
            }
        }

        // console.log(cityData);
        return cityData;
    }

    // populate dropdown menu
    function populateDropdown(cities) {
        const citySelect = document.querySelector('.city-select');
        citySelect.innerHTML = '<option value="" disabled selected>Select a city</option>'; 

        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.name;
            option.textContent = city.name;
            citySelect.appendChild(option);
        });
    }

    // function to display data
    function displayData(city) {
        // console.log(city);
        resetDisplay();
        
        // Display AQI
        const aqiValue = document.querySelector('.aqi-value');
        aqiValue.textContent = `AQI is ${city.aqi}`;

        // display cigaratte
        const cigaratteContainer = document.querySelector('.cigarette-container');
        for (let i = 0; i < city.cigg; i++) {
            const cigaretteImg = document.createElement('img');
            cigaretteImg.src = '/img/ciggrette_icon.png';
            cigaretteImg.alt = `cigarette ${i + 1}`;
            cigaretteImg.classList.add('cigarette-icon');
            cigaratteContainer.appendChild(cigaretteImg);
        }
    }

    // function to reset the data for each city when selected from the dropdown
    function resetDisplay() {
        const aqiValue = document.querySelector('.aqi-value');
        aqiValue.textContent = '';
        const cigaratteContainer = document.querySelector('.cigarette-container');
        cigaratteContainer.innerHTML = '';
        // const citySelect = document.querySelector('.city-select');
        // citySelect.selectedIndex = 0;
    }

    // update page content
    function updatePageContent(data) {
        for (const key in data) {
            // console.log(key);
            
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                let element = null;

                const selector = `[data-tag=${key}]`;
                // console.log(selector);
    
                if (key.endsWith('_image')) {
                    element = document.querySelector(selector);
                    console.log(element);
                    
                    if (element && element.tagName.toLowerCase() === 'img') {
                        element.src = value;
                    }
                }
                if (key.endsWith('_category')) {
                    element = document.querySelector(selector);
                    element.textContent = value;
                    element.href = data['article-info_1_category_url'];
                }
                else {
                    element = document.querySelector(selector);
                    if (element) {
                        element.textContent = value;
                    }
                }
            }            
        }
    }
});