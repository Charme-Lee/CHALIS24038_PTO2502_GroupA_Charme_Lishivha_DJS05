export const Genre_Titles = {
  1: "Personal Growth",
  2: "Investigative Journalism",
  3: "History",
  4: "Comedy",
  5: "Entertainment",
  6: "Business",
  7: "Fiction",
  8: "News",
  9: "Kids and Family",
};

export function mapGenres(ids = []) {
  return ids.map((id) => Genre_Titles[id] ?? `Genre ${id}`);
}
