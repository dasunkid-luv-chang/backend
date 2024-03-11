import { Logger, NotFoundException } from "@nestjs/common"
import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose"

export class AbstractRepository<T> {
  protected readonly logger: Logger

  constructor(protected readonly model: Model<T>) {}

  async create(entity: Partial<T>): Promise<T> {
    const createdEntity = new this.model(entity)
    return (await createdEntity.save()) as T
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<T> {
    const document = (await this.model.findOne(filterQuery, {}, { lean: true })) as T

    // if (!document) {
    //   this.logger.warn(`Document not found with filterQuery: ${JSON.stringify(filterQuery)}`)
    //   throw new NotFoundException("Document not found")
    // }

    return document
  }

  async findOneAndUpdate(filterQuery: FilterQuery<T>, update: UpdateQuery<T>): Promise<T> {
    const document = (await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    })) as T

    if (!document) {
      this.logger.warn(`Document not found with filterQuery: ${JSON.stringify(filterQuery)}`)
      throw new NotFoundException("Document not found")
    }

    return document
  }

  async find(filterQuery: FilterQuery<T>): Promise<T[]> {
    return (await this.model.find(filterQuery, {}, { lean: true })) as T[]
  }

  // QueryOptions: sort, limit, skip, projection ...
  async findById(id: string, option?: QueryOptions): Promise<T> {
    return this.model.findById(id, option)
  }
}
