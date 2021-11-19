const nameExchangeCurrency = 'ETH';
const nameSecondCurrency = 'BTC';

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

function loadCurrencyData(){
    $.ajax({
        method: "GET",
        url: "https://cryptottlivewebapi.free2ex.net:8443/api/v2/public/level2/" + nameExchangeCurrency + nameSecondCurrency,
        dataType: "json",
        data: {},
        success: function (data) {
            let valueExchange = $('#value-exchange');
            let valueGet = $('#value-get');
            let currencyValueNow = data[0].Bids[0].Price;
            let currencyValueNowRevert = roundStringNumberWithoutTrailingZeroes((1 / currencyValueNow), 10);
            let currencyForExchange = $('#currency-for-exchange');
            let changeDirectionButton = $('.exchange-switch');
            let revert = false;

            valueExchange.find('span').text(nameExchangeCurrency);
            valueGet.find('span').text(nameSecondCurrency);
            currencyForExchange.text('1 ' + nameExchangeCurrency + ' = ' + currencyValueNow + ' ' + nameSecondCurrency);

            valueGet.find('input').val(roundStringNumberWithoutTrailingZeroes(valueExchange.find('input').val() * currencyValueNow, 3));

            valueExchange.find('input').on('input', function (){
                if(revert){
                    valueGet.find('input').val(roundStringNumberWithoutTrailingZeroes(this.value * currencyValueNowRevert, 3));
                } else {
                    valueGet.find('input').val(roundStringNumberWithoutTrailingZeroes(this.value * currencyValueNow, 3));
                }
            })

            changeDirectionButton.on('click', function (evt){
                evt.preventDefault();

                if(revert){
                    valueExchange.find('span').text(nameExchangeCurrency);
                    valueGet.find('span').text(nameSecondCurrency);
                    currencyForExchange.text('1 ' + nameExchangeCurrency + ' = ' + currencyValueNow + ' ' + nameSecondCurrency);

                    if(valueExchange.find('input').val()){
                        valueGet.find('input').val(roundStringNumberWithoutTrailingZeroes(valueExchange.find('input').val() * currencyValueNow, 10));
                    }
                } else {
                    valueExchange.find('span').text(nameSecondCurrency);
                    valueGet.find('span').text(nameExchangeCurrency);
                    currencyForExchange.text('1 ' + nameSecondCurrency + ' = ' + currencyValueNowRevert + ' ' + nameExchangeCurrency);

                    if(valueExchange.find('input').val()){
                        valueGet.find('input').val(roundStringNumberWithoutTrailingZeroes(valueExchange.find('input').val() * currencyValueNowRevert, 10));
                    }
                }

                revert = !revert;
            })
        }
    });
}

loadCurrencyData();