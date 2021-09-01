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
if(document.querySelector('.terminal__items-container')){
    const swiper = new Swiper('.terminal__items-container', {
        // Default parameters
        slidesPerView: 1,
        slideClass: 'terminal__box',
        wrapperClass: 'terminal__swiper-wrapper',
        pagination: {
            el: '.terminal__swiper-wrapper-pagination',
            type: 'bullets',
            clickable: true,
        },
        init: false,
        autoHeight: true,
    });
    if(document.documentElement.offsetWidth < 576){
        swiper.init();

        swiper.on('slideChange', function (items) {
            let index = items.realIndex;

            const activeMenuItem = document.querySelector('.terminal__menu-item--active');
            const allMenuItems = document.querySelectorAll('.terminal__menu-item');

            //setPaginationTop(items);

            activeMenuItem.classList.remove('terminal__menu-item--active');
            allMenuItems[index].classList.add('terminal__menu-item--active');
        });

        function setPaginationTop(props) {
            const pagination = document.querySelector('.terminal__swiper-wrapper-pagination');
            const contentItem = props.slides[props.realIndex].querySelector('.terminal__content').offsetHeight;

            pagination.style.top = contentItem + 'px';
        }
    }

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

                    if(document.documentElement.offsetWidth < 576){
                        //swiper.slideTo(terminalClickedItem);

                        let dots = document.querySelector('.terminal__swiper-wrapper-pagination').querySelectorAll('.swiper-pagination-bullet');
                        let terminalClickedItem = +clickedMenuItem.dataset.numberSlide - 1;
                        dots[terminalClickedItem].click();
                    }
                }
            })
        }
    }
    showSliderTerminal();
}



/*function changeLangInHeader() {
    const langContainer = document.querySelector('.header-top__lang-switcher');

    langContainer.addEventListener('click', function(){
        langContainer.classList.toggle('header-top__lang-switcher--active');
    })
}*/

if($('.calculator__container').length){

    var $container = $('.calculator__container');

    $container.imagesLoaded( function() {
        $('.calculator__container').masonry({

            itemSelector: '.calculator__item',
            // use element for option
            columnWidth: '.calculator__item',

            gutter: '.calculator__gutter',

        });
    });
}






let timer;

