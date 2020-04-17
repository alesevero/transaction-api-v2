import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface Request {
  title: string;
}

export default class GetCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    let category = await getRepository(Category).findOne({
      where: { title },
    });
    if (!category) {
      // create category
      category = await getRepository(Category).create({
        title,
      });
      await getRepository(Category).save(category);
    }
    return category;
  }
}
