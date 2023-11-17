import { FindManyOptions, Not, In, ILike } from 'typeorm';
import { IQueryBase } from '../interfaces/query-base';

export class PgFilterService {
  public findManyOptions: FindManyOptions = {};
  private filterStaticFields: string[] = [
    'page',
    'limit',
    'skip',
    'sort',
    'fields',
    'popFields',
    'exclude',
    'search',
    'searchFields',
    'injects',
    'paranoid',
    'select',
  ];

  constructor(private queryObj: IQueryBase) {}

  private translateSortQuery(sortQuery = '') {
    if (!sortQuery) return undefined;

    const result: Record<string, 'ASC' | 'DESC'> = {};

    sortQuery?.split(',').forEach((field) => {
      if (field.startsWith('-')) {
        const sortField = field.substring(1);
        result[sortField] = 'DESC';
        return;
      }
      result[field] = 'ASC';
    });
    return result;
  }

  private translatePopPaths(qPopFields: string | undefined) {
    if (!qPopFields) return undefined;
    const result = {};
    const relations = qPopFields.split(',');

    relations.forEach((relation) => {
      this.resolvePopQuery(result, relation);
    });

    return result;
  }

  private translateSearchPaths(
    qSearchPaths: string | undefined,
    searchValue: string,
  ) {
    if (!qSearchPaths) return undefined;
    const paths = qSearchPaths.split(',');
    const results = [];

    paths.forEach((path) => {
      const result = this.resolveSearchQuery(path, searchValue);
      results.push(result);
    });

    return results;
  }

  private resolveSearchQuery(path: string, searchValue: string) {
    const result = {};

    let current = result;
    const fields = path.split('.');

    fields.forEach((field, idx) => {
      if (fields[idx + 1]) {
        current[field] = {};
        current = current[field];
        return;
      }

      current[field] = ILike(`%${searchValue}%`);
    });

    return result;
  }

  private resolvePopQuery(relObj: object, relation: string) {
    if (!relation) return;

    const parts = relation.split('.');
    let current = relObj;
    parts.forEach((part, idx) => {
      if (parts[idx + 1]) {
        current[part] = {};
        current = current[part];
        return;
      }
      current[part] = true;
    });
  }

  private resolveExCludeQuery(qExclude: string | undefined, exField: string) {
    const excludeItems = qExclude && qExclude.split(',');

    return excludeItems && excludeItems.length
      ? {
          [exField]: Not(In(excludeItems)),
        }
      : undefined;
  }

  public paginate(unlimited: boolean) {
    const { page = 1, limit = 10, skip = null } = this.queryObj;

    this.findManyOptions.skip = unlimited ? 0 : skip || (page - 1) * limit;
    this.findManyOptions.take = unlimited ? undefined : limit;
    return this;
  }

  public filter() {
    const clonedQuery = { ...this.queryObj };
    this.filterStaticFields.forEach((staticKey) => {
      Reflect.deleteProperty(clonedQuery, staticKey);
    });

    this.findManyOptions.where = clonedQuery;
    return this;
  }

  public sort() {
    const { sort: qSort } = this.queryObj;
    const sort = this.translateSortQuery(qSort || '-createdAt');
    this.findManyOptions.order = sort;
    return this;
  }

  public exclude(exField: string) {
    const { exclude: qExclude } = this.queryObj;
    const exclude = this.resolveExCludeQuery(qExclude, exField);
    if (!this.findManyOptions.where) this.findManyOptions.where = {};
    this.findManyOptions.where = { ...this.findManyOptions.where, ...exclude };
    return this;
  }

  public populate() {
    const { popFields: qPopFields } = this.queryObj;
    const popFields = this.translatePopPaths(qPopFields);
    this.findManyOptions.relations = popFields;
    return this;
  }

  public paranoid() {
    const { paranoid } = this.queryObj;

    this.findManyOptions.withDeleted =
      paranoid === 'all' || paranoid === 'only' || paranoid === '';

    if (paranoid === 'only') {
      this.findManyOptions.where = {
        ...(this.findManyOptions.where || {}),
        deletedAt: Not(null),
      };
    }

    return this;
  }

  public limitFields() {
    const { select } = this.queryObj;

    if (!select) return this;

    const fields = select.split(',');

    const result = fields.reduce((result, field) => {
      result[field] = true;
      return result;
    }, {});

    this.findManyOptions.select = result;

    return this;
  }

  public search() {
    const { search: searchValue, searchFields } = this.queryObj;

    if (!searchFields || !searchValue) return this;
    const conditionsQuery = this.translateSearchPaths(
      searchFields,
      searchValue,
    );

    this.findManyOptions.where = [
      this.findManyOptions.where,
      ...conditionsQuery,
    ];

    return this;
  }

  exec({ exFiled = 'id', unlimited = false } = {}): FindManyOptions {
    return this.filter()
      .exclude(exFiled)
      .paginate(unlimited)
      .sort()
      .populate()
      .limitFields()
      .search()
      .paranoid().findManyOptions;
  }
}
