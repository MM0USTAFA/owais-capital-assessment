export interface IQueryBase {
  page?: number;
  limit?: number;
  skip?: number;
  sort?: string;
  fields?: number;
  popFields?: string;
  exclude?: string;
  search?: string;
  searchFields?: string;
  injects?: number;
  paranoid?: string;
  unlimited?: string;
  select?: string;
}
