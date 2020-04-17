import path from 'path';
import csvtojson from 'csvtojson';
import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  public async execute(filename: string): Promise<Transaction[]> {
    const filepath = path.join(
      path.resolve(__dirname, '..', '__tests__'),
      filename,
    );
    const data = await csvtojson().fromFile(filepath);
    const createTransactionService = new CreateTransactionService();

    async function processArray(array: Request[]): Promise<Transaction[]> {
      const transactions: Transaction[] = [];
      for (const item of array) {
        const { title, type, value, category } = item;
        const transaction = await createTransactionService.execute({
          title,
          type,
          value,
          category,
        });
        transactions.push(transaction);
      }
      return transactions;
    }
    const transactions = await processArray(data);
    /* const transactions = await Promise.all(
      data.map(async transaction => {
        const createdTransaction = await createTransactionService.execute(
          transaction,
        );
        return createdTransaction;
      }),
    );
    return transactions; */
    return transactions;
  }
}

export default ImportTransactionsService;
