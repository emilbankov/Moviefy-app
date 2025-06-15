import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import SearchResultRow from "@/components/SearchResultRow";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getTrendingMovies } from "@/services/api";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovies[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<TrendingMovies[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const fetchBannerMovies = async () => {
      try {
        const movies = await getTrendingMovies();
        setTrendingMovies(movies.movies);
      } catch (error) {
        console.error("Error fetching banner movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerMovies();
  }, []);

  const handleSearchResults = (results: TrendingMovies[]) => {
    setSearchResults(results);
  };

  const handleSearchFocus = (focused: boolean) => {
    setIsSearchFocused(focused);
    if (!focused) {
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-primary">
        <Image source={images.bg} className="absolute w-full z-0" />
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          className="flex-1 px-5"
          scrollEnabled={!isSearchFocused}
          keyboardShouldPersistTaps="always"
        >
          {searchResults.length > 0 && isSearchFocused && (
            <TouchableOpacity 
              activeOpacity={1}
              onPress={() => handleSearchFocus(false)}
              className="absolute inset-x-0 top-0 h-[140px] z-40"
            />
          )}

          <Image 
            source={icons.logo} 
            className="mt-20 mb-5 mx-auto" 
            resizeMode="contain"
          />

          <View className="flex-1 mt-5">
            <SearchBar 
              placeholder="Search for a movie" 
              onSearchResults={handleSearchResults}
              onFocusChange={handleSearchFocus}
            />
          </View>

          {searchResults.length > 0 && isSearchFocused && (
            <View className="absolute inset-x-0 top-[180px] bottom-0 z-40">
              <View className="absolute inset-x-0 top-0 h-[20px] bg-primary" />
              <TouchableOpacity 
                activeOpacity={1}
                onPress={() => handleSearchFocus(false)}
                className="absolute inset-x-0 top-[20px] bottom-0 bg-black/50"
              />
              <View 
                className="absolute left-5 right-5"
                style={{
                  position: 'absolute',
                  top: 20,
                  left: 0,
                  right: 0,
                  zIndex: 50,
                  ...Platform.select({
                    ios: {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    },
                    android: {
                      elevation: 5,
                    },
                  }),
                }}
              >
                <View className="bg-primary/95 rounded-xl">
                  <ScrollView 
                    className="max-h-[260px]"
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    scrollEventThrottle={16}
                  >
                    {searchResults.map((item) => (
                      <Link 
                        key={item.id.toString()}
                        href={`/movies/${item.id}`}
                        asChild
                      >
                        <TouchableOpacity activeOpacity={0.7}>
                          <SearchResultRow
                            title={item.title}
                            poster_path={item.poster_path}
                            vote_average={item.vote_average}
                            runtime={item.runtime}
                            type={item.type}
                            year={item.release_date}
                          />
                        </TouchableOpacity>
                      </Link>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
          )}

          <View className="mt-10">
            <FlatList
              data={trendingMovies}
              renderItem={({ item }) => (<MovieCard {...item} />)}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: 'flex-start',
                gap: 20,
                paddingRight: 5,
                marginBottom: 10
              }}
              scrollEnabled={false}
              className="pb-32 border-1"
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
