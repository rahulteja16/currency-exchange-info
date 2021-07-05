Following assumptions & code choices have been made in this assignment subject to discussion.

## Viewing the application

- The application has been deployed and can be visited here - [currency-exchange-info](https://currency-exchange-info.netlify.app/)

## Running the application

- This app is built with `create-react-app` boiler plate.
- To Run the app, follow

```
yarn install
yarn start
```

- Verify test cases and code coverage with

```
yarn test
yarn test -- --coverage
```

## API Assumptions

- To obtain currency exchange data, open API from [swop.cx](https://swop.cx/) used as [ratesapi.io](https://ratesapi.io/) does not provide a free HTTPS account.
- Only `rates` and `currencies` APIs have been used and the calaculation of the rate conversion is being done within the application.

## Features Implemented

- User can select the `source` and `target` currency.
- Conversion will be done on the fly once amount has been input in the `source`.
- target`amount` field is disabled always and it's value is calculated from`source` amount.
- User can change `amount`, `source`,`target`, target currency and the conversion will be re-calculated according to the new values.
- Currencies can be swapped with button click - `source` becomes `target` and `target` becomes `source` and amount is recalculated accordingly.
- Multiple instances of currency converter can be `created` and `deleted` and there is no dependency between each instance.
- Currency convertion has been included upto `2` decimal points.
- Semantic HTML has been implemented and the entire UI can be navigated through keyboard.
- Accessiblity in terms of `A11y` and `i18n` has been implemented.

## Technology Stack

- React with hooks has been used.
- For state management within the applicaiton, React hooks `useReducer` and `useContext` have been used.
- `styled components` has been used for styling the components.
- For unit testing, `React Testing Library` has been used.

## State and its varaibles

```
state = {
  date: '',
  countries: [],
  rates: {},
  exchange: [],
  status: 'loading',
};
```

- `date` - Hold the date for which the following convertions are being done.
- `countries` - Hold the list of countries where convertion can be done. Each country object is as follows

```
{
    code: "AED"
    id: "784"
    name: "United Arab Emirates dirham - AED"
}
```

- `rates` - Holds all the convertion values with respect to `EUR`.`rates` object is as follows

```
{
    AED: 4.354257
    USD: 1.185597
    INR: 88.273824
}
```

- `exchange` - Holds list of objects, wherein each object refers to a single instace of `currency converter`.Each `exchange` object is as follows

```
{
    fromAmount: 0
    fromCurrency: "EUR"
    id: "EUR-USD-0"
    toAmount: 0
    toCurrency: "USD"
}
```

- `status` - Holds `4` diffrent values - `idle`, `loading`, `fetching`, `error`

## Termiology while reading the code

- `fromCurrency` - The currency from which the conversation has to happen.
- `fromAmount` - The amount that needs to be transferred.
- `toCurrency` - The currency to which the convertion has to happen.
- `toAmount` - Amount that has been converted to.

## Testing

- Entire application has been unit tested and has 90% code coverage.
- Snapshot tests used to quickly find any changes in generated HTML.
  -Ideally, Integration tests should be written to verify the workflow. But since there are only a couple of API calls, I feel RoI would be very less. Subject to discussion.
