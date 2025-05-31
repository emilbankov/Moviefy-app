interface Movie {
  api_id: number;
  backdrop_path: string;
  cast: any[]; // Array of cast members (untyped)
  collection: any[]; // Array of collection items (untyped)
  collection_name: string;
  crew: any[]; // Array of crew members (untyped)
  genres: any[]; // Array of genres (untyped)
  id: number;
  original_title: string | null;
  overview: string;
  poster_path: string;
  production_companies: any[]; // Array of companies (untyped)
  release_date: string; // Format: YYYY-MM-DD
  runtime: number;
  title: string;
  trailer: string;
  vote_average: number;
}


interface TrendingMovies {
  id: number;
  poster_path: string;
  runtime: number;
  title: string;
  vote_average: number;
  year: number;
}

interface TrendingMovie {
  searchTerm: string;
  movie_id: number;
  title: string;
  count: number;
  poster_url: string;
}

interface MovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  } | null;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface TrendingCardProps {
  movie: TrendingMovie;
  index: number;
}