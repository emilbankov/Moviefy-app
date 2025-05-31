import { icons } from '@/constants/icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const MovieCard = ({ id, poster_path, title, year, vote_average, runtime }: TrendingMovies) => {
    return (
        <Link href={`/movies/${id}`} asChild>
            <TouchableOpacity className='w-[30%]'>
                <Image
                    source={{ uri: `${TMDB_IMAGE_URL}${poster_path}` }}
                    className="w-full h-52 rounded-lg"
                    resizeMode="cover"
                />
                <Text className='text-sm font-bold text-white mt-2' numberOfLines={1}>{title}</Text>
            
                <View className='flex-row items-center justify-start gap-x-1'>
                    <Image source={icons.star} className='size-4' />
                    <Text className='text-xs text-white font-bold uppercase'>{Math.round(vote_average / 2)}</Text>
                </View>

                <View className='flex-row items-center justify-between'>
                    <Text className='text-xs text-light-300 font-medium'>{runtime}m</Text>
                    <Text className='text-xs text-light-300 font-medium mt-1'>{year != null ? year : "2024"}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    )
}

export default MovieCard
