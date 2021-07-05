import { render, screen } from '@testing-library/react';
import { STATUS } from '../../constants';
import ExchangeList from '../ExchangeList';
import { StoreProvider } from '../../store';
import userEvent from '@testing-library/user-event';

const defaultState = {
  currencyExchange: {
    date: '',
    countries: [
      { code: 'AED', id: '784', name: 'United Arab Emirates dirham - AED' },
      { code: 'INR', id: '356', name: 'Indian rupee - INR' },
      { code: 'ALL', id: '008', name: 'Albanian lek - ALL' },
      { code: 'USD', id: '840', name: 'United States dollar - USD' },
      { code: 'ANG', id: '532', name: 'Netherlands Antillean guilder - ANG' },
      { code: 'AOA', id: '973', name: 'Angolan kwanza - AOA' },
      { code: 'ARS', id: '032', name: 'Argentine peso - ARS' },
      { code: 'AUD', id: '036', name: 'Australian dollar - AUD' },
      { code: 'GBP', id: '826', name: 'Pound sterling - GBP' },
    ],
    rates: {
      AED: 4.357638,
      INR: 88.184874,
      ALL: 122.644121,
      USD: 1.1852,
      ANG: 2.126044,
      AOA: 779.086207,
      ARS: 113.821159,
      AUD: 1.582587,
      GBP: 0.858903,
    },
    exchange: [
      {
        id: 'EUR-USD-0',
        selectedFromAmount: 1,
        selectedFromCurrency: 'EUR',
        selectedToAmount: '1.19',
        selectedToCurrency: 'USD',
        showAdd: true,
      },
    ],
    status: STATUS.IDLE,
  },
};

function renderExchangeList(state) {
  return render(
    <StoreProvider initState={state}>
      <ExchangeList />
    </StoreProvider>
  );
}

describe('Currency Converter Component', () => {
  test('Should render date', () => {
    renderExchangeList(defaultState);
    const date = screen.getByTestId('date');
    expect(date).toBeInTheDocument();
    expect(date).toHaveAttribute('type', 'date');
  });

  test('Should rerender on date change', () => {
    renderExchangeList(defaultState);
    userEvent.type(screen.getByTestId('date'), '2021-06-28');
    expect(screen.getByTestId('updating')).toBeInTheDocument();
  });

  test('Should render loading state', () => {
    const loadingState = { ...defaultState };
    loadingState.currencyExchange.status = STATUS.LOADING;
    renderExchangeList(loadingState);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  test('Should render error state', () => {
    const errorState = { ...defaultState };
    errorState.currencyExchange.status = STATUS.ERROR;
    renderExchangeList(errorState);
    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  test('Should render updating state', () => {
    const updatingState = { ...defaultState };
    updatingState.currencyExchange.status = STATUS.UPDATING;
    renderExchangeList(updatingState);
    expect(screen.getByTestId('updating')).toBeInTheDocument();
  });
});
