import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { exact } from 'prop-types';
import { STATUS } from '../../constants';
import { StoreProvider } from '../../store';
import CurrencyConverter from '../CurrencyCoverter';

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
    status: STATUS.LOADING,
  },
};

const defaultProps = {
  idx: 'EUR-USD-0',
  exchangeObj: {
    id: 'EUR-USD-0',
    selectedFromAmount: 1,
    selectedFromCurrency: 'EUR',
    selectedToAmount: '1.19',
    selectedToCurrency: 'USD',
    showAdd: true,
  },
};

function renderCurrencyConverter(state, props) {
  return render(
    <StoreProvider initState={state}>
      <CurrencyConverter {...props} />
    </StoreProvider>
  );
}

describe('Currency Converter Component', () => {
  test('Should render Currency Converter Section', () => {
    renderCurrencyConverter(defaultState, defaultProps);
    expect(screen.getAllByTestId('currency-converter-EUR-USD-0')).toHaveLength(1);
  });

  test('Source Amount Input Field Validation', () => {
    renderCurrencyConverter(defaultState, defaultProps);
    const sourceAmount = screen.getByTestId('sourceAmount');
    expect(sourceAmount).toBeInTheDocument();
    expect(sourceAmount).toHaveAttribute('type', 'number');
  });

  test('Target Amount Input Field Validation', () => {
    renderCurrencyConverter(defaultState, defaultProps);
    const targetAmount = screen.getByTestId('targetAmount');
    expect(targetAmount).toBeInTheDocument();
    expect(targetAmount).toHaveAttribute('type', 'number');
    expect(targetAmount).toBeDisabled();
  });

  test('Calculate Excahnge Value', async () => {
    renderCurrencyConverter(defaultState, defaultProps);

    try {
      await userEvent.selectOptions(screen.getByTestId('selectFrom'), ['GBP']);
      expect(await screen.getByTestId('From-GBP').value).toBe('GBP');

      await userEvent.selectOptions(screen.getByTestId('selectTo'), ['INR']);
      expect(await screen.getByTestId('To-INR').value).toBe('INR');

      expect(await screen.getByTestId('sourceAmount').value).toBe('1');
      expect(await screen.getByTestId('targetAmount').value).toBe('102.67');

      userEvent.type(screen.getByTestId('sourceAmount'), 20);
      fireEvent.change(screen.getByTestId('sourceAmount'), { target: { value: '13' } });

      expect(await screen.getByTestId('sourceAmount').value).toBe('13');
      expect(await screen.getByTestId('targetAmount').value).toBe('1334.73');
    } catch (err) {
      expect(err).toEqual(new Error());
    }
  });

  test('Add  Currency Converter', () => {
    renderCurrencyConverter(defaultState, defaultProps);
    const AddButton = screen.getByRole('button', { exact: true, name: 'Add' });
    expect(AddButton);
    userEvent.click(AddButton);
    const DeleteButton = screen.getByRole('button', { exact: true, name: 'Delete' });
    exact(DeleteButton);
  });

  test('Switch Currency Converter', () => {
    renderCurrencyConverter(defaultState, defaultProps);
    const SwitchButton = screen.getByTestId('switch');
    userEvent.click(SwitchButton);
    expect(screen.getByTestId('sourceAmount').value).toBe('1.19');
    expect(screen.getByTestId('targetAmount').value).toBe('1');
  });
});