/*строка*/
function generateRowTableWithData(item) {
    const itemBid = item.Bids[0].Price;
    const itemAsk = item.Asks[0].Price;
    let nameSymbolForShow = item.Symbol;
    if(nameSymbolForShow === 'XAUUSD'){
        nameSymbolForShow = 'GOLD';
    } else if(nameSymbolForShow === 'BRNT.x'){
        nameSymbolForShow = 'BRENT';
    } else if(nameSymbolForShow === 'SPX.x'){
        nameSymbolForShow = 'S&P500';
    } else if(nameSymbolForShow === 'DAX30.x'){
        nameSymbolForShow = 'DAX30';
    }

    return `<div class="best__table-row ${item.Symbol}">
                            <div class="best__table-col name">${nameSymbolForShow}</div>
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
    let newArrayCurrencies = [];

    let orderCurrencies = {
        'XAUUSD': 0,
        'BRNT.x' : 1,
        'BTCUSD' : 2,
        'ETHUSD' : 3,
        'EURUSD' : 4,
        'USDJPY' : 5,
        'SPX.x' : 6,
        'DAX30.x' : 7,
    };

    dataFromName.forEach( function (item) {
        newArrayCurrencies[orderCurrencies[item.Symbol]] = item;
    });

    newArrayCurrencies.forEach( function (item) {
        tableContent.insertAdjacentHTML('beforeend', generateRowTableWithData(item));
    });
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

    if(typeof finalNumber === 'number'){
        return finalNumber;
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
        url: "https://ttlivewebapi.free2ex.net:8443/api/v2/public/level2/EURUSD%20USDJPY%20BTCUSD%20ETHUSD%20XAUUSD%20BRNT%20BRNT.x%20SPX%20SPX.x%20DAX30%20DAX30.x?depth=1",
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
const lotInput = document.getElementById("lot");
let groupsInstruments = {};
let fullDataFromApi = null;

function renderSingleInstrument(item, group) {
    if(typeof item === 'string'){
        return `<option value="${item}" disabled>${item}</option>`;
    } else {
        return `<option value="${item.name}" data-group="${group}" data-margin="${item.marginFactor}" data-precision="${item.precision}">${item.nameForOutput}</option>`;
    }
}

function renderInstrumentsForCalculator(instruments) {

    instrumentsSelect.innerHTML = '';

    instruments.forEach((item) => {
        if (item.Symbol.substring(item.Symbol.length - 2) !== '_L') {
            let nameGroupFromApi = item.StatusGroupId;

            if(nameGroupFromApi === 'Default'){
                return false;
            }
            if(item.Symbol === 'XAUUSD' || item.Symbol === 'XAGUSD' || item.Symbol === 'BRNT.x' ||
            item.Symbol === 'WTI.x' || item.Symbol === 'NG.x'){
                nameGroupFromApi = 'Commodities';
            } else if(item.Symbol === 'SPX.x' || item.Symbol === 'UK100.x' || item.Symbol === 'DAX30.x'){
                nameGroupFromApi = 'Indicies';
            }
            if(groupsInstruments.hasOwnProperty(nameGroupFromApi)){
                let newItemInGroup = {
                    name: item.Symbol,
                    nameForOutput: item.MarginCurrency + '/' + item.ProfitCurrency,
                    precision: item.Precision,
                    marginFactor: item.MarginFactor,
                };
                groupsInstruments[nameGroupFromApi].push(newItemInGroup);
            } else {
                let arrayOfNamesCurrencies = [];
                let newItemInGroup = {
                    name: item.Symbol,
                    nameForOutput: item.MarginCurrency + '/' + item.ProfitCurrency,
                    precision: item.Precision,
                    marginFactor: item.MarginFactor,
                };
                arrayOfNamesCurrencies.push(newItemInGroup);
                groupsInstruments[nameGroupFromApi] = arrayOfNamesCurrencies;
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
    renderLeveragesForInstrument(instrumentsSelect);
    renderValuesOfLots(instrumentsSelect);

    instrumentsSelect.addEventListener('change', function () {
        updateOpenAndClosePrice(this);
        renderLeveragesForInstrument(this);
        renderValuesOfLots(this);
    });

    lotInput.addEventListener("input", function (evt) {
        if (lotInput.validity.rangeOverflow) {
            lotInput.setCustomValidity("Значение лота больше возможного");
        } else if(lotInput.validity.rangeUnderflow){
            lotInput.setCustomValidity("Значение лота меньше возможного");
        } else {
            lotInput.setCustomValidity("");
        }
    });
}

function renderValuesOfLots(elem) {
    fetch('https://ttlivewebapi.free2ex.net:8443/api/v2/public/symbol/' + elem.value)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const values = calculateValuesOfLots(data[0]);
            lotInput.value = values.defaultValue;
            lotInput.min = values.minValue;
            lotInput.max = values.maxValue;
            lotInput.step = values.minValue;
        });
}

function calculateValuesOfLots(item) {
    let minValue = item.MinTradeAmount / item.ContractSize;
    let maxValue = item.MaxTradeAmount / item.ContractSize;

    return {
        defaultValue: 1,
        minValue: minValue,
        maxValue: maxValue,
    }
}

function translateMarginFactorToLeverage(value) {
    return (1 / value).toFixed(0);
}
function renderLeveragesForInstrument(elem) {
    const leverage = document.querySelector('#leverage');

    const translatedValue = translateMarginFactorToLeverage(elem.selectedOptions[0].dataset.margin);

    leverage.innerHTML = `<option value="${translatedValue}">1:${translatedValue}</option>`;
}

function updateOpenAndClosePrice(elem) {
    fetch('https://ttlivewebapi.free2ex.net:8443/api/v2/public/ticker/' + elem.value)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const openPriceElement = document.querySelector('#open_price');
            const closePriceElement = document.querySelector('#close_price');
            let openPriceValue = data[0].BestAsk;
            let tick = 1 / Math.pow(10, +elem.selectedOptions[0].dataset.precision);

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

function getPricePunkt(tick, size, activCurrency) {
    return roundStringNumberWithoutTrailingZeroes((10 * tick * size ) / +activCurrency, 3);
}

function getMarginCurrent(size, openPrice, leverage, currency) {
    return roundStringNumberWithoutTrailingZeroes(size * openPrice / leverage / currency, 2);
}

function getSwopData(group, pricePunkt, swop, currency) {
    if(group === 'Crypto' || 'Forex' || 'CFD 00-01'){
        return roundStringNumberWithoutTrailingZeroes(pricePunkt / 10 * swop, 3);
    } else {
        return roundStringNumberWithoutTrailingZeroes(swop * currency, 3);
    }
}

function renderSymbolForApi(accountCur, instrumentCurrencyProfit, instrumentCurrencyMargin, currency) {
    if(instrumentCurrencyProfit !== 'USD' && instrumentCurrencyProfit !== 'EUR'){
        return instrumentCurrencyMargin + instrumentCurrencyProfit;
    } else {
        return currency;
    }
}

function getComission(commission, size, currency) {
    return roundStringNumberWithoutTrailingZeroes((commission / 100) * size / currency, 5);
}

function getProfit(action, openValue, closeValue, tick, pricePunkt) {
    if(action === 'buy'){
        return roundStringNumberWithoutTrailingZeroes((closeValue - openValue) / (10 * tick) * pricePunkt, 3);
    }
    return roundStringNumberWithoutTrailingZeroes((openValue - closeValue) / (10 * tick) * pricePunkt, 3);
}

function parseMyData(milliseconds) {
    let date = new Date(milliseconds);
    let year = date.getFullYear();
    let month = date.getMonth() + 1 < 10 ? '0' + date.getMonth() : date.getMonth();
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    return '( ' + day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds +' )';
}

function getSwopDate(value) {
    let currentLang = document.querySelector('#cur-lang').value;
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

    return currentLang === 'ru' ? '3-дневные свопы: ' + data[value] : '3-day swaps: ' + data[value];
}
function setVisibleItem(item) {
    item.style.visibility = 'visible';
    item.style.maxHeight = '1000px';
}

let submitBtn = document.querySelector('.btn--calculator');
function calculateTable() {
    const table = document.querySelector('.calculator__result-table');

    submitBtn.addEventListener('click', function (evt) {
        evt.preventDefault();

        if(!lotInput.validity.valid) {
            // Если поле лот не валидно
            return false;
        }

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

                let sizeContract = getSizeContract(lotCalculator, fullData.ContractSize);
                let currentTickValue = getTickInstrument(fullData.Precision);
                result.textContent = sizeContract  + ' ' + fullData.MarginCurrency;
                tick.textContent = currentTickValue;

                if(accountCurrency === fullData.ProfitCurrency){
                    calculateItemsInTable(1, new Date());
                } else {
                    if(accountCurrency === 'EUR'){
                        // валюта счет - eur
                        if(fullData.ProfitCurrency === 'USD'){
                            fetch('https://ttlivewebapi.free2ex.net:8443/api/v2/public/tick/EURUSD')
                                .then((response) => {
                                    return response.json();
                                })
                                .then((eurusdCurrency) =>{
                                    calculateItemsInTable(eurusdCurrency[0].BestAsk.Price, eurusdCurrency[0].Timestamp);
                                })
                        } else {
                            fetch('https://ttlivewebapi.free2ex.net:8443/api/v2/public/tick/' + renderSymbolForApi(accountCurrency, fullData.ProfitCurrency, fullData.MarginCurrency, currentSymbol))
                                .then((response) => {
                                    return response.json();
                                })
                                .then((dataCurrentCurrency) => {
                                    calculateItemsInTable(dataCurrentCurrency[0].BestAsk.Price, dataCurrentCurrency[0].Timestamp);
                                });
                        }
                    } else {
                        //валюта счета - usd
                        fetch('https://ttlivewebapi.free2ex.net:8443/api/v2/public/tick/' + renderSymbolForApi(accountCurrency, fullData.ProfitCurrency, fullData.MarginCurrency, currentSymbol))
                            .then((response) => {
                                return response.json();
                            })
                            .then((dataCurrentCurrency) => {
                                calculateItemsInTable(dataCurrentCurrency[0].BestAsk.Price, dataCurrentCurrency[0].Timestamp);
                            });
                    }
                }


                function calculateItemsInTable(price, time) {
                    let valueAccountCurrency = price;
                    let pricePunktValue = getPricePunkt(currentTickValue, sizeContract, valueAccountCurrency);

                    pricePunkt.textContent = pricePunktValue + " " + accountCurrency;
                    swopSell.textContent = getSwopData( currentGroup, pricePunktValue, fullData.SwapSizeShort, valueAccountCurrency) + " " + accountCurrency;
                    swopBuy.textContent = getSwopData( currentGroup, pricePunktValue, fullData.SwapSizeLong, valueAccountCurrency) + " " + accountCurrency;
                    margin.textContent = getMarginCurrent(sizeContract, openPriceElement.value, leverageCalculator, valueAccountCurrency) + " " + accountCurrency;
                    comission.textContent = getComission(fullData.Commission, sizeContract, valueAccountCurrency) + " " + accountCurrency;
                    profit.textContent = getProfit(choiceParameterValue, openPriceElement.value, closePriceElement.value, currentTickValue, pricePunktValue) + " " + accountCurrency;

                    setVisibleItem(commentTitle);
                    setVisibleItem(commentData);

                    commentData.innerHTML = `${fullData.ProfitCurrency + accountCurrency} - ${roundStringNumberWithoutTrailingZeroes(1 / valueAccountCurrency, 3)} ${parseMyData(time)}<br>
                        ${getSwopDate(fullData.TripleSwapDay)}`;
                }

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
