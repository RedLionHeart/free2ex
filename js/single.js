let currentCurrency = 'BTCUSD';
let currentCurrencyName = 'BTC';
let symbolBeforeCurrency = '$';
let timer = null;

let link = 'https://live.free2ex.com/' + currentCurrency.toLowerCase();
$('.single-currency__button').attr("href", link)

function getDifferenceValues(oldValue, newValue) {
    return roundStringNumberWithoutTrailingZeroes(oldValue - newValue, 3);
}

function refreshPriceAndChange() {
    $.ajax({
        method: "GET",
        url: "https://cryptottlivewebapi.free2ex.net:8443/api/v2/public/level2/" + currentCurrency,
        dataType: "json",
        data: {},
        success: function (data) {
            let currencyName = $('.single-currency__name');
            let currencyValue = $('.single-currency__value');
            let currencyChanges = $('.single-currency__moving-container');
            let diffValue = $('.single-currency__change-value');

            currencyName.text('1 ' + currentCurrencyName + ' =');

            for (let i = 0; i < data.length; i++) {
                let priceBids = data[i].Bids[0].Price;
                let priceFixed = roundStringNumberWithoutTrailingZeroes(priceBids, 2);

                if (localStorage.getItem(data[i].Symbol)) {
                    currencyValue.text(symbolBeforeCurrency + ' ' + new Intl.NumberFormat('de-DE').format(priceFixed));
                    let old_price = localStorage.getItem(data[i].Symbol);

                    currencyChanges.removeClass('single-currency__moving-container--decrease single-currency__moving-container--grow');

                    if (priceBids > old_price) {
                        currencyChanges.addClass('single-currency__moving-container--grow');
                        diffValue.text('+' + getDifferenceValues(priceBids, old_price));
                    } else if (priceBids < old_price) {
                        currencyChanges.addClass('single-currency__moving-container--decrease');
                        diffValue.text('-' + getDifferenceValues(old_price, priceBids));
                    } else {
                        currencyChanges.removeClass('single-currency__moving-container--decrease single-currency__moving-container--grow');
                    }

                    localStorage.setItem(data[i].Symbol, priceBids);
                } else {
                    localStorage.setItem(data[i].Symbol, priceBids);
                    currencyChanges.removeClass('single-currency__moving-container--decrease single-currency__moving-container--grow');
                }
            }
        }
    });

    clearTimeout(timer);
    timer = setTimeout(refreshPriceAndChange, 5000);
}

function roundStringNumberWithoutTrailingZeroes(num, dp) {
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
        finalNumber = Number(beforePoint) + 1;
    } else {
        // Starting from the last digit, increment digits until we find one
        // that is not 9, then stop
        var i = dp - 1;
        while (true) {
            if (afterPoint[i] == '9') {
                afterPoint = afterPoint.substr(0, i) +
                    '0' +
                    afterPoint.substr(i + 1);
                i--;
            } else {
                afterPoint = afterPoint.substr(0, i) +
                    (Number(afterPoint[i]) + 1) +
                    afterPoint.substr(i + 1);
                break;
            }
        }

        finalNumber = beforePoint + '.' + afterPoint;
    }

    if (typeof finalNumber === 'number') {
        return finalNumber;
    }

    if (finalNumber.replace(/0+$/, '') === beforePoint + '.') {
        return finalNumber.replace(/0+$/, '').replace(/\./, '');
    }
    // Remove trailing zeroes from fractional part before returning
    return finalNumber.replace(/0+$/, '');
}

refreshPriceAndChange();