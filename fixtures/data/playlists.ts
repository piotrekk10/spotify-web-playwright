export interface PlaylistDataType {
  id: string;
  name: string;
  description?: string;
  tracks: string[];
}

export const TEST_PLAYLIST: PlaylistDataType = {
  id: "0CvSoKCdzAZBzJXy4gfvWn",
  name: "Playwright playlist",
  tracks: [
    "7AdHRIORwlYIUTlY1Dfa0u",
    "70t7Q6AYG6ZgTYmJWcnkUM",
    "439QWVvom0eYfro3PXbmLL",
    "3brbdMEU51n2qaa3BKH7fu",
    "6Im8MI4Cm4V7YhOHumCPr9",
    "2EfD005MD0p1vMKj9MDZk7",
    "52ARmmXlYqRn6hfj3MOy3s",
    "3NtnDE9HsTHkpL63V06FOb",
  ],
};
