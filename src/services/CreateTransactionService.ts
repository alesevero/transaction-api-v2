import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

import GetCategoryService from './GetCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = await getCustomRepository(
      TransactionsRepository,
    );
    const balance = await transactionRepository.getBalance();
    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Not enough balance');
    }

    const getCategoryService = new GetCategoryService();
    const categoryEntity = await getCategoryService.execute({
      title: category,
    });

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryEntity.id,
    });

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
