import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = await getCustomRepository(
    TransactionsRepository,
  );
  const transactions = await transactionRepository.find();
  const balance = await transactionRepository.getBalance();
  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransactionRepository = new CreateTransactionService();
  return response.json(
    await createTransactionRepository.execute({ title, value, type, category }),
  );
});

transactionsRouter.delete('/:id', async (request, response) => {
  await new DeleteTransactionService().execute({ id: request.params.id });
  return response.status(204).json();
});

transactionsRouter.post('/import', async (request, response) => {
  const importTransactionsService = new ImportTransactionsService();
  const transactions = await importTransactionsService.execute(
    'import_template.csv',
  );
  return response.json(transactions);
});

export default transactionsRouter;
