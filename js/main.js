// Мобильное меню
(function () {
    const menuIcon = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.header');
    const closeButton = document.querySelector('.mobile-menu__close-button');

    menuIcon.addEventListener('click', function () {
        if (mobileMenu.classList.contains('header--show')) {
            mobileMenu.classList.remove('header--show');

        } else {
            mobileMenu.classList.add('header--show');

        }
    });
    closeButton.addEventListener('click', function (evt) {
        if (mobileMenu.classList.contains('header--show')) {
            mobileMenu.classList.remove('header--show');
        }
    });

    document.addEventListener('click', function (evt) {
        if (mobileMenu.classList.contains('header--show') &&
            !evt.target.closest('.mobile-menu__close-button') &&
            !evt.target.closest('.burger-menu')) {
            mobileMenu.classList.remove('header--show');
        }
    })
})();


function showSliderTerminal() {
    const navContainer = document.querySelector('.terminal__menu');

    if(navContainer){
        navContainer.addEventListener('click', function (evt) {
            evt.preventDefault();

            if(evt.target.closest('.terminal__menu-item:not(.terminal__menu-item--active)')){
                const clickedMenuItem = evt.target.closest('.terminal__menu-item:not(.terminal__menu-item--active)');
                const activeElem = document.querySelector('.terminal__box--active');
                const tabForActivate = document.querySelector(clickedMenuItem.getAttribute('href'));
                const activeMenuItem = navContainer.querySelector('.terminal__menu-item--active');

                activeMenuItem.classList.remove('terminal__menu-item--active');
                clickedMenuItem.classList.add('terminal__menu-item--active');
                activeElem.classList.remove('terminal__box--active');
                tabForActivate.classList.add('terminal__box--active');
            }
        })
    }
}

function changeLangInHeader() {
    const langContainer = document.querySelector('.header-top__lang-switcher');

    langContainer.addEventListener('click', function(){
        langContainer.classList.toggle('header-top__lang-switcher--active');
    })
}

$('.calculator__container').masonry({
    // set itemSelector so .grid-sizer is not used in layout
    itemSelector: '.calculator__item',
    // use element for option
    columnWidth: '.calculator__item',
    //percentPosition: true,
    gutter: '.calculator__gutter',
    //fitWidth: true,
});

showSliderTerminal();
changeLangInHeader();


let timer;

/*строка*/
function generateRowTableWithData(item) {
    const itemBid = item.Bids[0].Price;
    const itemAsk = item.Asks[0].Price;

    return `<div class="best__table-row ${item.Symbol}">
                            <div class="best__table-col name">${item.Symbol}</div>
                            <div class="best__table-col bid">${item.Bids[0].Price}</div>
                            <div class="best__table-col ask">${item.Asks[0].Price}</div>
                            <div class="best__table-col spread">
                                <span>${getSpread(itemBid, itemAsk)}</span>
                            </div>
                        </div>`;
}

/*создаем строки*/
function generateTableQuotes(dataFromName) {
    const tableContent = document.querySelector('.best__table');

    for (let key in dataFromName) {
        tableContent.insertAdjacentHTML('beforeend', generateRowTableWithData(dataFromName[key]));
    }

}

function roundStringNumberWithoutTrailingZeroes (num, dp) {
    if (arguments.length != 2) throw new Error("2 arguments required");

    num = String(num);
    if (num.indexOf('e+') != -1) {
        // Can't round numbers this large because their string representation
        // contains an exponent, like 9.99e+37
        throw new Error("num too large");
    }
    if (num.indexOf('.') == -1) {
        // Nothing to do
        return num;
    }

    var parts = num.split('.'),
        beforePoint = parts[0],
        afterPoint = parts[1],
        shouldRoundUp = afterPoint[dp] >= 5,
        finalNumber;

    afterPoint = afterPoint.slice(0, dp);
    if (!shouldRoundUp) {
        finalNumber = beforePoint + '.' + afterPoint;
    } else if (/^9+$/.test(afterPoint)) {
        // If we need to round up a number like 1.9999, increment the integer
        // before the decimal point and discard the fractional part.
        finalNumber = Number(beforePoint)+1;
    } else {
        // Starting from the last digit, increment digits until we find one
        // that is not 9, then stop
        var i = dp-1;
        while (true) {
            if (afterPoint[i] == '9') {
                afterPoint = afterPoint.substr(0, i) +
                    '0' +
                    afterPoint.substr(i+1);
                i--;
            } else {
                afterPoint = afterPoint.substr(0, i) +
                    (Number(afterPoint[i]) + 1) +
                    afterPoint.substr(i+1);
                break;
            }
        }

        finalNumber = beforePoint + '.' + afterPoint;
    }

    // Remove trailing zeroes from fractional part before returning
    return finalNumber.replace(/0+$/, '')
}

