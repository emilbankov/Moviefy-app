import { icons } from '@/constants/icons';
import { getMovieDetails } from '@/services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

interface MovieInfoProps {
    label: string;
    value: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className='flex-col items-start justify-center mt-5'>
        <Text className='text-light-200 font-normal text-sm'>{label}</Text>
        <Text className='text-light-100 font-bold text-sm mt-2'>{value}</Text>
    </View>
)

const MovieDetails = () => {
    const { id } = useLocalSearchParams();
    const [movie, setMovie] = useState<Movie>();
    const [showPlayer, setShowPlayer] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // JavaScript to inject into WebView to block ads
    const injectedJavaScript = `
        (function() {
            // Block common ad elements
            const adSelectors = [
                'iframe[src*="ads"]',
                'iframe[src*="advertising"]',
                'div[class*="ad-"]',
                'div[id*="ad-"]',
                'div[class*="banner"]',
                'div[id*="banner"]',
                'div[class*="popup"]',
                'div[id*="popup"]'
            ];
            
            function removeAds() {
                adSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => el.remove());
                });
            }
            
            // Run immediately and set up observer
            removeAds();
            const observer = new MutationObserver(removeAds);
            observer.observe(document.body, { childList: true, subtree: true });
            
            // Prevent new windows from opening
            window.open = function() { return null; };
        })();
    `;

    useEffect(() => {
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
            ])
        );

        pulseAnimation.start();

        return () => {
            pulseAnimation.stop();
        };
    }, []);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await getMovieDetails(Number(id));
                setMovie(response.movies);
                console.log(movie?.production_companies);


            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (!movie) return null;

    return (
        <>
            <StatusBar hidden={true} />
            <View className='bg-primary flex-1'>
                {showPlayer ? (
                    <View className="flex-1 z-20">
                        <WebView 
                            source={{ uri: `https://vidsrc.net/embed/movie?tmdb=${movie.api_id}` }}
                            style={{ flex: 1 }}
                            injectedJavaScript={injectedJavaScript}
                            onLoadStart={() => setIsLoading(true)}
                            onLoadEnd={() => setIsLoading(false)}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            startInLoadingState={true}
                            allowsFullscreenVideo={true}
                            mediaPlaybackRequiresUserAction={false}
                        />
                        {isLoading && (
                            <View className="absolute inset-0 items-center justify-center bg-black/50">
                                <ActivityIndicator size="large" color="#f6be00" />
                            </View>
                        )}
                        <TouchableOpacity 
                            className="absolute top-5 left-5 bg-black/80 rounded-full p-3 z-50"
                            onPress={() => setShowPlayer(false)}
                        >
                            <Image
                                source={icons.arrow}
                                className="size-6"
                                tintColor="#fff"
                            />
                        </TouchableOpacity>
                    </View>
                ) : showTrailer ? (
                    <View className="flex-1 z-20">
                        <WebView 
                            source={{ uri: `https://www.youtube.com/embed/${movie.trailer}?autoplay=1` }}
                            style={{ flex: 1 }}
                            onLoadStart={() => setIsLoading(true)}
                            onLoadEnd={() => setIsLoading(false)}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            startInLoadingState={true}
                            allowsFullscreenVideo={true}
                            mediaPlaybackRequiresUserAction={false}
                        />
                        {isLoading && (
                            <View className="absolute inset-0 items-center justify-center bg-black/50">
                                <ActivityIndicator size="large" color="#f6be00" />
                            </View>
                        )}
                        <TouchableOpacity 
                            className="absolute top-5 left-5 bg-black/80 rounded-full p-3 z-50"
                            onPress={() => setShowTrailer(false)}
                        >
                            <Image
                                source={icons.arrow}
                                className="size-6"
                                tintColor="#fff"
                            />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                        <View>
                            <Image
                                source={{ uri: `${TMDB_IMAGE_URL}${movie.poster_path}` }}
                                className="w-full h-[550px]"
                                resizeMode="stretch"
                            />
                            <TouchableOpacity 
                                className="absolute inset-0 items-center justify-center z-[1000]"
                                onPress={() => setShowPlayer(true)}
                                activeOpacity={0.9}
                            >
                                <Animated.View 
                                    className="absolute rounded-full bg-accent"
                                    style={{
                                        width: 66,
                                        height: 66,
                                        transform: [{
                                            scale: pulseAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1.5, 1]
                                            })
                                        }],
                                        opacity: pulseAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 0.5]
                                        })
                                    }}
                                />
                                <View className="bg-accent backdrop-blur-sm rounded-full p-6">
                                    <View className="w-0 h-0 border-t-[14px] border-t-transparent border-l-[24px] border-l-white border-b-[14px] border-b-transparent ml-1" />
                                </View>
                            </TouchableOpacity>
                            <LinearGradient
                                colors={['transparent', 'rgba(3,0,20,0.5)', 'rgba(3,0,20,1)']}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: 400,
                                }}
                            />
                        </View>
                        <View className='flex-col items-start justify-center mt-5 px-5'>
                            <Text className='text-white font-bold text-xl'>{movie.title}</Text>
                            <View className='flex-row items-center mt-2 gap-x-1'>
                                <Text className='text-light-200 text-sm'>{movie.release_date}</Text>
                                <Text className='text-light-200 text-sm'>{movie.runtime}m</Text>
                            </View>
                            <View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md mt-2 gap-x-1'>
                                <Image
                                    source={icons.star}
                                    className="size-4"
                                />
                                <Text className='text-white font-bold text-sm'>{Math.round(movie.vote_average / 2)}</Text>
                            </View>
                            <MovieInfo label='Overview' value={movie.overview} />
                            <MovieInfo label='Genres' value={movie.genres.map((g) => g.name).join(" - ")} />
                            <MovieInfo label='Production companies' value={movie.production_companies.map((pc) => pc.name).join(", ")} />
                            
                            {movie.trailer && (
                                <View className="mt-8 mb-4">
                                    <Text className="text-white font-bold text-lg mb-4">Official Trailer</Text>
                                    <TouchableOpacity 
                                        className="relative w-full aspect-video rounded-xl overflow-hidden"
                                        onPress={() => setShowTrailer(true)}
                                    >
                                        <Image
                                            source={{ uri: `https://img.youtube.com/vi/${movie.trailer}/maxresdefault.jpg` }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                        <View className="absolute inset-0 bg-black/30 items-center justify-center">
                                            <View className="bg-black/50 rounded-full p-4">
                                                <Image
                                                    source={icons.play}
                                                    className="w-8 h-8"
                                                    tintColor="#fff"
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                )}

                <TouchableOpacity className='absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-10' onPress={router.back}>
                    <Image
                        source={icons.arrow}
                        className="size-5 mr-1 mt-0.5 rotate-180"
                        tintColor="#fff"
                    />
                    <Text className='text-white font-semibold text-base'>Go back</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default MovieDetails