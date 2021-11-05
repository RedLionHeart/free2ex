function perspectiveInit(){
    const perspectiveContainer = document.querySelector('.perspective__container');

    let currencies = 'BTCUSD ETHUSD DOTUSD ATMUSD ADAUSD SOLUSD MATUSD XRPUSD BNBUSD DOGUSD';

    $.ajax({
        method: "GET",
        url: "https://cryptottlivewebapi.free2ex.net:8443/api/v2/public/level2/" + currencies,
        dataType: "json",
        data: {},
        success: function (data) {
            perspectiveContainer.innerHTML = "";
            data.forEach(function (item){
                if(item){
                    let price = item.Bids[0].Price;
                    let symbol = item.Symbol;

                    perspectiveContainer.insertAdjacentHTML('beforeend', getItemPerspective(price, symbol))
                }
            })
        }
    });
}

function getItemPerspective(price, symbol){
    const mapCurrencyImg = {
        'BTCUSD' : {
            name: 'Bitcoin',
            image: 'https://i-invdn-com.investing.com/ico_flags/80x80/v32/bitcoin.png',
            link: 'https://www.free2ex.ru/crypto/bitcoin',
        },
        'ETHUSD' : {
            name: 'Ethereum',
            image: 'https://i-invdn-com.investing.com/ico_flags/80x80/v32/ethereum.png',
            link: false,
        },
        'DOTUSD' : {
            name: 'Polcadot',
            image: 'https://i-invdn-com.investing.com/ico_flags/80x80/v32/polkadot-new.png',
            link: false,
        },
        'ATMUSD' : {
            name: 'Cosmos',
            image: 'https://i-invdn-com.investing.com/ico_flags/80x80/v32/cosmos.png',
            link: false,
        },
        'ADAUSD' : {
            name: 'Cardano',
            image: 'https://i-invdn-com.investing.com/ico_flags/80x80/v32/cardano.png',
            link: false,
        },
        'SOLUSD' : {
            name: 'Solana',
            image: 'https://i-invdn-com.investing.com/ico_flags/80x80/v32/solana.png',
            link: false,
        },
        'MATUSD' : {
            name: 'Polygon',
            image: 'https://i-invdn-com.investing.com/ico_flags/80x80/v32/polygon.png',
            link: false,
        },
        'XRPUSD' : {
            name: 'XRP',
            image: 'https://i-invdn-com.investing.com/ico_flags/80x80/v32/xrp.png',
            link: false,
        },
        'BNBUSD' : {
            name: 'Binance Coin',
            image: 'https://i-invdn-com.investing.com/ico_flags/80x80/v32/binance-coin.png',
            link: false,
        },
        'DOGUSD' : {
            name: 'Dogecoin',
            image: 'https://i-invdn-com.investing.com/ico_flags/80x80/v32/dogecoin.png',
            link: false,
        },
    }

    if(mapCurrencyImg[symbol].link){
        return `<a href="${mapCurrencyImg[symbol].link}" class="perspective__item">
                    <img src="${mapCurrencyImg[symbol].image}" alt="crypto" class="perspective__item-img">
                    <div class="perspective__item-content">
                        <p class="perspective__item-title">${mapCurrencyImg[symbol].name}</p>
                        <p class="perspective__item-value">${price} $</p>
                    </div>
                </a>`;
    } else {
        return `<div class="perspective__item">
                    <img src="${mapCurrencyImg[symbol].image}" alt="crypto" class="perspective__item-img">
                    <div class="perspective__item-content">
                        <p class="perspective__item-title">${mapCurrencyImg[symbol].name}</p>
                        <p class="perspective__item-value">${price} $</p>
                    </div>
                </div>`;
    }

}

perspectiveInit();