function getSpread(Bids, Asks) {
    return roundStringNumberWithoutTrailingZeroes((Asks - Bids), 5);
}

function refreshPriceAndChange(bool) {
    $.ajax({
        method: "GET",
        url: "https://ttlivewebapi.free2ex.net:8443/api/v2/public/level2/EURUSD%20GBPUSD%20USDJPY%20BTCUSD%20ETHUSD%20BTCEUR%20XAUUSD%20XAGUSD%20BRNT%20BRNT.x%20SPX%20SPX.x%20DAX30%20DAX30.x?depth=1",
        dataType: "json",
        data: {},
        success: function (data) {
            if(bool){
                generateTableQuotes(data);
            }

            for (let i = 0; i < data.length; i++) {

                let itemBids = data[i].Bids[0].Price; //price
                let itemAsks = data[i].Asks[0].Price;
                let elementSpread = $('.best__table-row.' + data[i].Symbol + ' .spread');
                let elementSpreadSpan = $('.best__table-row.' + data[i].Symbol + ' .spread span');
                let elementName = $('.best__table-row.' + data[i].Symbol + ' .name');
                let elementBid = $('.best__table-row.' + data[i].Symbol + ' .bid');
                let elementAsk =  $('.best__table-row.' + data[i].Symbol + ' .ask');

                elementBid.html(itemBids);
                elementAsk.html(itemAsks);
                elementSpreadSpan.html(getSpread(itemBids, itemAsks));

                if (localStorage.getItem(data[i].Symbol)) {

                    let old_price = localStorage.getItem(data[i].Symbol);
                    let percent = ((itemBids - old_price) / itemBids) * 100;

                    if (percent.toFixed(2) != 0.00) {
                        elementSpread.removeClass('best__table-col--value-down');
                        elementSpread.removeClass('best__table-col--value-up');
                        elementName.removeClass('best__table-col--arrow-up');
                        elementName.removeClass('best__table-col--arrow-down');

                        if (percent < 0) {
                            elementSpread.addClass('best__table-col--value-down');
                            elementName.addClass('best__table-col--arrow-down');
                        }

                        if (percent > 0) {
                            elementSpread.addClass('best__table-col--value-up');
                            elementName.addClass('best__table-col--arrow-up');
                        }

                        localStorage.setItem(data[i].Symbol, itemBids)
                    } else {
                        if(bool){
                            if (percent < 0) {
                                elementSpread.addClass('best__table-col--value-down');
                                elementName.addClass('best__table-col--arrow-down');
                            } else if (percent > 0) {
                                elementSpread.addClass('best__table-col--value-up');
                                elementName.addClass('best__table-col--arrow-up');
                            } else {
                                elementSpread.addClass('best__table-col--value-up');
                                elementName.addClass('best__table-col--arrow-up');
                            }
                        }
                        elementSpread.removeClass('best__table-col--value-down');
                        elementSpread.removeClass('best__table-col--value-up');
                    }
                } else {

                    localStorage.setItem(data[i].Symbol, itemBids);
                    elementSpread.removeClass('best__table-col--value-down');
                    elementSpread.removeClass('best__table-col--value-up');
                    elementName.removeClass('best__table-col--arrow-up');
                    elementName.removeClass('best__table-col--arrow-down');
                }
            }
        }
    });

    clearTimeout(timer);
    timer = setTimeout(refreshPriceAndChange, 5000);
}

/*main page*/
const tableOnMainPage = document.querySelector('.best');
if(tableOnMainPage){
    refreshPriceAndChange(true);
}


/*calculator*/
const instrumentsSelect = document.querySelector('#instruments');
let groupsInstruments = {};
let fullDataFromApi = null;

function renderSingleInstrument(item, group) {
    if(typeof item === 'string'){
        return `<option value="${item}" disabled>${item}</option>`;
    } else {
        return `<option value="${item.name}" data-group="${group}" data-precision="${item.precision}">${item.nameForOutput}</option>`;
    }
}

function renderInstrumentsForCalculator(instruments) {

    instrumentsSelect.innerHTML = '';

    instruments.forEach((item) => {
        if (item.Symbol.substring(item.Symbol.length - 2) !== '_L') {
            if(groupsInstruments.hasOwnProperty(item.StatusGroupId)){
                let newItemInGroup = {
                    name: item.Symbol,
                    nameForOutput: item.MarginCurrency + '/' + item.ProfitCurrency,
                    precision: item.Precision,
                };
                groupsInstruments[item.StatusGroupId].push(newItemInGroup);
            } else {
                let arrayOfNamesCurrencies = [];
                let newItemInGroup = {
                    name: item.Symbol,
                    nameForOutput: item.MarginCurrency + '/' + item.ProfitCurrency,
                    precision: item.Precision,
                };
                arrayOfNamesCurrencies.push(newItemInGroup);
                groupsInstruments[item.StatusGroupId] = arrayOfNamesCurrencies;
            }
        }
    });

    for (let group in groupsInstruments) {
        instrumentsSelect.insertAdjacentHTML('beforeend', renderSingleInstrument(group));

        groupsInstruments[group].forEach(function (item) {
            instrumentsSelect.insertAdjacentHTML('beforeend', renderSingleInstrument(item, group));
        } );
    }
    updateOpenAndClosePrice(instrumentsSelect);

    instrumentsSelect.addEventListener('change', function () {
        updateOpenAndClosePrice(this);
    })
}

