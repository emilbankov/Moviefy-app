import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getTrendingMovies } from "@/services/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, View } from "react-native";


export default function Index() {
  const router = useRouter();
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovies[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5">
        <Image 
          source={icons.logo} 
          className="mt-20 mb-5 mx-auto" 
          resizeMode="contain"
        />

        <View className="flex-1 mt-5">
          <SearchBar onPress={() => router.push("/search")} placeholder="Search for a movie" />
        </View>

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
          className="mt-10 pb-32 border-1"
        />
      </ScrollView>
    </View>
  );
}
