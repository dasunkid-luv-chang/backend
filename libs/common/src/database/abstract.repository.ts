import { FilterQuery, Model, ProjectionType, UpdateQuery } from "mongoose"

interface IQueryOptions {
  sort?: any
  limit?: number
  skip?: number
  lean?: boolean
}

export class AbstractRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(entity: Partial<T>): Promise<T> {
    const createdEntity = new this.model(entity)
    return (await createdEntity.save()) as T
  }

  async count(filterQuery: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filterQuery)
  }

  async delete(filterQuery: FilterQuery<T>): Promise<void> {
    await this.model.deleteMany(filterQuery)
  }

  async update(
    filterQuery: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: IQueryOptions,
  ): Promise<void> {
    await this.model.updateMany(filterQuery, update, options)
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    return this.model.aggregate(pipeline)
  }

  async find(
    filterQuery: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: IQueryOptions,
  ): Promise<T[]> {
    return this.model.find(filterQuery, projection, options)
  }

  async findOne(
    filterQuery: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: IQueryOptions,
  ): Promise<T | null> {
    return this.model.findOne(filterQuery, projection, options)
  }

  async findById(id: string, projection?: ProjectionType<T>): Promise<T | null> {
    return this.model.findById(id, projection).exec()
  }
}