function updateOpenAndClosePrice(elem) {
    console.log(elem);
    fetch('https://ttlivewebapi.free2ex.net:8443/api/v2/public/ticker/' + elem.value)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const openPriceElement = document.querySelector('#open_price');
            const closePriceElement = document.querySelector('#close_price');
            let openPriceValue = data[0].BestAsk;
            let tick = 1 / Math.pow(10, + elem.selectedOptions[0].dataset.precision);

            openPriceElement.value = openPriceValue;
            closePriceElement.value = roundStringNumberWithoutTrailingZeroes(openPriceValue + 10 * tick, 5);
        });
}
function getAllInstrumentsForCalculator() {
    fetch('https://ttlivewebapi.free2ex.net:8443/api/v2/public/symbol')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            fullDataFromApi = data;
            renderInstrumentsForCalculator(data);
        });
}

function getSizeContract(lots, size) {
    return lots * size;
}
function getTickInstrument(precision) {
    return 1 / Math.pow(10, precision);
}

function getPricePunkt(tick, activCurrency) {
    return roundStringNumberWithoutTrailingZeroes(10 * tick * +activCurrency, 5);
}

function getMarginCurrent(size, leverage, currency) {
    return roundStringNumberWithoutTrailingZeroes(size / leverage * currency, 2);
}

function getSwopData(group, pricePunkt, swop, currency) {
    if(group === 'Crypto' || 'Forex' || 'CFD 00-01'){
        return roundStringNumberWithoutTrailingZeroes(pricePunkt / 10 * swop, 2);
    } else {
        return roundStringNumberWithoutTrailingZeroes(swop * currency, 2);
    }
}

function renderSymbolForApi(accountCur, instrumentCurrencyProfit, instrumentCurrencyMargin, currency) {
    if(instrumentCurrencyProfit !== 'USD' && instrumentCurrencyProfit !== 'EUR'){
        return accountCur + instrumentCurrencyProfit;
    } else {
        if(currency.search(/\./) === -1){
            return instrumentCurrencyMargin + accountCur;
        }
        return currency;
    }
}

function getComission(commission, size, currency) {
    return roundStringNumberWithoutTrailingZeroes(commission * size * currency, 2);
}

function getProfit(action, openValue, closeValue, leverage, currency, commission) {
    if(action === 'buy'){
        return roundStringNumberWithoutTrailingZeroes((closeValue - openValue) * leverage * currency - commission, 3);
    }
    return roundStringNumberWithoutTrailingZeroes((openValue - closeValue) * leverage * currency - commission, 3);
}

function parseMyData(milliseconds) {
    let date = new Date(milliseconds);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    return '( ' + day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds +' )';
}

function getSwopDate(value) {
    let data = {
        0: '',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
        7: 'Sunday',
    };

    return '3-дневные свопы: ' + data[value];
}
function setVisibleItem(item) {
    item.style.visibility = 'visible';
    item.style.maxHeight = '1000px';
}

