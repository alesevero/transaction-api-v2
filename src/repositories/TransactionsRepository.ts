import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    let { income } = await this.createQueryBuilder('transaction')
      .select('SUM(value)', 'income')
      .where('transaction.type = :type', { type: 'income' })
      .getRawOne();

    if (!income) {
      income = 0;
    }

    let { outcome } = await this.createQueryBuilder('transaction')
      .select('SUM(value)', 'outcome')
      .where('transaction.type = :type', { type: 'outcome' })
      .getRawOne();

    if (!outcome) {
      outcome = 0;
    }

    income = +income;
    outcome = +outcome;

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
