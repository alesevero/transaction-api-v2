// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = await getCustomRepository(
      TransactionsRepository,
    );

    transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