let submitBtn = document.querySelector('.btn--calculator');
function calculateTable() {
    const table = document.querySelector('.calculator__result-table');

    submitBtn.addEventListener('click', function () {
        const selectedInstrument = instrumentsSelect.selectedOptions[0];
        const currentSymbol = selectedInstrument.value;
        const currentGroup = selectedInstrument.dataset.group;
        const result = table.querySelector('#size_contract');
        const tick = table.querySelector('#tick');
        const pricePunkt = table.querySelector('#price_punkt');
        const swopSell = table.querySelector('#swop_sell');
        const swopBuy = table.querySelector('#swop_buy');
        const margin = table.querySelector('#margin');
        const comission = table.querySelector('#comission');
        const profit = table.querySelector('#profit');
        const lotCalculator = document.querySelector('#lot').value;
        const leverageCalculator = document.querySelector('#leverage').value;
        const accountCurrency = document.querySelector('#account-currency').value;
        const openPriceElement = document.querySelector('#open_price');
        const closePriceElement = document.querySelector('#close_price');
        const choiceParameterValue = document.querySelector('#choice-parameter').querySelector('input:checked').value;
        const commentData = document.querySelector('#comment-data');
        const commentTitle = document.querySelector('.calculator__comment-title');

        let response = fetch('https://ttlivewebapi.free2ex.net:8443/api/v2/public/symbol/' + currentSymbol)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const fullData = data[0];
                console.log(fullData);
                let sizeContract = getSizeContract(lotCalculator, fullData.ContractSize);
                result.textContent = sizeContract  + ' ' + fullData.MarginCurrency;
                tick.textContent = getTickInstrument(fullData.Precision);

                console.log('Валюта аккаунта: ' + accountCurrency);
                console.log('Валюта инструмента: ' + fullData.ProfitCurrency);
                console.log('Валюта инструмента: ' + fullData.MarginCurrency);
                fetch('https://ttlivewebapi.free2ex.net:8443/api/v2/public/tick/' + renderSymbolForApi(accountCurrency, fullData.ProfitCurrency, fullData.MarginCurrency, currentSymbol))
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        let pricePunktValue = getPricePunkt(getTickInstrument(fullData.Precision), data[0].BestAsk.Price);
                        pricePunkt.textContent = pricePunktValue + " " + accountCurrency;
                        swopSell.textContent = getSwopData( currentGroup, pricePunktValue, fullData.SwapSizeShort, data[0].BestAsk.Price) + " " + accountCurrency;
                        swopBuy.textContent = getSwopData( currentGroup, pricePunktValue, fullData.SwapSizeLong, data[0].BestAsk.Price) + " " + accountCurrency;
                        margin.textContent = getMarginCurrent(sizeContract, leverageCalculator, data[0].BestAsk.Price) + " " + accountCurrency;
                        comission.textContent = getComission(fullData.Commission, sizeContract, data[0].BestAsk.Price) + " " + accountCurrency;
                        profit.textContent = getProfit(choiceParameterValue, openPriceElement.value, closePriceElement.value, leverageCalculator, data[0].BestAsk.Price, fullData.Commission) + " " + accountCurrency;

                        setVisibleItem(commentTitle);
                        setVisibleItem(commentData);

                        commentData.innerHTML = `${fullData.Symbol} - ${data[0].BestAsk.Price} ${parseMyData(data[0].Timestamp)}<br>
                        ${getSwopDate(fullData.TripleSwapDay)}`;

                    });

            });
        setTimeout(function() {
            $('.calculator__container').masonry('reloadItems');
            $('.calculator__container').masonry();
        },500);


    })
}

if(submitBtn){
    calculateTable();
    getAllInstrumentsForCalculator();
}


/*
Vue.component('table-row', {
    data: function(){
        return {
            isActive: true,
            upClass: 'best__table-col--value-up',
            downClass: 'best__table-col--value-down'
        };
    },
    props: ['quote', 'index'],
    methods: {
        checkChangeCurrency(data){
            this.$parent.checkChangeCurrency(data);
        },
        getDifference(){
            return (this.quote.Asks[0].Price - this.quote.Bids[0].Price).toFixed(5);
        }
    },
    template: `<div class="best__table-row">
                            <div class="best__table-col best__table-col--arrow-down">{{quote.Symbol}}</div>
                            <div class="best__table-col">{{quote.Bids[0].Price}}</div>
                            <div class="best__table-col">{{quote.Asks[0].Price}}</div>
                            <div class="best__table-col" v-bind:class="[isActive ? upClass : '', downClass]" >
                                <span>{{this.getDifference()}}</span>
                            </div>
                        </div>`
});

var app = new Vue({
    el: '#vue',
    data: {
        quotes: [],
        quotesFromStorage: {},
        url: {
            symbols: 'https://ttlivewebapi.free2ex.net:8443/api/v2/public/level2/EURUSD%20GBPUSD%20USDJPY%20GOLD%20%5BDJI30%5D%20BRENT%20%5BNQ100%5D?depth=1',
        }
    },
    mounted() {
        if (localStorage.getItem('quotes')) {
            try {
                this.quotesFromStorage = JSON.parse(localStorage.getItem('quotes'));
                this.getSymbols();

            } catch(e) {
                localStorage.removeItem('quotes');
            }
        } else {
            this.getSymbols();
            const parsed = JSON.stringify(this.quotes);
            localStorage.setItem('quotes', parsed);
        }
    },
    watch: {
        quotes: function (quotes) {
            const parsed = JSON.stringify(quotes);
            localStorage.setItem('quotes', parsed);
        }
    },
    methods: {
        getSymbols(){
            axios.get(this.url.symbols).then((response) => {
                this.quotes = response.data;
            } )
        },
        checkPercent(data){
            let old_price = this.quotesFromStorage[data].Bids[0].Price;
            let price = this.quotes[data].Bids[0].Price;
            let percent = ((price - old_price) / price) * 100;

            if (percent.toFixed(2) != 0.00) {
                return false;
            }
            return true;
        },
        checkChangeCurrency(data){
            if(this.checkPercent){
                this.isActive = true;
            }
        }
    },
});*/
