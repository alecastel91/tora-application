declare module 'all-the-cities' {
  export interface AllCitiesEntry {
    cityId: number;
    name: string;
    /** ISO 3166-1 alpha-2 country code */
    country: string;
    population: number;
    loc: { type: 'Point'; coordinates: [number, number] };
  }
  const cities: AllCitiesEntry[];
  export default cities;
}
